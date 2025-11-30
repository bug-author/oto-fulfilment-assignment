import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';

@Module({
  imports: [ConfigModule],
  controllers: [PointsController],
  providers: [PointsService],
})
export class PointsModule {}
