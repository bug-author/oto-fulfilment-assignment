import { IsString, IsNumber, IsISO8601 } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddTransactionDto {
  @ApiProperty({
    description: "Name of the payer",
    example: "SHOPIFY",
  })
  @IsString()
  payer: string;

  @ApiProperty({
    description: "Points to add (can be negative for deductions)",
    example: 1000,
  })
  @IsNumber()
  points: number;

  @ApiProperty({
    description: "Transaction timestamp in ISO 8601 format",
    example: "2025-11-29T23:00:00Z",
  })
  @IsISO8601()
  timestamp: string;
}
