import { Injectable, OnModuleInit } from '@nestjs/common';
import  {PrismaClient} from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        try {
            await this.$connect();
            console.log('Connected to database')
        }catch (error) {
            console.error('Failed to connect to database');
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
        console.log('Disconnected from database')
    }
}