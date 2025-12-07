import { Schema } from "effect";

export const TransactionSchema = Schema.Struct({
  payer: Schema.String,
  points: Schema.Number,
  timestamp: Schema.Date,
});

export type Transaction = Schema.Schema.Type<typeof TransactionSchema>;
