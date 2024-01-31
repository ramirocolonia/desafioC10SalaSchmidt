import fs from "fs";

class ProductManager {
  constructor() {
    this.path = "../Products.json";
    this.products = [];
  }

  async loadProducts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf8");
      this.products = JSON.parse(data) || [];
    } catch (err) {
      console.error(err);
    }
  }

  async saveProducts() {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  existCode(code) {
    if (this.products.find((p) => p.code === code)) {
      return true;
    }
    return false;
  }
}

export default ProductManager;
