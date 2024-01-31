import express from "express";
import ProductManager from "../../ProductManager.js";

const router = express.Router();

router.get("/api/products", async (req, res) => {
  const prodManager = new ProductManager();
  let limit = req.query.limit;
  await prodManager.loadProducts();
  if (!isNaN(limit) && limit > 0) {
    res.json(prodManager.products.slice(0, limit));
  } else {
    res.json(prodManager.products);
  }
});

router.get("/api/products/:pid", async (req, res) => {
  const prodManager = new ProductManager();
  await prodManager.loadProducts();
  const idProd = parseInt(req.params.pid);
  const prod = prodManager.products.find((p) => p.id === idProd);
  if (prod) {
    res.json(prod);
  } else {
    res.status(404).json({ message: "Producto no encontrado" });
  }
});

router.post("/api/products", async (req, res) => {
  const prodManager = new ProductManager();
  await prodManager.loadProducts();
  const { title, description, code, price, stock, category } = req.body;
  const thumbs = req.body.thumbnails || [];
  if (!prodManager.existCode(code)) {
    let newProduct = {
      id: prodManager.products[prodManager.products.length - 1].id + 1,
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category
    };
    if (
      Object.values(newProduct).every(
        (value) => String(value).trim() !== "" && value !== undefined
      )
    ) {
      newProduct.thumbnails = thumbs;
      prodManager.products.push(newProduct);
      if (await prodManager.saveProducts()) {
        res
          .status(201)
          .json({ message: "Producto agregado correctamente", newProduct });
      } else {
        res.status(404).json({ message: "Error al guardar producto" });
      }
    } else {
      res.status(404).json({ message: "Faltan campos obligatorios" });
    }
  } else {
    res.status(404).json({ message: "El código ingresado ya existe" });
  }
});

router.put("/api/products/:pid", async (req, res) => {
  const prodManager = new ProductManager();
  await prodManager.loadProducts();
  const idProd = parseInt(req.params.pid);
  const { title, description, code, price, stock, category } = req.body;
  const thumbs = req.body.thumbnails || [];
  let prod = prodManager.products.find((p) => p.id === idProd);
  if (prod) {
    prod.title = title;
    prod.description = description;
    prod.code = code;
    prod.price = price;
    prod.stock = stock;
    prod.category = category;
    prod.thumbnails = thumbs;
    if (await prodManager.saveProducts()) {
      res
        .status(201)
        .json({ message: "Producto actualizado correctamente", prod });
    } else {
      res.status(404).json({ message: "Error al actualizar producto" });
    }
  } else {
    res.status(404).json({ message: "Error no existe el producto" });
  }
});

router.delete("/api/products/:pid", async (req, res) => {
  const prodManager = new ProductManager();
  await prodManager.loadProducts();
  const prod = prodManager.products.find((p) => p.id === parseInt(req.params.pid));
  if (prod) {
    const newProducts = prodManager.products.filter(({ id }) => id !== prod.id);
    prodManager.products = newProducts;
    if (await prodManager.saveProducts()) {
      res
        .status(201)
        .json({ message: "Producto eliminado correctamente", prod });
    } else {
      res.status(404).json({ message: "Error al eliminar producto" });
    }
  }else {
    res.status(404).json({ message: "Error no existe el producto" });
  }
});

export default router;
