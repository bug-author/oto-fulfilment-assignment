import { Controller, Get, Post, Body, HttpCode } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { PointsService } from "./points.service";
import { AddTransactionDto } from "./dto/add-transaction.dto";
import { SpendPointsDto } from "./dto/spend-points.dto";
import { SpendResponseDto } from "./dto/spend-response.dto";

@ApiTags("Points")
@Controller()
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Post("add")
  @HttpCode(200)
  @ApiOperation({ summary: "Add a transaction" })
  @ApiBody({ type: AddTransactionDto })
  @ApiResponse({ status: 200, description: "Transaction added successfully" })
  @ApiResponse({ status: 400, description: "Invalid request body" })
  addTransaction(@Body() dto: AddTransactionDto): void {
    this.pointsService.addTransaction(dto);
  }

  @Post("spend")
  @HttpCode(200)
  @ApiOperation({ summary: "Spend points" })
  @ApiBody({ type: SpendPointsDto })
  @ApiResponse({
    status: 200,
    description: "Points spent successfully",
    type: [SpendResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: "Insufficient points or invalid request",
  })
  spendPoints(@Body() dto: SpendPointsDto): SpendResponseDto[] {
    return this.pointsService.spendPoints(dto);
  }

  @Get("balance")
  @ApiOperation({ summary: "Get all payer balances" })
  @ApiResponse({
    status: 200,
    description: "Current balances for all payers",
    schema: {
      type: "object",
      example: { SHOPIFY: 1000, EBAY: 0, AMAZON: 5300 },
    },
  })
  getBalance(): Record<string, number> {
    return this.pointsService.getBalances();
  }
}
