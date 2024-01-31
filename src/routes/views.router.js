import express from "express";
import ProductManager from "../../ProductManager.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const prodManager = new ProductManager();
  await prodManager.loadProducts();
  const products = prodManager.products;
  res.render("home", { products });
});

router.get("/realtimeproducts", async(req,res)=>{
  const prodManager = new ProductManager();
  await prodManager.loadProducts();
  const products = prodManager.products;
  res.render("realTimeProducts", { products });
});



export default router;
