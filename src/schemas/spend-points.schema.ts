import { Schema } from "effect";

export const SpendPointsSchema = Schema.Struct({
  points: Schema.Number.pipe(Schema.positive()),
});

export type SpendPoints = Schema.Schema.Type<typeof SpendPointsSchema>;
