export const ROLE_ADMIN         = 'Admin';
export const ROLE_ORDER_QUERY   = 'OrderQuery';
export const ROLE_GENERIC_QUERY = 'GenericQuery';

/*
 * Dummy user → role map.
 */
export const USER_ROLE_MAP: Record<string, string> = {
  alice: ROLE_ADMIN,
  dave:  ROLE_ORDER_QUERY,
  bob:   ROLE_GENERIC_QUERY,
};