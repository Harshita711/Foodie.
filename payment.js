// Get cart and address data
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedAddress = JSON.parse(localStorage.getItem("selectedAddress")) || null;
const DELIVERY_FEE = 40;
let appliedCoupon = JSON.parse(localStorage.getItem("appliedCoupon")) || null;

// DOM Elements
const deliveryAddress = document.getElementById("delivery-address");
const changeAddressBtn = document.getElementById("change-address-btn");
const orderItems = document.getElementById("order-items");
const itemTotal = document.getElementById("item-total");
const deliveryFee = document.getElementById("delivery-fee");
const gstAmount = document.getElementById("gst-amount");
const totalAmount = document.getElementById("total-amount");
const discountAmount = document.getElementById("discount-amount");
const discountRow = document.getElementById("discount-row");
const placeOrderBtn = document.getElementById("place-order-btn");
const orderSuccessModal = document.getElementById("order-success-modal");
const orderIdDisplay = document.getElementById("order-id-display");
const estimatedTime = document.getElementById("estimated-time");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        window.location.href = "index.html";
        return;
    }
    
    loadAddress();
    loadOrderItems();
    calculateBill();
    setupEventListeners();
});

// Load address
function loadAddress() {
    if (selectedAddress) {
        deliveryAddress.innerHTML = `
            <div class="address-type">${selectedAddress.type.toUpperCase()}</div>
            <p><strong>${selectedAddress.street}</strong></p>
            <p>${selectedAddress.landmark ? selectedAddress.landmark + ', ' : ''}${selectedAddress.city} - ${selectedAddress.pincode}</p>
        `;
    } else {
        deliveryAddress.innerHTML = `
            <p style="color: #EF4444; font-weight: 600;">
                <i class="fa-solid fa-exclamation-triangle"></i>
                No delivery address selected
            </p>
        `;
    }
}

// Load order items
function loadOrderItems() {
    orderItems.innerHTML = "";
    
    cart.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "order-item";
        
        itemDiv.innerHTML = `
            <div>
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-qty">Qty: ${item.qty}</div>
            </div>
            <div style="font-weight: 600;">₹${(item.price * item.qty).toFixed(2)}</div>
        `;
        
        orderItems.appendChild(itemDiv);
    });
}

// Calculate bill
function calculateBill() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    // Get discount from bill page if applied
    const billDiscount = parseFloat(localStorage.getItem("discount")) || 0;
    
    const gst = (subtotal + DELIVERY_FEE) * 0.18;
    const total = subtotal + DELIVERY_FEE + gst - billDiscount;
    
    itemTotal.textContent = `₹${subtotal.toFixed(2)}`;
    deliveryFee.textContent = `₹${DELIVERY_FEE.toFixed(2)}`;
    gstAmount.textContent = `₹${gst.toFixed(2)}`;
    totalAmount.textContent = `₹${total.toFixed(2)}`;
    
    if (billDiscount > 0) {
        discountRow.style.display = "flex";
        discountAmount.textContent = `- ₹${billDiscount.toFixed(2)}`;
    }
}

// Place order
function placeOrder() {
    if (!selectedAddress) {
        alert("Please select a delivery address!");
        return;
    }
    
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    
    if (!selectedPayment) {
        alert("Please select a payment method!");
        return;
    }
    
    // Validate payment details
    if (selectedPayment.value === "upi") {
        const upiId = document.getElementById("upi-id").value.trim();
        if (!upiId) {
            alert("Please enter UPI ID!");
            return;
        }
    }
    
    if (selectedPayment.value === "card") {
        const cardNumber = document.getElementById("card-number").value.trim();
        const cardExpiry = document.getElementById("card-expiry").value.trim();
        const cardCvv = document.getElementById("card-cvv").value.trim();
        const cardName = document.getElementById("card-name").value.trim();
        
        if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
            alert("Please fill all card details!");
            return;
        }
    }
    
    if (selectedPayment.value === "netbanking") {
        const bank = document.getElementById("bank-select").value;
        if (!bank) {
            alert("Please select a bank!");
            return;
        }
    }
    
    // Generate order ID
    const orderId = "#ORD" + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const newOrder = {
        id: orderId,
        items: cart,
        total: totalAmount.textContent,
        address: selectedAddress,
        paymentMethod: selectedPayment.value,
        timestamp: new Date().toISOString(),
        status: "Preparing"
    };
    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));
    
    // Clear cart
    localStorage.removeItem("cart");
    localStorage.removeItem("discount");
    localStorage.removeItem("appliedCoupon");
    
    // Show success modal
    orderIdDisplay.textContent = orderId;
    estimatedTime.textContent = "30-40 mins";
    orderSuccessModal.classList.add("active");
}

// Setup event listeners
function setupEventListeners() {
    // Place order button
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener("click", placeOrder);
    }
    
    // Change address
    if (changeAddressBtn) {
        changeAddressBtn.addEventListener("click", () => {
            window.location.href = "index.html#address";
        });
    }
    
    // Payment method selection
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    paymentMethods.forEach(method => {
        method.addEventListener("change", () => {
            // Hide all payment details
            document.querySelectorAll(".payment-details").forEach(detail => {
                detail.style.display = "none";
            });
            
            // Show selected payment details
            const selectedDetails = document.getElementById(`${method.value}-details`);
            if (selectedDetails) {
                selectedDetails.style.display = "block";
            }
        });
    });
    
    // UPI verify button
    const verifyBtn = document.querySelector(".verify-btn");
    if (verifyBtn) {
        verifyBtn.addEventListener("click", () => {
            const upiId = document.getElementById("upi-id").value.trim();
            if (upiId) {
                alert("UPI ID verified successfully!");
            } else {
                alert("Please enter a valid UPI ID");
            }
        });
    }
    
    // Wallet buttons
    const walletBtns = document.querySelectorAll(".wallet-btn");
    walletBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            walletBtns.forEach(b => b.style.borderColor = "#E5E7EB");
            btn.style.borderColor = "#FF6B35";
        });
    });
    
    // Card number formatting
    const cardNumberInput = document.getElementById("card-number");
    if (cardNumberInput) {
        cardNumberInput.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\s/g, "");
            value = value.replace(/\D/g, "");
            e.target.value = value;
        });
    }
    
    // Card expiry formatting
    const cardExpiryInput = document.getElementById("card-expiry");
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener("input", (e) => {
            let value = e.target.value.replace(/\s/g, "");
            value = value.replace(/\D/g, "");
            if (value.length >= 2) {
                value = value.slice(0, 2) + "/" + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // CVV validation
    const cardCvvInput = document.getElementById("card-cvv");
    if (cardCvvInput) {
        cardCvvInput.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/\D/g, "");
        });
    }
    
    // Close success modal
    const modalCloseButtons = document.querySelectorAll(".close-modal");
    modalCloseButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            orderSuccessModal.classList.remove("active");
        });
    });
    
    // Hamburger menu
    const hamburger = document.querySelector(".hamburger");
    const mobileMenu = document.querySelector(".mobile-menu");
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener("click", (e) => {
            e.preventDefault();
            mobileMenu.classList.toggle("active");
        });
    }
}
