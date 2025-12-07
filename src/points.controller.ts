import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  BadRequestException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { Effect, Schema } from "effect";
import { PointsService } from "./points.service";
import { AddTransactionDto } from "./dto/add-transaction.dto";
import { SpendPointsDto } from "./dto/spend-points.dto";
import { SpendResponseDto } from "./dto/spend-response.dto";
import { AddTransactionSchema } from "./schemas/add-transaction.schema";
import { SpendPointsSchema } from "./schemas/spend-points.schema";
import { InsufficientPointsError } from "./points.errors";

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
  async addTransaction(@Body() dto: AddTransactionDto): Promise<void> {
    const validated = Schema.decodeUnknownSync(AddTransactionSchema)(dto);
    const effect = this.pointsService.addTransaction(validated);
    await Effect.runPromise(effect);
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
  async spendPoints(@Body() dto: SpendPointsDto): Promise<SpendResponseDto[]> {
    const validated = Schema.decodeUnknownSync(SpendPointsSchema)(dto);
    const effect = this.pointsService.spendPoints(validated);

    const either = await Effect.runPromise(Effect.either(effect));

    if (either._tag === "Left") {
      throw new BadRequestException(
        `Insufficient points: requested ${either.left.requested}, available ${either.left.available}`
      );
    }

    return either.right;
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
  async getBalance(): Promise<Record<string, number>> {
    const effect = this.pointsService.getBalances();
    return await Effect.runPromise(effect);
  }
}
