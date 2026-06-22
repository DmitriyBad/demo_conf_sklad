const screens = [...document.querySelectorAll("[data-screen]")];
const navButtons = [...document.querySelectorAll(".bottom-nav [data-screen-target]")];
const title = document.querySelector("[data-page-title]");
const cartBadge = document.querySelector("[data-cart-badge]");
const toast = document.querySelector("[data-toast]");

let cartCount = Number(cartBadge.textContent) || 0;
let toastTimer;

const navScreens = new Set(["store", "catalog", "orders", "chat", "profile"]);

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1700);
}

function showScreen(name) {
  const screen = screens.find((item) => item.dataset.screen === name);
  if (!screen) return;

  screens.forEach((item) => {
    const isActive = item === screen;
    item.classList.toggle("active", isActive);
    if (isActive) {
      const scroll = item.querySelector(".scroll-area");
      if (scroll) scroll.scrollTop = 0;
    }
  });

  title.textContent = screen.dataset.title || "Конфісклад";

  navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.screenTarget === name);
  });

  if (!navScreens.has(name)) {
    navButtons.forEach((button) => button.classList.remove("active"));
  }
}

document.addEventListener("click", (event) => {
  const targetButton = event.target.closest("[data-screen-target]");
  if (targetButton) {
    showScreen(targetButton.dataset.screenTarget);
    return;
  }

  const addButton = event.target.closest("[data-add-cart]");
  if (addButton) {
    cartCount += 1;
    cartBadge.textContent = cartCount;
    showToast("Товар додано в кошик");
    return;
  }

  const toastButton = event.target.closest("[data-demo-toast]");
  if (toastButton) {
    showToast(toastButton.dataset.demoToast);
    return;
  }

  if (event.target.closest("[data-confirm-order]")) {
    showToast("Замовлення KF-1043 створено");
  }
});

document.querySelectorAll(".category-row button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".category-row button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});

const allowedScreens = new Set(screens.map((screen) => screen.dataset.screen));
const initialScreen = new URLSearchParams(window.location.search).get("screen") || "catalog";
showScreen(allowedScreens.has(initialScreen) ? initialScreen : "catalog");
