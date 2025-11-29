import { plainToInstance } from 'class-transformer';
import { IsNumber, Min, Max, validateSync } from 'class-validator';

class EnvVariables {
  @IsNumber()
  @Min(1)
  @Max(65535)
  PORT: number = 3000;
}

export function validate(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validated;
}
