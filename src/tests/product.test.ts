import redisPubSubService from '../services/redisPubsub.service';

class ProductServiceTest {
  purchaseProduct(productId, quantity) {
    const order = {
      productId,
      quantity,
    };
    redisPubSubService.publish('purchase_events', JSON.stringify(order));
  }
}

export default new ProductServiceTest();
