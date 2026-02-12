let filteredRestaurants = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let addresses = JSON.parse(localStorage.getItem("addresses")) || [
    { type: "home", street: "123, MG Road", landmark: "Near Park", city: "Bangalore", pincode: "560001" }
];
let selectedAddress = JSON.parse(localStorage.getItem("selectedAddress")) || addresses[0] || null;

const restaurantsGrid = document.getElementById("restaurants-grid");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const filterChips = document.querySelectorAll(".filter-chip");
const noResults = document.getElementById("no-results");
const locationInput = document.getElementById("location-input");
const changeLocationBtn = document.getElementById("change-location");
const addressModal = document.getElementById("address-modal");
const addAddressModal = document.getElementById("add-address-modal");
const cartValue = document.querySelector(".cart-value");
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");

document.addEventListener("DOMContentLoaded", () => {
    filteredRestaurants = [...restaurantsData];
    updateCartCount();
    updateLocationDisplay();
    renderRestaurants();
    setupEventListeners();
});

function renderRestaurants() {
    if (filteredRestaurants.length === 0) {
        restaurantsGrid.style.display = "none";
        noResults.style.display = "block";
        return;
    }

    restaurantsGrid.style.display = "grid";
    noResults.style.display = "none";
    restaurantsGrid.innerHTML = "";

    filteredRestaurants.forEach(restaurant => {
        const isFavorite = favorites.includes(restaurant.id);
        const card = document.createElement("div");
        card.className = "restaurant-card";
        card.onclick = () => openRestaurant(restaurant.id);

        card.innerHTML = `
            <div class="restaurant-image">
                <img src="${restaurant.image}" alt="${restaurant.name}" onerror="this.src='images/pizza.png'">
                ${restaurant.veg ? '<span class="restaurant-badge">Pure Veg</span>' : ''}
                ${restaurant.offer ? `<span class="offer-badge"><i class="fa-solid fa-tag"></i> ${restaurant.offer}</span>` : ''}
            </div>
            <div class="restaurant-info">
    <h3>${restaurant.name}</h3>
    <p>${restaurant.cuisines.join(", ")}</p>

    <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
        onclick="toggleFavorite(event, ${restaurant.id})">
        <i class="fa-${isFavorite ? 'solid' : 'regular'} fa-heart"></i>
    </button>
</div>

<div class="restaurant-details">
    <div class="restaurant-rating">
        <i class="fa-solid fa-star"></i>
        ${restaurant.rating}
    </div>

    <div class="restaurant-time">
        <i class="fa-solid fa-clock"></i>
        ${restaurant.deliveryTime} mins
    </div>

    <div class="restaurant-footer">
        <i class="fa-solid fa-indian-rupee-sign"></i>
        ${restaurant.priceForTwo} for two
    </div>
</div>

        `;

        restaurantsGrid.appendChild(card);
    });
}

function searchRestaurants() {
    const query = searchInput.value.toLowerCase().trim();
    filteredRestaurants = restaurantsData.filter(r => 
        r.name.toLowerCase().includes(query) ||
        r.cuisines.some(c => c.toLowerCase().includes(query))
    );
    renderRestaurants();
}

function applyFilter(filter) {
    switch(filter) {
        case "all":
            filteredRestaurants = [...restaurantsData];
            break;
        case "rating":
            filteredRestaurants = restaurantsData.filter(r => r.rating >= 4.0);
            break;
        case "fast":
            filteredRestaurants = restaurantsData.filter(r => parseInt(r.deliveryTime) <= 30);
            break;
        case "offers":
            filteredRestaurants = restaurantsData.filter(r => r.offer);
            break;
        case "pure-veg":
            filteredRestaurants = restaurantsData.filter(r => r.veg);
            break;
        case "price-low":
            filteredRestaurants = [...restaurantsData].sort((a, b) => a.priceForTwo - b.priceForTwo);
            break;
    }
    renderRestaurants();
}

function toggleFavorite(event, restaurantId) {
    event.stopPropagation();
    const index = favorites.indexOf(restaurantId);
    
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(restaurantId);
    }
    
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderRestaurants();
}

function openRestaurant(id) {
    localStorage.setItem("currentRestaurant", id);
    window.location.href = "restaurant.html";
}

function updateLocationDisplay() {
    if (selectedAddress && locationInput) {
        locationInput.value = `${selectedAddress.street}, ${selectedAddress.city}`;
    }
}

function openAddressModal() {
    const savedAddressesDiv = document.getElementById("saved-addresses");
    savedAddressesDiv.innerHTML = "";

    addresses.forEach((addr) => {
        const addrCard = document.createElement("div");
        addrCard.className = "address-card";
        if (selectedAddress === addr) addrCard.classList.add("selected");
        
        addrCard.innerHTML = `
            <span class="address-type">${addr.type.toUpperCase()}</span>
            <p><strong>${addr.street}</strong></p>
            <p>${addr.landmark ? addr.landmark + ', ' : ''}${addr.city} - ${addr.pincode}</p>
        `;
        
        addrCard.onclick = () => {
            selectedAddress = addr;
            localStorage.setItem("selectedAddress", JSON.stringify(addr));
            updateLocationDisplay();
            closeModal(addressModal);
        };
        
        savedAddressesDiv.appendChild(addrCard);
    });

    addressModal.classList.add("active");
}

function closeModal(modal) {
    modal.classList.remove("active");
}

function saveAddress(event) {
    event.preventDefault();
    
    const addressType = document.querySelector(".address-type-btn.active").dataset.type;
    const newAddress = {
        type: addressType,
        street: document.getElementById("address-street").value,
        landmark: document.getElementById("address-landmark").value,
        city: document.getElementById("address-city").value,
        pincode: document.getElementById("address-pincode").value
    };
    
    addresses.push(newAddress);
    localStorage.setItem("addresses", JSON.stringify(addresses));
    selectedAddress = newAddress;
    localStorage.setItem("selectedAddress", JSON.stringify(newAddress));
    
    updateLocationDisplay();
    closeModal(addAddressModal);
    event.target.reset();
}

function updateCartCount() {
    if (!cartValue) return;
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartValue.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

function setupEventListeners() {
    if (searchBtn) searchBtn.addEventListener("click", searchRestaurants);
    if (searchInput) searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") searchRestaurants();
    });

    filterChips.forEach(chip => {
        chip.addEventListener("click", () => {
            filterChips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            applyFilter(chip.dataset.filter);
        });
    });

    if (changeLocationBtn) {
        changeLocationBtn.addEventListener("click", openAddressModal);
    }

    if (addressModal) {
        const closeButtons = addressModal.querySelectorAll(".close-modal");
        closeButtons.forEach(btn => {
            btn.addEventListener("click", () => closeModal(addressModal));
        });
    }

    if (addAddressModal) {
        const closeButtons = addAddressModal.querySelectorAll(".close-modal");
        closeButtons.forEach(btn => {
            btn.addEventListener("click", () => closeModal(addAddressModal));
        });
    }

    const addNewAddressBtn = document.getElementById("add-new-address");
    if (addNewAddressBtn) {
        addNewAddressBtn.addEventListener("click", () => {
            closeModal(addressModal);
            addAddressModal.classList.add("active");
        });
    }

    const addressForm = document.getElementById("address-form");
    if (addressForm) {
        addressForm.addEventListener("submit", saveAddress);
        
        const typeButtons = document.querySelectorAll(".address-type-btn");
        typeButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                typeButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
            });
        });
    }

    if (hamburger && mobileMenu) {
        hamburger.addEventListener("click", (e) => {
            e.preventDefault();
            mobileMenu.classList.toggle("active");
        });
    }

    window.addEventListener("click", (e) => {
        if (e.target === addressModal) closeModal(addressModal);
        if (e.target === addAddressModal) closeModal(addAddressModal);
    });
}

window.toggleFavorite = toggleFavorite;
window.openRestaurant = openRestaurant;
