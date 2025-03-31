import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token used for authenticating requests (bearer token)',
  })
  accessToken: string;

  @ApiProperty({
    example: 'bearer',
    description: 'Token type to be used in the Authorization header',
  })
  tokenType: string;

  @ApiProperty({
    example: 'Refresh token is set in HttpOnly cookie',
    description:
      'For security, the refresh token is set as an HttpOnly cookie and not returned in this response body.',
  })
  message: string;
}
