const socket = io();

socket.on("products", (products) => {
  const table = document.getElementById("productsTable");
  table.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Código</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Imagenes</th>            
        </tr>
    `;
  products.forEach((prod) => {
    table.innerHTML += `
            <tr>
                <td>${prod.id}</td>
                <td>${prod.title}</td>
                <td>${prod.code}</td>
                <td>${prod.price}</td>
                <td>${prod.stock}</td>
                <td>${prod.category}</td>
                <td>${prod.thumbnails}</td>
            </tr>
        `;
  });
});

document.getElementById("prodForm").addEventListener("submit", (e) => {
  e.preventDefault();
  let product = {
    title: document.getElementById("prodTitle").value,
    description: document.getElementById("prodDescription").value,
    code: document.getElementById("prodCode").value,
    price: document.getElementById("prodPrice").value,
    stock: document.getElementById("prodStock").value,
    category: document.getElementById("prodCategory").value,
    thumbnails: [document.getElementById("prodThumbnails").value],
  };
  socket.emit("newProduct", product);
  e.target.reset();
});

document.getElementById("removeForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("prodId").value;
  socket.emit("removeProduct", id);
  e.target.reset();
});
