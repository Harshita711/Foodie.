const currentRestaurantId = parseInt(localStorage.getItem("currentRestaurant"));
const restaurant = restaurantsData.find(r => r.id === currentRestaurantId);

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const restaurantName = document.getElementById("restaurant-name");
const restaurantCuisines = document.getElementById("restaurant-cuisines");
const restaurantRating = document.getElementById("restaurant-rating");
const restaurantTime = document.getElementById("restaurant-time");
const restaurantPrice = document.getElementById("restaurant-price");
const restaurantAddress = document.getElementById("restaurant-address");
const favoriteBtn = document.getElementById("favorite-btn");
const offersSection = document.getElementById("offers-section");
const offersCarousel = document.getElementById("offers-carousel");
const categoryList = document.getElementById("category-list");
const menuItems = document.getElementById("menu-items");
const menuSearch = document.getElementById("menu-search");
const cartFloat = document.getElementById("cart-float");
const cartItemsCount = document.getElementById("cart-items-count");
const cartTotalPrice = document.getElementById("cart-total-price");
const cartValue = document.querySelector(".cart-value");

document.addEventListener("DOMContentLoaded", () => {
    if (!restaurant) {
        window.location.href = "restaurants.html";
        return;
    }
    
    loadRestaurantDetails();
    loadMenu();
    updateCartDisplay();
    setupEventListeners();
});

function loadRestaurantDetails() {
    restaurantName.textContent = restaurant.name;
    restaurantCuisines.textContent = restaurant.cuisines.join(" • ");
    restaurantRating.textContent = restaurant.rating;
    restaurantTime.textContent = restaurant.deliveryTime;
    restaurantPrice.textContent = restaurant.priceForTwo;
    restaurantAddress.textContent = restaurant.address;
    
    const isFavorite = favorites.includes(restaurant.id);
    if (isFavorite) {
        favoriteBtn.classList.add("active");
        favoriteBtn.querySelector("i").className = "fa-solid fa-heart";
    }
    
    if (restaurant.offer) {
        offersSection.style.display = "block";
        offersCarousel.innerHTML = `
            <div class="offer-card">
                <h4>${restaurant.offer}</h4>
                <p>Use code: FOODIE${restaurant.id}</p>
            </div>
        `;
    }
}

function loadMenu() {
    const categories = Object.keys(restaurant.menu);
    
    categoryList.innerHTML = "";
    categories.forEach((category, index) => {
        const categoryItem = document.createElement("div");
        categoryItem.className = `category-item ${index === 0 ? 'active' : ''}`;
        categoryItem.textContent = category;
        categoryItem.onclick = () => scrollToCategory(category);
        categoryList.appendChild(categoryItem);
    });
    
    menuItems.innerHTML = "";
    categories.forEach(category => {
        const categorySection = document.createElement("div");
        categorySection.className = "menu-category";
        categorySection.id = `category-${category}`;
        
        const categoryTitle = document.createElement("h2");
        categoryTitle.className = "category-title";
        categoryTitle.textContent = category;
        categorySection.appendChild(categoryTitle);
        
        const itemsList = document.createElement("div");
        itemsList.className = "menu-items-list";
        
        restaurant.menu[category].forEach(item => {
            const menuItem = createMenuItem(item, category);
            itemsList.appendChild(menuItem);
        });
        
        categorySection.appendChild(itemsList);
        menuItems.appendChild(categorySection);
    });
}

function createMenuItem(item, category) {
    const itemDiv = document.createElement("div");
    itemDiv.className = "menu-item";
    
    const cartItem = cart.find(c => c.name === item.name && c.restaurantId === restaurant.id);
    const quantity = cartItem ? cartItem.qty : 0;
    
    itemDiv.innerHTML = `
        <div class="menu-item-info">
            <div class="item-type ${item.veg ? 'veg' : 'non-veg'}"></div>
            <h3 class="menu-item-name">${item.name}</h3>
            <p class="menu-item-price">₹${item.price}</p>
            <p class="menu-item-description">${item.description}</p>
        </div>
        <div class="menu-item-image-container">
            <img src="${item.image}" alt="${item.name}" class="menu-item-image" onerror="this.src='images/burger.png'">
            ${quantity === 0 ? 
                `<button class="add-to-cart-btn" onclick="addToCart('${item.name.replace(/'/g, "\\'")}', ${item.price}, '${item.image}', ${item.veg})">
                    ADD
                </button>` :
                `<div class="add-to-cart-btn" style="display: flex; justify-content: space-between; align-items: center; width: 120px; padding: 0.6rem 0.75rem;">
                    <button style="background: transparent; border: none; color: #FF6B35; font-size: 1.3rem; cursor: pointer; font-weight: 700;" onclick="updateCartQty('${item.name.replace(/'/g, "\\'")}', -1)">-</button>
                    <span style="font-weight: 700; color: #FF6B35; font-size: 1.1rem;">${quantity}</span>
                    <button style="background: transparent; border: none; color: #FF6B35; font-size: 1.3rem; cursor: pointer; font-weight: 700;" onclick="updateCartQty('${item.name.replace(/'/g, "\\'")}', 1)">+</button>
                </div>`
            }
        </div>
    `;
    
    return itemDiv;
}

function addToCart(name, price, image, veg) {
    const existingItem = cart.find(item => item.name === name && item.restaurantId === restaurant.id);
    
    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({
            name,
            price,
            qty: 1,
            img: image,
            veg,
            restaurantId: restaurant.id,
            restaurantName: restaurant.name
        });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
    loadMenu();
}

function updateCartQty(name, change) {
    const item = cart.find(c => c.name === name && c.restaurantId === restaurant.id);
    
    if (item) {
        item.qty += change;
        if (item.qty <= 0) {
            cart = cart.filter(c => !(c.name === name && c.restaurantId === restaurant.id));
        }
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
    loadMenu();
}

function updateCartDisplay() {
    const restaurantCart = cart.filter(item => item.restaurantId === restaurant.id);
    const totalItems = restaurantCart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = restaurantCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    if (totalItems > 0) {
        cartFloat.style.display = "block";
        cartItemsCount.textContent = `${totalItems} item${totalItems > 1 ? 's' : ''}`;
        cartTotalPrice.textContent = `₹${totalPrice}`;
    } else {
        cartFloat.style.display = "none";
    }
    
    if (cartValue) {
        const allItems = cart.reduce((sum, item) => sum + item.qty, 0);
        cartValue.textContent = allItems;
    }
}

function toggleFavorite() {
    const index = favorites.indexOf(restaurant.id);
    
    if (index > -1) {
        favorites.splice(index, 1);
        favoriteBtn.classList.remove("active");
        favoriteBtn.querySelector("i").className = "fa-regular fa-heart";
    } else {
        favorites.push(restaurant.id);
        favoriteBtn.classList.add("active");
        favoriteBtn.querySelector("i").className = "fa-solid fa-heart";
    }
    
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

function scrollToCategory(category) {
    const categoryElement = document.getElementById(`category-${category}`);
    if (categoryElement) {
        categoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        document.querySelectorAll(".category-item").forEach(item => {
            item.classList.remove("active");
        });
        event.target.classList.add("active");
    }
}

function searchMenu() {
    const query = menuSearch.value.toLowerCase().trim();
    const allMenuItems = document.querySelectorAll(".menu-item");
    
    allMenuItems.forEach(item => {
        const name = item.querySelector(".menu-item-name").textContent.toLowerCase();
        const description = item.querySelector(".menu-item-description").textContent.toLowerCase();
        
        if (name.includes(query) || description.includes(query)) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
}

function setupEventListeners() {
    if (favoriteBtn) {
        favoriteBtn.addEventListener("click", toggleFavorite);
    }
    
    if (menuSearch) {
        menuSearch.addEventListener("input", searchMenu);
    }
    
    const hamburger = document.querySelector(".hamburger");
    const mobileMenu = document.querySelector(".mobile-menu");
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener("click", (e) => {
            e.preventDefault();
            mobileMenu.classList.toggle("active");
        });
    }
}

window.addToCart = addToCart;
window.updateCartQty = updateCartQty;
window.scrollToCategory = scrollToCategory;
