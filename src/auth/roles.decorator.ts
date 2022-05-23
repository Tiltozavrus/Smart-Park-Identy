import { SetMetadata } from "@nestjs/common";
import { Role } from "./roles";

/**
 * Roles key in context
 *
 * @export
 * @constant ROLES_KEY
 */
export const ROLES_KEY = 'roles';

/**
 * Roles decorator
 *
 * @export
 * @function Roles
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);