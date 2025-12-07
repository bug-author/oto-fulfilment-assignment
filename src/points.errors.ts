import { Data } from "effect";

export class InsufficientPointsError extends Data.TaggedError(
  "InsufficientPointsError"
)<{
  readonly requested: number;
  readonly available: number;
}> {}
