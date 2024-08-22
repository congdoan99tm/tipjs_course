import cart from '../models/cart.model';
import { BadRequestError, NotFoundError } from '../core/error.response';
import { getProductById } from '../models/repositories/product.repo';

/*
  Key features: Cart Service
  -  add product to cart [user]
  - reduce product quantity by one
  - increase product quantity by one
  - get cart
  - delete cart 
  - delete cart item
  */
class CartService {
  ///  START REPO CART ////
  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: 'active' },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = {
        upsert: true,
        new: true,
      };
    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }
  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
        cart_userId: userId,
        'cart_products.productId': productId,
        cart_state: 'active',
      },
      updateSet = {
        $inc: {
          'cart_products.$.quantity': quantity,
        },
      },
      options = {
        upsert: true,
        new: true,
      };
    return await cart.findOneAndUpdate(query, updateSet, options);
  }
  ///  END REPO CART ////
  static async addToCart({ userId, product = {} }) {
    // check cart ton tai hay khong?
    const userCart = await cart.findOne({ cart_userId: userId });
    if (!userCart) {
      // create cart for User

      return await CartService.createUserCart({ userId, product });
    }
    //  neu co gio hang roi nhung chua co san pham
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    } else {
      //  neu co gio hang roi nhung chua co san pham nay trong list
      const isObjectExists = userCart.cart_products.find(
        (item) => item.productId === product['productId']
      );
      if (!isObjectExists) {
        userCart.cart_products.push(product);
        return await userCart.save();
      }
    }

    // gio hang ton tai, va co san pham nay thi update quantity
    return await CartService.updateUserCartQuantity({ userId, product });
  }
  // update
  /*
    shop_order_ids:[
        shopId,
        item_products:[
            {
                price,
                shopId,
                old_quantity,
                quantity,
                productId
            }
        ],
        version
    ]

    */
  static async addToCartV2({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0];
    // check product
    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError('Product not exists!');
    // compare
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError('Product do not belong to the shop');
    }

    if (quantity === 0) {
      // delete
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: { productId, quantity: quantity - old_quantity },
    });
  }

  static async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: 'active' },
      updateSet = {
        $pull: {
          cart_products: {
            productId,
          },
        },
      };
    const deleteCart = await cart.updateOne(query, updateSet);
    return deleteCart;
  }

  static async getListUserCart({ userId }) {
    return await cart
      .findOne({
        cart_userId: +userId,
      })
      .lean();
  }
}

export default CartService;
