import redisPubsubService from '../services/redisPubsub.service';

class InventoryServiceTest {
  constructor() {}

  static subscribe() {
    redisPubsubService.subscribe(
      'purchase_events',
      (channel: string, message: any) => {
        InventoryServiceTest.updateInventory(
          message.productId,
          message.quantity
        );
      }
    );
  }
  static updateInventory(productId: string, quantity: number) {
    console.log(`Updated inventory ${productId} with quantity ${quantity}`);
  }
}

export default InventoryServiceTest;
