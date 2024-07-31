import { AuthFailureError } from '../core/error.response';
import rbac from './role.middleware';
/**
 *
 * @param action // read, delete or update
 * @param resource // profile, balance/..
 */

const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      const rol_name = req.query.role;
      const permission = rbac.can(rol_name)[action](resource);
      if (!permission.granted) {
        throw new AuthFailureError('you dont have enough permissions...');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default grantAccess;
