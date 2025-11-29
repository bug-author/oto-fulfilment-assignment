import { Injectable, BadRequestException } from "@nestjs/common";
import { AddTransactionDto } from "./dto/add-transaction.dto";
import { SpendPointsDto } from "./dto/spend-points.dto";

interface Transaction {
  payer: string;
  points: number;
  timestamp: Date;
}

@Injectable()
export class AppService {
  private transactions: Transaction[] = [];

  addTransaction(dto: AddTransactionDto): void {
    this.transactions.push({
      payer: dto.payer,
      points: dto.points,
      timestamp: new Date(dto.timestamp),
    });
  }

  // oldest points spend first, and no payer can go negative
  spendPoints(dto: SpendPointsDto): Array<{ payer: string; points: number }> {
    const balances = this.getBalances();
    const totalAvailable = Object.values(balances).reduce(
      (sum, val) => sum + val,
      0
    );

    if (dto.points > totalAvailable) {
      throw new BadRequestException("Insufficient points");
    }

    const sortedTransactions = this.transactions
      .map((t, idx) => ({ ...t, idx }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    const availablePerTransaction = new Map<number, number>();
    for (const txn of sortedTransactions) {
      availablePerTransaction.set(txn.idx, txn.points);
    }

    // negative transactions (like SHOPIFY -200) reduce available points from earlier txns of same payer
    for (let i = 0; i < sortedTransactions.length; i++) {
      const txn = sortedTransactions[i];
      if (txn.points < 0) {
        let toDeduct = Math.abs(txn.points);
        for (let j = i - 1; j >= 0 && toDeduct > 0; j--) {
          const earlier = sortedTransactions[j];
          if (earlier.payer === txn.payer) {
            const available = availablePerTransaction.get(earlier.idx) || 0;
            if (available > 0) {
              const deduction = Math.min(available, toDeduct);
              availablePerTransaction.set(earlier.idx, available - deduction);
              toDeduct -= deduction;
            }
          }
        }
      }
    }

    let remaining = dto.points;
    const spending = new Map<string, number>();
    const payerBalances = new Map<string, number>(Object.entries(balances));

    for (const txn of sortedTransactions) {
      if (remaining <= 0) break;

      const available = availablePerTransaction.get(txn.idx) || 0;
      if (available <= 0) continue;

      const payerBalance = payerBalances.get(txn.payer) || 0;
      const canSpend = Math.min(available, remaining, payerBalance);

      if (canSpend > 0) {
        spending.set(txn.payer, (spending.get(txn.payer) || 0) + canSpend);
        payerBalances.set(txn.payer, payerBalance - canSpend);
        remaining -= canSpend;
      }
    }

    for (const [payer, amount] of spending.entries()) {
      this.transactions.push({
        payer,
        points: -amount,
        timestamp: new Date(),
      });
    }

    return Array.from(spending.entries()).map(([payer, points]) => ({
      payer,
      points: -points,
    }));
  }

  getBalances(): Record<string, number> {
    const balances: Record<string, number> = {};
    for (const txn of this.transactions) {
      balances[txn.payer] = (balances[txn.payer] || 0) + txn.points;
    }
    return balances;
  }
}
