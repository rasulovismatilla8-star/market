"use strict";

/* ==========================================================================
   Yordamchi: DOM elementlarni bir joyda yig'ib olamiz
   ========================================================================== */
const dom = {
  navToggle: document.querySelector(".nav-toggle"),
  nav: document.querySelector("#main-nav"),
  navLinks: document.querySelectorAll(".nav__link"),
  filterButtons: document.querySelectorAll("[data-filter]"),
  filterLinks: document.querySelectorAll("[data-filter-link]"),
  productItems: document.querySelectorAll(".products__item"),
  addButtons: document.querySelectorAll("[data-add-to-cart]"),
  cartCount: document.querySelector("#cart-count"),
  form: document.querySelector("#contact-form"),
  formSuccess: document.querySelector("#form-success"),
  year: document.querySelector("#year"),
};

/* ==========================================================================
   1. Mobil menyu
   ========================================================================== */
function setMenuState(isOpen) {
  dom.nav.classList.toggle("nav--open", isOpen);
  dom.navToggle.setAttribute("aria-expanded", String(isOpen));
  dom.navToggle.setAttribute("aria-label", isOpen ? "Menyuni yopish" : "Menyuni ochish");
}

function initMenu() {
  dom.navToggle.addEventListener("click", () => {
    const isOpen = dom.navToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  // Havolaga bosilganda menyu yopiladi
  dom.navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  // Escape tugmasi bilan yopish
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuState(false);
  });
}

/* ==========================================================================
   2. Mahsulotlarni filtrlash
   ========================================================================== */
function applyFilter(category) {
  dom.productItems.forEach((item) => {
    const isMatch = category === "all" || item.dataset.category === category;
    item.classList.toggle("products__item--hidden", !isMatch);
  });

  dom.filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === category;
    button.classList.toggle("filters__btn--active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function initFilters() {
  dom.filterButtons.forEach((button) => {
    button.addEventListener("click", () => applyFilter(button.dataset.filter));
  });

  // Kategoriyalar kartochkasidan ham filtrlash
  dom.filterLinks.forEach((link) => {
    link.addEventListener("click", () => applyFilter(link.dataset.filterLink));
  });
}

/* ==========================================================================
   3. Savat hisoblagichi
   ========================================================================== */
const cart = {
  count: 0,
};

function updateCartCount() {
  dom.cartCount.textContent = cart.count;
}

function showAddedFeedback(button) {
  const defaultText = button.textContent;

  button.textContent = "Qo'shildi ✓";
  button.classList.add("btn--added");

  setTimeout(() => {
    button.textContent = defaultText;
    button.classList.remove("btn--added");
  }, 1200);
}

function initCart() {
  dom.addButtons.forEach((button) => {
    button.addEventListener("click", () => {
      cart.count += 1;
      updateCartCount();
      showAddedFeedback(button);
    });
  });
}

/* ==========================================================================
   4. Aloqa formasi validatsiyasi
   ========================================================================== */
const PHONE_PATTERN = /^\+?[0-9\s\-()]{9,15}$/;

function setFieldError(fieldId, message) {
  const input = document.querySelector(`#${fieldId}`);
  const error = document.querySelector(`#${fieldId}-error`);

  error.textContent = message;
  input.classList.toggle("form__input--invalid", Boolean(message));
}

function validateForm() {
  const name = dom.form.elements.name.value.trim();
  const phone = dom.form.elements.phone.value.trim();
  let isValid = true;

  if (name.length < 2) {
    setFieldError("name", "Iltimos, ismingizni kiriting.");
    isValid = false;
  } else {
    setFieldError("name", "");
  }

  if (!PHONE_PATTERN.test(phone)) {
    setFieldError("phone", "Telefon raqamni to'g'ri kiriting.");
    isValid = false;
  } else {
    setFieldError("phone", "");
  }

  return isValid;
}

function initForm() {
  dom.form.addEventListener("submit", (event) => {
    event.preventDefault();
    dom.formSuccess.textContent = "";

    if (!validateForm()) return;

    // Bu yerda haqiqiy so'rov (fetch) yuborilishi mumkin
    dom.form.reset();
    dom.formSuccess.textContent = "Rahmat! Tez orada siz bilan bog'lanamiz.";
  });
}

/* ==========================================================================
   5. Footer yili
   ========================================================================== */
function initYear() {
  dom.year.textContent = new Date().getFullYear();
}

/* ==========================================================================
   Ishga tushirish
   ========================================================================== */
function init() {
  initMenu();
  initFilters();
  initCart();
  initForm();
  initYear();
}

document.addEventListener("DOMContentLoaded", init);