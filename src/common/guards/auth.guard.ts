import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../../auth/auth.service";
import { CustomLoggerService } from "../logger/logger.service";
import {Injector} from "@nestjs/core/injector/injector";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private logger: CustomLoggerService
    ) {}

    async  canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest();


            const userId = request.headers['x-user-id'];
            const userEmail = request.headers['x-user-email'];

            if (!userId || !userEmail) {
                throw new UnauthorizedException("Authentication failed, either user id or email is required");
            }

            const user = await this.authService.getUserById(parseInt(userId, 10));
            if(user.email.toLowerCase() !== userEmail.toLowerCase()) {
                throw new UnauthorizedException("Authentication Failed, please try again");
            }

            request.user = user;
            return true

        }catch (error) {
            this.logger.error(error.message, error.stack, "AuthGuard");
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException("Service temporarly unavailable!");
        }
    }
}