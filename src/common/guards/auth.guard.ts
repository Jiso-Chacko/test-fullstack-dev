import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../../auth/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService) {}

    async  canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const userId = request.headers['x-user-id'];
        const userEmail = request.headers['x-user-email'];


        if (!userEmail && !userEmail) throw  new UnauthorizedException("Authentication failed, Please try using user id or user email");

        try {
            let user;
            if (userId) user = await this.authService.getUserById(userId);
            else if(userEmail) user = await this.authService.getUserByEmail(userEmail);

            request.user = user;
            return true
        }catch (error) {
            throw new UnauthorizedException("Invalid Credentials");
        }
    }
}