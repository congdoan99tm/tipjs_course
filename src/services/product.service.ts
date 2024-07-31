// import { product, clothing, electronic } from '../models/product.model';
// import { BadRequestError } from '../core/error.response';

// // define Factory class to create product
// class ProductFactory {
//   static async createProduct(type, payload) {
//     switch (type) {
//       case 'Electronics':
//         return new Electronics(payload).createProduct();
//       case 'Clothing':
//         return new Clothing(payload).createProduct();

//       default:
//         throw new BadRequestError(`Invalid product Type ${type}`);
//     }
//   }
// }

// // define base product class
// /*
//    product_name: { type: String, require: true },
//     product_thumb: { type: String, require: true },
//     product_description: String,
//     product_price: { type: Number, require: true },
//     product_quantity: { type: Number, require: true },
//     product_type: {
//       type: String,
//       require: true,
//       enum: ['Electronics', 'Clothing', 'Furniture'],
//     },
//     product_shop: { type: Schema.Types.ObjectId, ref:'Shop' },
//     product_attributes: { type: Schema.Types.Mixed, require: true },

// */
// class Product {
//   constructor({
//     product_name,
//     product_thumb,
//     product_description,
//     product_price,
//     product_quantity,
//     product_type,
//     product_shop,
//     product_attributes,
//   }) {
//     (this.product_name = product_name),
//       (this.product_thumb = product_thumb),
//       (this.product_description = product_description),
//       (this.product_price = product_price),
//       (this.product_quantity = product_quantity),
//       (this.product_type = product_type),
//       (this.product_shop = product_shop),
//       (this.product_attributes = product_attributes);
//   }

//   // create product
//   async createProduct(productId) {
//     return await product.create({ ...this, _id: productId });
//   }
// }

// // define sub-class for different product types Clothing
// class Clothing extends Product {
//   async createProduct() {
//     const newClothing = await clothing.create({
//       ...this.product_attributes,
//       product_shop: this.product_shop,
//     });
//     if (!newClothing) return BadRequestError('Create new Clothing error');

//     const newProduct = super.createProduct(newClothing._id);
//     if (!newProduct) return BadRequestError('Create new Product error');

//     return newProduct;
//   }
// }

// // define sub-class for different product types Electronics
// class Electronics extends Product {
//   async createProduct() {
//     const newElectronic = await electronic.create({
//       ...this.product_attributes,
//       product_shop: this.product_shop,
//     });
//     if (!newElectronic) return BadRequestError('Create new Electronic error');

//     const newProduct = super.createProduct(newElectronic._id);
//     if (!newProduct) return BadRequestError('Create new Product error');

//     return newProduct;
//   }
// }

// export default ProductFactory;
