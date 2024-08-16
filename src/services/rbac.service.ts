/**
 *  new resource
 * @param {string} name
 * @param {string} slug
 * @param {string} description
 */

import resourceModel from '../models/resource.model';
import roleModel from '../models/role.model';

const createResource = async ({
  name = 'product',
  slug = 'p01',
  description = '',
}) => {
  try {
    //1 check name or slug exists

    //2 new resource
    const resource = await resourceModel.create({
      src_name: name,
      src_slug: slug,
      src_description: description,
    });

    return resource;
  } catch (error) {
    return error;
  }
};

const resourceList = async ({
  userId,
  limit = 30,
  offset = 0,
  search = '',
}) => {
  try {
    //1. check admin ? middleware function

    //2. get list of resource
    const resources = await resourceModel.aggregate([
      {
        $project: {
          _id: 0,
          name: '$src_name',
          slug: '$src_slug',
          description: '$src_description',
          resourceId: '$_id',
          createAt: 1,
        },
      },
    ]);
    return resources;
  } catch (error) {
    return [];
  }
};
const createRole = async ({
  name = 'shop',
  slug = 's01',
  description = 'extend from shop or user',
  grants = [],
}) => {
  try {
    //1. check role exists

    //2. new role
    const role = await roleModel.create({
      rol_name: name,
      rol_slug: slug,
      rol_description: description,
      rol_grants: grants,
    });
    return role;
  } catch (error) {
    return error;
  }
};
const roleList = async ({ userId, limit = 30, offset = 0, search = '' }) => {
  try {
  } catch (error) {}
};
export { createResource, resourceList, createRole, roleList };
