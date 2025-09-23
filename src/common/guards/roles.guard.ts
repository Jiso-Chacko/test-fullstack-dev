import { CanActivate, Injectable,  ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@prisma/client";
import {Observable} from "rxjs";

export const Roles = Reflector.createDecorator<Role>()

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
            context.getHandler(),
            context.getClass()
        ])

        if(!requiredRoles) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        return requiredRoles.includes(user.id);
    }

}