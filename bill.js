// ================= COUPON CODES =================
const COUPONS = {
  FOOD10: { type: "percentage", value: 10, minOrder: 0 },
  SAVE20: { type: "fixed", value: 20, minOrder: 0 },
  FEAST50: { type: "fixed", value: 50, minOrder: 500 },
};

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let appliedCoupon = null;
const DELIVERY_FEE = 40;

// DOM Elements
const itemsDiv = document.getElementById("bill-items");
const subtotalEl = document.getElementById("subtotal");
const deliveryFeeEl = document.getElementById("delivery-fee");
const gstEl = document.getElementById("gst");
const totalEl = document.getElementById("total");
const discountEl = document.getElementById("discount");
const discountRow = document.getElementById("discount-row");
const savingsAmount = document.getElementById("savings-amount");
const savingsBadge = document.getElementById("savings-badge");
const emptyCart = document.getElementById("empty-cart");
const billItemsContainer = document.getElementById("bill-items-container");
const cartValue = document.querySelector(".cart-value");

// ================= IMAGE HANDLING =================
function getImage(name) {
  // Handle both filename formats
  const cleanName = name.toLowerCase().replace(/\s+/g, "");
  return `images/${cleanName}.png`;
}

// ================= CART COUNT UPDATE =================
function updateCartCount() {
  if (cartValue) {
    cartValue.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  }
}

// ================= RENDER BILL =================
function render() {
  // Check if cart is empty
  if (cart.length === 0) {
    emptyCart.style.display = "block";
    billItemsContainer.style.display = "none";
    document.querySelector(".coupon-section").style.display = "none";
    document.querySelector(".summary").style.display = "none";
    document.querySelector(".action-buttons").style.display = "none";
    return;
  }

  emptyCart.style.display = "none";
  billItemsContainer.style.display = "block";
  document.querySelector(".coupon-section").style.display = "block";
  document.querySelector(".summary").style.display = "block";
  document.querySelector(".action-buttons").style.display = "flex";

  itemsDiv.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item, idx) => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;

    const div = document.createElement("div");
    div.className = "bill-item";

    // Determine image source
    let imgSrc;
    if (item.img && item.img.startsWith("images/")) {
      imgSrc = item.img;
    } else if (item.img && item.img.includes("/")) {
      // Extract filename from full path
      imgSrc = `images/${item.img.split("/").pop()}`;
    } else {
      imgSrc = getImage(item.name);
    }

    div.innerHTML = `
      <div class="item-left">
        <img src="${imgSrc}"
             class="food-img"
             onerror="this.src='images/default.png'" 
             alt="${item.name}">
        <div class="item-details">
          <div class="item-name">${item.name}</div>
          <div class="item-price">₹${item.price} each</div>
        </div>
      </div>
      <div class="item-controls">
        <button onclick="updateQty(${idx}, -1)" aria-label="Decrease quantity">
          <i class="fa-solid fa-minus"></i>
        </button>
        <span class="qty">${item.qty}</span>
        <button onclick="updateQty(${idx}, 1)" aria-label="Increase quantity">
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
      <div class="item-total">₹${itemTotal.toFixed(2)}</div>
    `;
    itemsDiv.appendChild(div);
  });

  // Calculate discount
  let discount = 0;
  if (appliedCoupon) {
    const coupon = COUPONS[appliedCoupon];
    if (subtotal >= coupon.minOrder) {
      if (coupon.type === "percentage") {
        discount = (subtotal * coupon.value) / 100;
      } else {
        discount = coupon.value;
      }
    }
  }

  // Calculate GST on subtotal (before discount)
  const gst = (subtotal + DELIVERY_FEE) * 0.18;
  
  // Calculate total
  const total = subtotal + DELIVERY_FEE + gst - discount;

  // Update UI
  subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
  deliveryFeeEl.textContent = subtotal > 0 ? `₹${DELIVERY_FEE.toFixed(2)}` : "₹0";
  gstEl.textContent = `₹${gst.toFixed(2)}`;
  totalEl.textContent = `₹${total.toFixed(2)}`;

  // Show/hide coupon section based on application
  const couponSection = document.querySelector(".coupon-section");
  const appliedCouponDiv = document.getElementById("applied-coupon-display");
  
  if (appliedCoupon && discount > 0) {
    // Show applied coupon with remove button
    if (!appliedCouponDiv) {
      const div = document.createElement("div");
      div.id = "applied-coupon-display";
      div.className = "applied-coupon";
      div.innerHTML = `
        <span><i class="fa-solid fa-check-circle"></i> Coupon "${appliedCoupon}" Applied! Saving ₹${discount.toFixed(2)}</span>
        <button class="remove-coupon-btn" onclick="removeCoupon()">Remove</button>
      `;
      couponSection.parentElement.insertBefore(div, couponSection.nextSibling);
    } else {
      appliedCouponDiv.innerHTML = `
        <span><i class="fa-solid fa-check-circle"></i> Coupon "${appliedCoupon}" Applied! Saving ₹${discount.toFixed(2)}</span>
        <button class="remove-coupon-btn" onclick="removeCoupon()">Remove</button>
      `;
    }
    discountRow.style.display = "flex";
    discountEl.textContent = `- ₹${discount.toFixed(2)}`;
    savingsBadge.style.display = "block";
    savingsAmount.textContent = `₹${discount.toFixed(2)}`;
  } else {
    if (appliedCouponDiv) {
      appliedCouponDiv.remove();
    }
    discountRow.style.display = "none";
    savingsBadge.style.display = "none";
  }

  // Update cart count
  updateCartCount();

  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ================= UPDATE QUANTITY =================
function updateQty(index, change) {
  cart[index].qty += change;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  render();
}

// ================= REMOVE COUPON =================
function removeCoupon() {
  appliedCoupon = null;
  const couponInput = document.getElementById("coupon-code");
  if (couponInput) couponInput.value = "";
  const couponMessage = document.getElementById("coupon-message");
  if (couponMessage) couponMessage.className = "coupon-message";
  render();
}

// Make functions globally available
window.updateQty = updateQty;
window.removeCoupon = removeCoupon;

// ================= COUPON FUNCTIONALITY =================
document.addEventListener("DOMContentLoaded", () => {
  const couponInput = document.getElementById("coupon-code");
  const applyBtn = document.getElementById("apply-coupon");
  const couponMessage = document.getElementById("coupon-message");
  const couponTags = document.querySelectorAll(".coupon-tag");

  // Apply coupon button
  applyBtn.addEventListener("click", () => {
    const code = couponInput.value.trim().toUpperCase();
    applyCoupon(code);
  });

  // Enter key to apply
  couponInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const code = couponInput.value.trim().toUpperCase();
      applyCoupon(code);
    }
  });

  // Click on coupon tags
  couponTags.forEach((tag) => {
    tag.addEventListener("click", () => {
      const code = tag.getAttribute("data-code");
      couponInput.value = code;
      applyCoupon(code);
    });
  });

  function applyCoupon(code) {
    if (!code) {
      showCouponMessage("Please enter a coupon code", "error");
      return;
    }

    if (!COUPONS[code]) {
      showCouponMessage("Invalid coupon code", "error");
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const coupon = COUPONS[code];

    if (subtotal < coupon.minOrder) {
      showCouponMessage(
        `Minimum order of ₹${coupon.minOrder} required for this coupon`,
        "error"
      );
      return;
    }

    appliedCoupon = code;
    let discountText = "";
    if (coupon.type === "percentage") {
      discountText = `${coupon.value}% discount applied!`;
    } else {
      discountText = `₹${coupon.value} discount applied!`;
    }
    showCouponMessage(discountText, "success");
    render();
  }

  function showCouponMessage(message, type) {
    couponMessage.textContent = message;
    couponMessage.className = `coupon-message ${type}`;
  }

  // Payment button
  const payBtn = document.querySelector(".pay-btn");
  payBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    // Save discount to pass to payment page
    const discountValue = discount;
    localStorage.setItem("discount", discountValue.toString());
    // Redirect to payment page
    window.location.href = "payment.html";
  });

  // Hamburger menu
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (hamburger) {
    hamburger.addEventListener("click", (e) => {
      e.preventDefault();
      mobileMenu.classList.toggle("mobile-menu-active");
    });
  }

  // Initial render
  render();
});
