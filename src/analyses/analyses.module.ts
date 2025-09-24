import { Module } from '@nestjs/common';
import { AnalysesService } from './analyses.service';
import { AnalysesController } from './analyses.controller';
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [AuthModule],
  providers: [AnalysesService],
  controllers: [AnalysesController]
})
export class AnalysesModule {}
