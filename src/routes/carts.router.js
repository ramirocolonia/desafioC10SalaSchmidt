import express from "express";
import CartManager from "../../CartManager.js";
import ProductManager from "../../ProductManager.js";

const router = express.Router();

router.post("/api/carts", async (req, res) => {
  const cartManager = new CartManager();
  await cartManager.loadCarts();
  const newCart = {
    id: cartManager.carts[cartManager.carts.length - 1].id + 1,
    products: [],
  };
  cartManager.carts.push(newCart);
  if (await cartManager.saveCarts()) {
    res.status(201).json({ message: "Carrito creado correctamente" });
  } else {
    res.status(404).json({ message: "Error al crear carrito" });
  }
});

router.get("/api/carts/:cid", async (req, res) => {
  const cartManager = new CartManager();
  await cartManager.loadCarts();
  const idCart = parseInt(req.params.cid);
  const cart = cartManager.carts.find((c) => c.id === idCart);
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ message: "Carrito no encontrado" });
  }
});

router.post("/api/carts/:cid/product/:pid", async (req, res) => {
  const cartManager = new CartManager();
  await cartManager.loadCarts();
  const productManager = new ProductManager();
  await productManager.loadProducts();
  const cart = cartManager.carts.find((c) => c.id === parseInt(req.params.cid));
  const prod = productManager.products.find((p) => p.id === parseInt(req.params.pid));
  if (cart) {
    if (prod) {
      let addQuantity = cart.products.find((p) => p.product === prod.id)
      if(addQuantity){
        addQuantity.quantity += 1
      }else{
        cart.products.push({ product: prod.id, quantity: 1 });
      }
      if (await cartManager.saveCarts()) {
        res
          .status(201)
          .json({ message: "Producto agregado correctamente en el carrito"});
      } else {
        res.status(404).json({ message: "Error al guardar producto" });
      }
    } else {
      res.status(404).json({ message: "Producto inexistente" });
    }
  } else {
    res.status(404).json({ message: "Carrito inexistente" });
  }
});

export default router;
