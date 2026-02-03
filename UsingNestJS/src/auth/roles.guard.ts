import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector }           from '@nestjs/core';
import { ROLES_KEY }           from './roles.decorator';
import { GqlExecutionContext } from '@nestjs/graphql/dist/services/gql-execution-context';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // ---------------------------------------------------------------
    // 1. Read the @Roles(…) metadata from the current handler.
    //    If the handler has NO @Roles decorator the guard passes
    //    through (public resolver).  This mirrors the behaviour of
    //    HotChocolate where un-decorated resolvers are open.
    // ---------------------------------------------------------------
    const roles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]   // handler first, then class
    );
    if (!roles || roles.length === 0) return true; // no role restriction

    // ---------------------------------------------------------------
    // 2. Extract the authenticated user from the GQL request context.
    //    NestJS + Apollo stores it on  gqlRequest.user  after the
    //    JwtStrategy populates it via AuthGuard('jwt').
    // ---------------------------------------------------------------

    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req?.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required.');
    }

    // ---------------------------------------------------------------
    // 3. Check whether the token's role is in the allowed set.
    // ---------------------------------------------------------------
    if (!roles.includes(user.role)) {
      throw new ForbiddenException(
        `Role "${user.role}" is not allowed. Required: ${roles.join(', ')}`
      );
    }

    return true;
  }
}