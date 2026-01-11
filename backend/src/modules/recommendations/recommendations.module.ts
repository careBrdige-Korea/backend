import { Module } from '@nestjs/common';
import {
  RecommendationsController,
  AdminRecommendationsController,
} from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';
import { ConsultationsModule } from '../consultations/consultations.module';
import { HospitalsModule } from '../hospitals/hospitals.module';

@Module({
  imports: [ConsultationsModule, HospitalsModule],
  controllers: [RecommendationsController, AdminRecommendationsController],
  providers: [RecommendationsService],
  exports: [RecommendationsService],
})
export class RecommendationsModule {}
