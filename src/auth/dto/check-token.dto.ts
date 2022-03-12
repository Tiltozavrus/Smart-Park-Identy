import { ApiProperty } from "@nestjs/swagger";
import { IsJWT } from "class-validator";

export class CheckTokenDto {
    @ApiProperty(
        {
            example: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJwYXlsb2FkIjp7InJvbGUiOiJhZG1pbiIsInVzZXJJZCI6Mn0sImlzc3VlZCI6MTY0NzA3MzI5MTk4NiwiZXhwaXJlcyI6MTY0NzE1OTY5MTk4Nn0.v_9Tx8tWre8VkqtF3eaxN8BvNmBstFBwSKYzuoIxd00nBV7_KCYlkOjXxJ4F0AfUvrSoyv1COdFF2K_cG8YlxA"
        }
    )
    @IsJWT()
    token: string
}