import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { AnalysesModule } from './analyses/analyses.module';
import { LoggerModule } from "./common/logger/logger.module";

@Module({
  imports: [LoggerModule ,PrismaModule, AuthModule, ProjectsModule, AnalysesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
