const cart = [];
const cartToggle = document.getElementById("cartToggle");
const cartDrawer = document.getElementById("cartDrawer");
const cartBackdrop = document.getElementById("cartBackdrop");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const drawerCount = document.getElementById("drawerCount");
const cartSubtotal = document.getElementById("cartSubtotal");

function money(amount) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);
}
function openCart() {
  cartDrawer.classList.add("open");
  cartBackdrop.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}
function closeCart() {
  cartDrawer.classList.remove("open");
  cartBackdrop.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
}
function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = count;
  drawerCount.textContent = `(${count})`;
  cartSubtotal.textContent = money(total);
  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your bag is waiting for something good.</p>';
  } else {
    cartItems.innerHTML = cart.map((item, index) => `
      <div class="cart-item">
        <div><h3>${item.name}</h3><p>${item.quantity} × ${money(item.price)}</p></div>
        <button class="remove-item" data-remove="${index}">Remove</button>
      </div>`).join("");
  }
}
document.querySelectorAll(".quick-add").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);
    const existing = cart.find(item => item.name === name);
    if (existing) existing.quantity += 1;
    else cart.push({ name, price, quantity: 1 });
    renderCart();
    openCart();
  });
});
cartItems.addEventListener("click", event => {
  const removeButton = event.target.closest("[data-remove]");
  if (!removeButton) return;
  cart.splice(Number(removeButton.dataset.remove), 1);
  renderCart();
});
cartToggle.addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);
document.addEventListener("keydown", event => { if (event.key === "Escape") closeCart(); });

document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    document.querySelectorAll(".product-col").forEach(card => {
      card.classList.toggle("d-none", filter !== "All" && card.dataset.category !== filter);
    });
  });
});
document.querySelectorAll("[data-filter-link]").forEach(link => {
  link.addEventListener("click", () => {
    const filter = link.dataset.filterLink;
    const button = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
    if (button) button.click();
  });
});
document.getElementById("newsletterForm").addEventListener("submit", event => {
  event.preventDefault();
  document.getElementById("newsletterMessage").textContent = "Thanks for your interest! Connect a mailing-list service to collect subscriptions.";
  event.target.reset();
});
document.getElementById("checkoutBtn").addEventListener("click", () => {
  const message = document.getElementById("checkoutMessage");
  message.textContent = cart.length ? "Demo checkout: connect a payment provider or WhatsApp order flow to accept real orders." : "Add something to your bag first.";
});
renderCart();