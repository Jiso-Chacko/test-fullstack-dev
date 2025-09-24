import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { winstonConfig } from "./logger.config";

@Injectable()
export class CustomLoggerService implements LoggerService {
    private  readonly logger: winston.Logger

    constructor() {
        const fs = require('fs');
        const path = require('path');
        const logDir = path.join(process.cwd(), 'logs');
        if(!fs.existsSync(logDir)){
            fs.mkdirSync(logDir, { recursive: true });
        }
        this.logger = winston.createLogger(winstonConfig)
    }

    log(message: any, context?:string) {
        this.logger.info(message, { context });
    }

    error(message: any, trace?:string ,context?:string) {
        this.logger.error(message, { context, stack: trace });
    }

    warn(message: any, context?:string) {
        this.logger.warn(message, { context });
    }


}