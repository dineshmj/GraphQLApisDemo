import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/*
 * Usage:  @Roles('Admin', 'OrderQuery')
 *
 * Attaches the allowed-role list as metadata on the handler.
 * RolesGuard reads it back at runtime.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);