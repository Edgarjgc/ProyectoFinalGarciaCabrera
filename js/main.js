let products = [];

fetch("./js/products.json")
  .then((response) => response.json())
  .then((data) => {
    products = data;
    loadProducts(products);
  });

const productsContainer = document.querySelector("#products-container");
const categoryButtons = document.querySelectorAll(".category-button");
const mainTitle = document.querySelector("#main-title");
let addButtons = document.querySelectorAll(".add-product");
const number = document.querySelector("#number");

categoryButtons.forEach((button) =>
  button.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
  })
);

function loadProducts(selectedProducts) {
  productsContainer.innerHTML = "";

  selectedProducts.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
            <img class="image-product" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="product-details">
                <h3 class="product-title">${producto.titulo}</h3>
                <p class="product-price">$${producto.precio}</p>
                <button class="add-product" id="${producto.id}">ADD TO     </button>
            </div>
        `;

    productsContainer.append(div);
  });

  updateAddButtons();
}

categoryButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    categoryButtons.forEach((button) => button.classList.remove("active"));
    e.currentTarget.classList.add("active");

    if (e.currentTarget.id != "All") {
      const productCategory = products.find(
        (producto) => producto.category.id === e.currentTarget.id
      );
      mainTitle.innerText = productCategory.category.nombre;
      const productsButton = products.filter(
        (producto) => producto.category.id === e.currentTarget.id
      );
      loadProducts(productsButton);
    } else {
      mainTitle.innerText = "All Products & Services";
      loadProducts(products);
    }
  });
});

function updateAddButtons() {
  addButtons = document.querySelectorAll(".add-product");

  addButtons.forEach((button) => {
    button.addEventListener("click", addToCart);
  });
}

let itemsInCart;

let itemsInCartLS = localStorage.getItem("items-in-cart");

if (itemsInCartLS) {
  itemsInCart = JSON.parse(itemsInCartLS);
  updateNumber();
} else {
  itemsInCart = [];
}

function addToCart(e) {
  Toastify({
    text: "Added To Cart",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #4b33a8, #785ce9)",
      borderRadius: "2rem",
      textTransform: "uppercase",
      fontSize: ".75rem",
    },
    offset: {
      x: "1.5rem",
      y: "1.5rem",
    },
    onClick: function () {},
  }).showToast();

  const idButton = e.currentTarget.id;
  const addedProduct = products.find((producto) => producto.id === idButton);

  if (itemsInCart.some((producto) => producto.id === idButton)) {
    const index = itemsInCart.findIndex((producto) => producto.id === idButton);
    itemsInCart[index].cantidad++;
  } else {
    addedProduct.cantidad = 1;
    itemsInCart.push(addedProduct);
  }

  updateNumber();

  localStorage.setItem("items-in-cart", JSON.stringify(itemsInCart));
}

function updateNumber() {
  let newNumber = itemsInCart.reduce(
    (acc, producto) => acc + producto.cantidad,
    0
  );
  number.innerText = newNumber;
}
