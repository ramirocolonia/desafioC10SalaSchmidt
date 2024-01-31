import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";

import __dirname from "./utils.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "../ProductManager.js";

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`servidor escuchando en el puerto ${PORT}`);
});

const io = new Server(httpServer);

// CONFIGURACION HANDLEBARS
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// RUTAS
app.use(express.static(__dirname + "/public"));
app.use("/", productsRouter);
app.use("/", cartsRouter);
app.use("/", viewsRouter);

let prodManager = new ProductManager();
// SOCKET SERVER
io.on("connection", async (socket) => {
  console.log("Conectado a socket server");
  try {
    await prodManager.loadProducts();
    io.emit("products", prodManager.products);
  } catch (error) {
    console.log("error en conexion a socket server " + error);
  }

  socket.on("newProduct", async (product) => {
    try {
      const { title, description, code, price, stock, category } = product;
      const thumbs = product.thumbnails || [];
      if (!prodManager.existCode(code)) {
        let newProduct = {
          id: prodManager.products[prodManager.products.length - 1].id + 1,
          title,
          description,
          code,
          price,
          status: true,
          stock,
          category,
        };
        if (
          Object.values(newProduct).every(
            (value) => String(value).trim() !== "" && value !== undefined
          )
        ) {
          newProduct.thumbnails = thumbs;
          prodManager.products.push(newProduct);
          if (await prodManager.saveProducts()) {
            io.emit("products", prodManager.products);
          } else {
            console.log("no se guardo!");
          }
        } else {
          console.log("campos vacios");
        }
      } else {
        console.log("existe codigo");
      }
    } catch (error) {
      console.log("error en socket emit " + error);
    }
  });

  socket.on("removeProduct", async (id) => {
    await prodManager.loadProducts();
    const prod = prodManager.products.find((p) => p.id === parseInt(id));
    if (prod) {
      const newProducts = prodManager.products.filter(({ id }) => id !== prod.id);
      prodManager.products = newProducts;
      if (await prodManager.saveProducts()) {
        io.emit("products", prodManager.products);
      } else {
        console.log("error al guardar productos");
      }
    } else {
      console.log("Error no existe el producto");
    }
  });
});
