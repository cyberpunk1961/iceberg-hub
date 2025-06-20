// ===================== FULL JavaScript (script.js) =====================
console.log("Welcome to Iceberg Hub!");

const productData = [
  { name: "Jordan 1 Air Travis Scott", price: 44.99, image: "./assets/shoe1.jpg" },
  { name: "Adidas Yeezy Boost", price: 30.99, image: "./assets/shoe2.jpg" },
  { name: "Jordan 1 Retro", price: 34.99, image: "./assets/shoe3.jpg" },
  { name: "Jordan 4 Ash/Grey and Green", price: 41.99, image: "./assets/shoe4.jpg" },
  { name: "New Balance 9060 White Unisex", price: 43.99, image: "./assets/shoe5.jpg" },
  { name: "Louis Vuitton Trainer", price: 39.99, image: "./assets/shoe6.jpg" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartDisplay() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    total += item.price * item.qty;
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${item.image}" alt="">
      <div><span>${item.name}</span><br><small>Size: ${item.size}</small><br><span>$${item.price.toFixed(2)}</span></div>
      <input type="number" min="1" value="${item.qty}" data-index="${i}" class="qty-input" />
      <button class="remove-btn" data-index="${i}">❌</button>`;
    cartItems.appendChild(li);
  });

  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = cart.reduce((s, i) => s + i.qty, 0);
  saveCart();
}

// Render products
const grid = document.getElementById("product-grid");
productData.forEach((prod, i) => {
  const div = document.createElement("div");
  div.className = "product-card";
  div.innerHTML = `
    <img src="${prod.image}" alt="${prod.name}">
    <h3>${prod.name}</h3>
    <p>$${prod.price.toFixed(2)}</p>
    <a href="#" class="buy-btn" data-index="${i}">Buy Now</a>`;
  grid.appendChild(div);
});

// Buy flow
document.addEventListener("click", e => {
  if (e.target.classList.contains("buy-btn")) {
    e.preventDefault();
    const i = +e.target.dataset.index;
    const size = prompt("Select size (38, 40, 42, 44):");
    if (!size) return;

    const found = cart.find(it => it.name === productData[i].name && it.size === size);
    found ? found.qty++ : cart.push({ ...productData[i], qty: 1, size });
    updateCartDisplay();
    showToast(`${productData[i].name} (Size ${size}) added!`);
  }

  if (e.target.classList.contains("remove-btn")) {
    const idx = +e.target.dataset.index;
    cart.splice(idx, 1);
    updateCartDisplay();
  }
});

// Qty update
document.getElementById("cart-items").addEventListener("input", e => {
  if (e.target.classList.contains("qty-input")) {
    const i = +e.target.dataset.index;
    cart[i].qty = Math.max(1, +e.target.value);
    updateCartDisplay();
  }
});

// Cart sidebar
document.getElementById("cart-icon").addEventListener("click", () => document.getElementById("cart-sidebar").classList.add("open"));
document.getElementById("close-cart").addEventListener("click", () => document.getElementById("cart-sidebar").classList.remove("open"));

// Checkout toggle
document.getElementById("checkout-btn").addEventListener("click", () => {
  const info = document.getElementById("payment-info");
  info.style.display = info.style.display === "none" ? "block" : "none";
});

// Dark mode
document.getElementById("toggle-dark").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

// Load preferences
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "true") document.body.classList.add("dark-mode");
  updateCartDisplay();
});

// Toast
function showToast(msg) {
  const t = document.createElement("div");
  t.className = "toast"; t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add("show"), 100);
  setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 500) }, 2000);
}

// In-page About
document.querySelector('a[href="#about"]').addEventListener("click", e => {
  e.preventDefault();
  const tpl = document.getElementById("about-template");
  document.getElementById("page-content").innerHTML = tpl.innerHTML;
  window.scrollTo({ top: document.getElementById("page-content").offsetTop, behavior: "smooth" });
});

// Login modal open
const modal = document.getElementById("login-modal");
document.getElementById("login-btn-main").addEventListener("click", () => modal.classList.remove("hidden"));
document.querySelector(".modal-close").addEventListener("click", () => modal.classList.add("hidden"));
