import fs from "fs";

class CartManager {
  constructor() {
    this.path = "../Carts.json";
    this.carts = [];
  }

  async saveCarts() {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async loadCarts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf8");
      this.carts = JSON.parse(data) || [];
    } catch (err) {
      console.error(err);
    }
  }
}

export default CartManager;
