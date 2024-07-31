'use strict';

import { product, clothing, electronic, furniture } from '../models/product.model';
import { BadRequestError } from '../core/error.response';
import {
  queryProduct,
  publishProductByShop,
  unPublishProductByShop,
  findAllDraftForShop,
  findAllPublishForShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} from '../models/repositories/product.repo';
import { removeUndefinedObject, updateNestedObjectParser } from '../utils';
import InventoryRepo from '../models/repositories/inventory.repo';
import { pushNotiToSystem } from './notification.service';
import shopModel from '../models/shop.model';
import { convertToObjectIdMongodb } from '../utils/index';

type ProductPayload = {
  product_name: string;
  product_thumb: string;
  product_description?: string;
  product_price: number;
  product_quantity: number;
  product_type: 'Electronics' | 'Clothing' | 'Furniture';
  product_shop?: string;
  product_attributes: any;
};

class Product {
  product_name: string;
  product_thumb: string;
  product_description?: string;
  product_price: number;
  product_quantity: number;
  product_type: 'Electronics' | 'Clothing' | 'Furniture';
  product_shop?: any;
  product_attributes: any;

  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }: ProductPayload) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  // create product
  async createProduct(productId: string) {
    const newProduct = await product.create({ ...this, _id: productId });
    if (newProduct) {
      // add product_stock in inventory collection
      await InventoryRepo.insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });
      // push Notify to list Notify
      const shopFound = await shopModel
        .findById(convertToObjectIdMongodb(this.product_shop))
        .lean();
      if (shopFound) {
        pushNotiToSystem({
          type: 'SHOP-001',
          receivedId: 1,
          senderId: this.product_shop,
          options: {
            product_name: this.product_name,
            shop_name: shopFound.name,
          },
        })
          .then((rs) => console.log(rs))
          .catch(console.error);
      }
    }
    return newProduct;
  }

  // update Product
  async updateProduct(productId: string, bodyUpdate: any) {
    return await updateProductById({ productId, bodyUpdate, model: product });
  }
}

// define sub-class for different product types Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) return new BadRequestError('Create new Clothing error');

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) return new BadRequestError('Create new Product error');

    return newProduct;
  }

  async updateProduct(productId: string) {
    const objectParams = removeUndefinedObject(this);
    if (objectParams.product_attributes) {
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: clothing,
      });
    }
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}

// define sub-class for different product types Electronics
class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) return new BadRequestError('Create new Electronic error');

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) return new BadRequestError('Create new Product error');

    return newProduct;
  }

  async updateProduct(productId: string) {
    const objectParams = removeUndefinedObject(this);
    if (objectParams.product_attributes) {
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: electronic,
      });
    }
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) return new BadRequestError('Create new Furniture error');

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) return new BadRequestError('Create new Product error');

    return newProduct;
  }

  async updateProduct(productId: string) {
    const objectParams = removeUndefinedObject(this);
    if (objectParams.product_attributes) {
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: furniture,
      });
    }
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}

// Define ProductFactory
class ProductFactory {
  private static productRegistry: { [key: string]: typeof Product } = {};

  static registerProductType(type: string, classRef: typeof Product) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type: string, payload: ProductPayload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError(`Invalid product Type ${type}`);
    }
    return new productClass(payload).createProduct(payload.product_shop || '');
  }

  static async updateProduct(type: string, productId: string, payload: ProductPayload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError(`Invalid product Type ${type}`);
    }
    return new productClass(payload).updateProduct(productId, payload);
  }

  static async publishProductByShop({
    product_shop,
    product_id,
  }: {
    product_shop: string;
    product_id: string;
  }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({
    product_shop,
    product_id,
  }: {
    product_shop: string;
    product_id: string;
  }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }

  static async findAllDraftsForShop({
    product_shop,
    limit = 50,
    skip = 0,
  }: {
    product_shop: string;
    limit?: number;
    skip?: number;
  }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftForShop({ query, limit, skip });
  }

  static async findAllPublishForShop({
    product_shop,
    limit = 50,
    skip = 0,
  }: {
    product_shop: string;
    limit?: number;
    skip?: number;
  }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
  }

  static async searchProduct({ keySearch }: { keySearch: string }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = { isPublished: true },
    select = ['product_name', 'product_price', 'product_thumb', 'product_shop'],
  }: {
    limit?: number;
    sort?: string;
    page?: number;
    filter?: any;
    select?: string[];
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select,
    });
  }

  static async findProducts({ product_id }: { product_id: string }) {
    return await findProduct({ product_id, unSelect: ['__v'] });
  }
}

// Register product types
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electronics', Electronics);
ProductFactory.registerProductType('Furniture', Furniture);

export default ProductFactory;
