let itemsInCart = localStorage.getItem("items-in-cart");
itemsInCart = JSON.parse(itemsInCart);

const emptyCartContainer = document.querySelector("#empty-cart");
const cartProductsContainer = document.querySelector("#cart-products");
const cartActionsContainer = document.querySelector("#cart-actions");
const purchasedCartContainer = document.querySelector("#cart-purchased");
let deleteButtons = document.querySelectorAll(".cart-product-delete");
const emptyButton = document.querySelector("#cart-actions-empty");
const totalContainer = document.querySelector("#total");
const buyButton = document.querySelector("#cart-actions-buy");

function loadCartProducts() {
  if (itemsInCart && itemsInCart.length > 0) {
    emptyCartContainer.classList.add("disabled");
    cartProductsContainer.classList.remove("disabled");
    cartActionsContainer.classList.remove("disabled");
    purchasedCartContainer.classList.add("disabled");

    cartProductsContainer.innerHTML = "";

    itemsInCart.forEach((producto) => {
      const div = document.createElement("div");
      div.classList.add("cart-product");
      div.innerHTML = `
                <img class="cart-product-image" src="${producto.imagen}" alt="${
        producto.title
      }">
                <div class="cart-product-title">
                    <small>Title</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="cart-product-quantity">
                    <small>Quantity</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="cart-product-price">
                    <small>Price</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="cart-product-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="cart-product-delete" id="${
                  producto.id
                }"><i class="bi bi-trash-fill"></i></button>
            `;

      cartProductsContainer.append(div);
    });

    updateDeleteButtons();
    updateTotal();
  } else {
    emptyCartContainer.classList.remove("disabled");
    cartProductsContainer.classList.add("disabled");
    cartActionsContainer.classList.add("disabled");
    purchasedCartContainer.classList.add("disabled");
  }
}

loadCartProducts();

function updateDeleteButtons() {
  deleteButtons = document.querySelectorAll(".cart-product-delete");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", removeFromCart);
  });
}

function removeFromCart(e) {
  Toastify({
    text: "Item deleted",
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
  const index = itemsInCart.findIndex((producto) => producto.id === idButton);

  itemsInCart.splice(index, 1);
  loadCartProducts();

  localStorage.setItem("items-in-cart", JSON.stringify(itemsInCart));
}

emptyButton.addEventListener("click", emptyCart);
function emptyCart() {
  Swal.fire({
    title:
      "Are you sure you want to empty your cart? This will remove all items and cannot be undone.",
    icon: "question",
    html: `Deleting ${itemsInCart.reduce(
      (acc, producto) => acc + producto.cantidad,
      0
    )} items.`,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  }).then((result) => {
    if (result.isConfirmed) {
      itemsInCart.length = 0;
      localStorage.setItem("items-in-cart", JSON.stringify(itemsInCart));
      loadCartProducts();
    }
  });
}

function updateTotal() {
  const calculatedTotal = itemsInCart.reduce(
    (acc, producto) => acc + producto.precio * producto.cantidad,
    0
  );
  const formattedTotal = calculatedTotal.toFixed(2);
  total.innerText = `$${formattedTotal}`;
}

buyButton.addEventListener("click", buyCart);
function buyCart() {
  itemsInCart.length = 0;
  localStorage.setItem("items-in-cart", JSON.stringify(itemsInCart));

  emptyCartContainer.classList.add("disabled");
  cartProductsContainer.classList.add("disabled");
  cartActionsContainer.classList.add("disabled");
  purchasedCartContainer.classList.remove("disabled");
}
