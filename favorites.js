let favoriteItems = JSON.parse(localStorage.getItem("favoriteItems")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", () => {
    renderFavorites();
    updateCounts();
    setupEventListeners();
});

function renderFavorites() {
    const emptyState = document.getElementById("empty-favorites");
    const favoritesContent = document.getElementById("favorites-content");
    const favoritesGrid = document.getElementById("favorites-grid");

    if (favoriteItems.length === 0) {
        emptyState.style.display = "flex";
        favoritesContent.style.display = "none";
        return;
    }

    emptyState.style.display = "none";
    favoritesContent.style.display = "block";
    favoritesGrid.innerHTML = "";

    favoriteItems.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "favorite-card";
        
        card.innerHTML = `
    <div class="favorite-image">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='images/default.png'">

        <button class="remove-favorite" onclick="removeFavorite(${index})">
            <i class="fa-solid fa-xmark"></i>
        </button>
    </div>

    <div class="favorite-details">
        <h3>${item.name}</h3>
        <p class="restaurant-name">
            <i class="fa-solid fa-store"></i> ${item.restaurant}
        </p>

        <div class="favorite-footer">
            <span class="favorite-price">₹${item.price}</span>

            <button class="btn btn-small" onclick="addToCartFromFavorite(${index})">
                <i class="fa-solid fa-cart-plus"></i> Add to Cart
            </button>
        </div>
    </div>
`;


        favoritesGrid.appendChild(card);
    });
}

function removeFavorite(index) {
    favoriteItems.splice(index, 1);
    localStorage.setItem("favoriteItems", JSON.stringify(favoriteItems));
    renderFavorites();
    updateCounts();
}

function addToCartFromFavorite(index) {
    const item = favoriteItems[index];

    const existing = cart.find(c =>
        c.name === item.name && c.restaurantId === item.restaurantId
    );

    if (existing) {
        existing.qty++;
    } else {
        cart.push({
            name: item.name,
            price: item.price,
            qty: 1,
            img: item.image,
            veg: item.veg,
            restaurantId: item.restaurantId,
            restaurantName: item.restaurant
        });
    }

    // save cart
    localStorage.setItem("cart", JSON.stringify(cart));

    // 🔥 REMOVE FROM FAVORITES AFTER ADDING
    favoriteItems.splice(index, 1);
    localStorage.setItem("favoriteItems", JSON.stringify(favoriteItems));

    renderFavorites();
    updateCounts();
}


function updateCounts() {
    const cartValue = document.querySelector(".cart-value");
    const favoritesCount = document.querySelector(".favorites-count");

    if (cartValue) {
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        cartValue.textContent = totalItems;
    }

    if (favoritesCount) {
        favoritesCount.textContent = favoriteItems.length;
    }
}

function setupEventListeners() {
    const hamburger = document.querySelector(".hamburger");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (hamburger && mobileMenu) {
        hamburger.addEventListener("click", (e) => {
            e.preventDefault();
            mobileMenu.classList.toggle("active");
        });
    }
}

window.removeFavorite = removeFavorite;
window.addToCartFromFavorite = addToCartFromFavorite;
