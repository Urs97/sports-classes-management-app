import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  accessToken: string;

  @ApiProperty({
    example: 'bearer',
    description: 'Token type for Authorization header',
  })
  tokenType: string;

  @ApiProperty({
    example: 'Refresh token is set in HttpOnly cookie',
    description:
      'The refresh token is NOT returned in the response body. It is set as an HttpOnly cookie (Set-Cookie header).',
  })
  message: string;
}
