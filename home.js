// Featured items from different restaurants
const featuredItems = [
    { name: "Double Chicken Burger", restaurant: "Burger King", restaurantId: 1, price: 200, image: "images/burger.png", veg: false },
    { name: "Farmhouse Special Pizza", restaurant: "Pizza Hut", restaurantId: 2, price: 300, image: "images/pizza.png", veg: true },
    { name: "Spaghetti Carbonara", restaurant: "Pizza Hut", restaurantId: 2, price: 220, image: "images/spaghetti.png", veg: false },
    { name: "Veg Delight Sub", restaurant: "Subway", restaurantId: 5, price: 150, image: "images/sandwich.png", veg: true },
    { name: "Spring Roll", restaurant: "Chinese Wok", restaurantId: 6, price: 120, image: "images/spring-roll.png", veg: true },
    { name: "Fried Chicken Bucket", restaurant: "KFC", restaurantId: 4, price: 450, image: "images/fried-chicken.png", veg: false },
    { name: "Chicken Roll", restaurant: "KFC", restaurantId: 4, price: 140, image: "images/chicken-roll.png", veg: false },
    { name: "Margherita", restaurant: "Domino's Pizza", restaurantId: 3, price: 200, image: "images/pizza.png", veg: true }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favoriteItems = JSON.parse(localStorage.getItem("favoriteItems")) || [];

document.addEventListener("DOMContentLoaded", () => {
    renderFeaturedItems();
    updateCounts();
    setupEventListeners();
});

function renderFeaturedItems() {
    const container = document.getElementById("popular-items");
    if (!container) return;

    container.innerHTML = "";

    featuredItems.forEach(item => {
        const isFavorite = favoriteItems.some(fav => fav.name === item.name);
        
        const card = document.createElement("div");
        card.style.cssText = "background: white; border-radius: 16px; padding: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: all 0.3s ease;";
        card.onmouseover = () => card.style.transform = "translateY(-8px)";
        card.onmouseout = () => card.style.transform = "translateY(0)";
        
        card.innerHTML = `
            <div style="position: relative; margin-bottom: 1rem;">
                <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 200px; object-fit: contain; border-radius: 12px;" onerror="this.src='images/burger.png'">
                <div style="position: absolute; top: 10px; left: 10px; width: 24px; height: 24px; border: 2px solid ${item.veg ? '#10B981' : '#EF4444'}; border-radius: 4px; background: white;">
                    <div style="width: 10px; height: 10px; border-radius: 50%; background: ${item.veg ? '#10B981' : '#EF4444'}; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></div>
                </div>
            </div>
            <h4 style="font-size: 1.2rem; margin-bottom: 0.5rem; color: #1F2937;">${item.name}</h4>
            <p style="color: #6B7280; font-size: 0.9rem; margin-bottom: 0.5rem;">from ${item.restaurant}</p>
            <h4 style="font-size: 1.4rem; color: #FF6B35; margin-bottom: 1rem;">₹${item.price}</h4>
            <div style="display: flex; gap: 0.75rem;">
                <button 
                    onclick="toggleItemFavorite('${item.name.replace(/'/g, "\\'")}', ${item.restaurantId}, '${item.restaurant.replace(/'/g, "\\'")}', ${item.price}, '${item.image}', ${item.veg})"
                    style="background: ${isFavorite ? 'rgba(239, 68, 68, 0.1)' : 'white'}; border: 2px solid ${isFavorite ? '#EF4444' : '#E5E7EB'}; color: ${isFavorite ? '#EF4444' : '#6B7280'}; width: 45px; height: 45px; border-radius: 50%; cursor: pointer; font-size: 1.2rem; transition: all 0.3s;">
                    <i class="fa-${isFavorite ? 'solid' : 'regular'} fa-heart"></i>
                </button>
                <button 
                    onclick="addItemToCart('${item.name.replace(/'/g, "\\'")}', ${item.restaurantId}, '${item.restaurant.replace(/'/g, "\\'")}', ${item.price}, '${item.image}', ${item.veg})"
                    class="btn" style="flex: 1; padding: 0.875rem;">
                    Add to Cart
                </button>
            </div>
        `;

        container.appendChild(card);
    });
}

function addItemToCart(name, restaurantId, restaurant, price, image, veg) {
    if (cart.length > 0 && cart[0].restaurantId !== restaurantId) {
        const confirm = window.confirm(`Your cart contains items from ${cart[0].restaurantName}. Do you want to clear the cart and add items from ${restaurant}?`);
        if (confirm) {
            cart = [];
            localStorage.removeItem("cart");
        } else {
            return;
        }
    }

    const existing = cart.find(item => item.name === name && item.restaurantId === restaurantId);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({
            name,
            price,
            qty: 1,
            img: image,
            veg,
            restaurantId,
            restaurantName: restaurant
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCounts();

    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = "Added!";
    btn.style.background = "#10B981";
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = "";
    }, 1000);
}

function toggleItemFavorite(name, restaurantId, restaurant, price, image, veg) {
    const index = favoriteItems.findIndex(item => item.name === name);

    if (index > -1) {
        favoriteItems.splice(index, 1);
    } else {
        favoriteItems.push({
            name,
            restaurantId,
            restaurant,
            price,
            image,
            veg
        });
    }

    localStorage.setItem("favoriteItems", JSON.stringify(favoriteItems));
    updateCounts();
    renderFeaturedItems();
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

window.addItemToCart = addItemToCart;
window.toggleItemFavorite = toggleItemFavorite;
