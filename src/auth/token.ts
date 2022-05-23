import {encode, TAlgorithm, decode} from 'jwt-simple'

/**
 * enum of experation status
 *
 * @export
 * @enum {number}
 */
export enum ExpirationStatus {
    /**
     * expired
     */
    Expired = "expired",
    /**
     * active
     */
    Active = "active"
}

/**
 * dedoce type enum show status of decode
 *
 * @export
 * @enum {number}
 */
export enum DecodeType {
    /**
     * valid
     */
    Valid = 1,
    /**
     * invalid
     */
    InvalidToken,
    /**
     * some error
     */
    IntegtiryError
}

export type CreateTokenFunc = (
    expiresFunc: CreateExpiresFunc,
) => CreatedToken;

export type CreateExpiresFunc = (issued: number) => number

/**
 * token info type
 *
 * @interface TokenInfo
 */
interface TokenInfo {
    /**
     * show in what date token issued
     *
     * @type {number}
     * @memberof TokenInfo
     */
    issued: number
    /**
     * show in what date token expired
     *
     * @type {number}
     * @memberof TokenInfo
     */
    expires: number
}

/**
 * payload generic type
 *
 * @export
 * @interface Payload
 * @extends {TokenInfo}
 * @template T
 */
export interface Payload<T> extends TokenInfo {
    /**
     * Payload 
     *
     * @type {T}
     * @memberof Payload
     */
    payload: T
}

/**
 * Created token type
 *
 * @export
 * @interface CreatedToken
 * @extends {TokenInfo}
 */
export interface CreatedToken extends TokenInfo {
    /**
     * jwt token in string represention
     *
     * @type {string}
     * @memberof CreatedToken
     */
    token: string
}

/**
 * decoded token type
 *
 * @export
 * @interface DecodedToken
 * @template T
 */
export interface DecodedToken<T> {
    /**
     * decoded type
     *
     * @type {DecodeType}
     * @memberof DecodedToken
     */
    type: DecodeType
    /**
     * payload can be optional
     *
     * @type {Payload<T>}
     * @memberof DecodedToken
     * @requires false
     */
    payload?: Payload<T>
    /**
     * experation status
     *
     * @type {ExpirationStatus}
     * @memberof DecodedToken
     * @requires false
     */
    expirationStatus?: ExpirationStatus
}

/**
 * token factory class
 * can create token refresh them
 *
 * @export
 * @class TokenFactory
 */
export class TokenFactory {
    /**
     * Creates an instance of TokenFactory.
     * @param {string} secretKey
     * @param {string} refreshSecretKey
     * @param {TAlgorithm} algorithm
     * @memberof TokenFactory
     */
    constructor(
        private readonly secretKey: string,
        private readonly refreshSecretKey: string,
        private readonly algorithm: TAlgorithm
    ) {}

    /**
     * create token with given payload
     *
     * @template T
     * @param {T} payload
     * @return {*}  {CreateTokenFunc}
     * @memberof TokenFactory
     */
    createToken<T>(payload: T): CreateTokenFunc {
        return this.createSomeToken<T>(payload, this.secretKey)
    }

    /**
     * create refresh token with given payload
     *
     * @template T
     * @param {T} payload
     * @return {*}  {CreateTokenFunc}
     * @memberof TokenFactory
     */
    createRefreshToken<T>(payload: T): CreateTokenFunc {
        return this.createSomeToken(payload, this.refreshSecretKey)
    }

    /**
     * create refresh or access token
     *
     * @private
     * @template T
     * @param {T} payload
     * @param {string} key
     * @return {*}  {CreateTokenFunc}
     * @memberof TokenFactory
     */
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

    /**
     * decode refresh or access token
     *
     * @private
     * @template T
     * @param {string} token
     * @param {string} key
     * @return {*}  {DecodedToken<T>}
     * @memberof TokenFactory
     */
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

    /**
     * decode access token
     *
     * @template T
     * @param {string} token
     * @return {*}  {DecodedToken<T>}
     * @memberof TokenFactory
     */
    decodeToken<T>(token: string): DecodedToken<T> {
        return this.decodeSomeToken(token, this.secretKey)
    }

    /**
     * decode refresh token
     *
     * @template T
     * @param {string} token
     * @return {*}  {DecodedToken<T>}
     * @memberof TokenFactory
     */
    decodeRefreshToken<T>(token: string): DecodedToken<T> {
        return this.decodeSomeToken(token, this.refreshSecretKey)
    }

    /**
     * check expiration status of token
     *
     * @private
     * @param {number} expires
     * @return {*}  {ExpirationStatus}
     * @memberof TokenFactory
     */
    private checkExpirationStatus(expires: number): ExpirationStatus {
        const now = Date.now()

        if (expires > now) {
            return ExpirationStatus.Active
        }

        return ExpirationStatus.Expired
    }
}