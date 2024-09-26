import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Request } from 'express';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException();
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'batman',
      });
      request['user'] = payload;

      const requiredRoles = this.reflector.get<string[]>(
        'roles',
        context.getHandler(),
      );

      if (requiredRoles && !requiredRoles.includes(payload.role)) {
        throw new ForbiddenException(
          'You do not have permission to access this resource',
        );
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
