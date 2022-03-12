import {encode, TAlgorithm, decode} from 'jwt-simple'

export enum ExpirationStatus {
    Expired = "expired",
    Active = "active"
}

export enum DecodeType {
    Valid = 1,
    InvalidToken,
    IntegtiryError
}

export type CreateTokenFunc = (
    expiresFunc: CreateExpiresFunc,
) => CreatedToken;

export type CreateExpiresFunc = (issued: number) => number

interface TokenInfo {
    issued: number
    expires: number
}

export interface Payload<T> extends TokenInfo {
    payload: T
}

export interface CreatedToken extends TokenInfo {
    token: string
}

export interface DecodedToken<T> {
    type: DecodeType
    payload?: Payload<T>
    expirationStatus?: ExpirationStatus
}

export class TokenFactory {
    constructor(
        private readonly secretKey: string,
        private readonly refreshSecretKey: string,
        private readonly algorithm: TAlgorithm
    ) {}

    createToken<T>(payload: T): CreateTokenFunc {
        return this.createSomeToken<T>(payload, this.secretKey)
    }

    createRefreshToken<T>(payload: T): CreateTokenFunc {
        return this.createSomeToken(payload, this.refreshSecretKey)
    }

    private createSomeToken<T>(payload: T, key: string): CreateTokenFunc {
        const createTokenFunc: CreateTokenFunc = (expiresFunc: CreateExpiresFunc) => {
            const now = Date.now()
            const expires = expiresFunc(now)
            const tokenInfo: TokenInfo = {
                issued: now,
                expires: expires
            }
            const _payload: Payload<T> = {
                payload: payload,
                ...tokenInfo,
            }

            return {
                ...tokenInfo,
                token: encode(_payload, key, this.algorithm)
            }
        }

        return createTokenFunc
    }

    private decodeSomeToken<T>(token: string, key: string): DecodedToken<T> {
        let result: Payload<T>
        try {
            result = decode(token, key, false, this.algorithm)
        } catch(_e) {
            const e: Error = _e

            if (e.message === "No token supplied" || e.message === "Not enough or too many segments") {
                return {
                    type: DecodeType.InvalidToken
                };
            }
    
            if (e.message === "Signature verification failed" || e.message === "Algorithm not supported") {
                return {
                    type: DecodeType.IntegtiryError
                };
            }
    
            // Handle json parse errors, thrown when the payload is nonsense
            if (e.message.indexOf("Unexpected token") === 0) {
                return {
                    type: DecodeType.InvalidToken
                };
            }
    
            throw e;
        }

        return {
            payload: result,
            type: DecodeType.Valid,
            expirationStatus: this.checkExpirationStatus(result.expires)
        }
    }

    decodeToken<T>(token: string): DecodedToken<T> {
        return this.decodeSomeToken(token, this.secretKey)
    }

    decodeRefreshToken<T>(token: string): DecodedToken<T> {
        return this.decodeSomeToken(token, this.refreshSecretKey)
    }

    private checkExpirationStatus(expires: number): ExpirationStatus {
        const now = Date.now()

        if (expires > now) {
            return ExpirationStatus.Active
        }

        return ExpirationStatus.Expired
    }
}