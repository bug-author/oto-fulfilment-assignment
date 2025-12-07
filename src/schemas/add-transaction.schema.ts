import { Schema } from "effect";

export const AddTransactionSchema = Schema.Struct({
  payer: Schema.String,
  points: Schema.Number,
  timestamp: Schema.String.pipe(Schema.pattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/)),
});

export type AddTransaction = Schema.Schema.Type<typeof AddTransactionSchema>;
