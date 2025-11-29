import { ApiProperty } from '@nestjs/swagger';

export class SpendResponseDto {
  @ApiProperty({
    description: 'Name of the payer',
    example: 'SHOPIFY',
  })
  payer: string;

  @ApiProperty({
    description: 'Points spent (negative value)',
    example: -100,
  })
  points: number;
}
