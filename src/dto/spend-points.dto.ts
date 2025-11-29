import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SpendPointsDto {
  @ApiProperty({
    description: 'Number of points to spend',
    example: 5000,
  })
  @IsNumber()
  @IsPositive()
  points: number;
}
