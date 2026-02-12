// Complete restaurant data with menus
const restaurantsData = [
    {
        id: 1,
        name: "Burger King",
        image: "images/burger-king.jpeg",
        cuisines: ["Burgers", "American", "Fast Food"],
        rating: 4.3,
        deliveryTime: "30-35",
        priceForTwo: 350,
        address: "MG Road, Bangalore",
        offer: "50% OFF up to ₹100",
        veg: false,
        menu: {
            "Burgers": [
                { name: "Double Chicken Burger", price: 200, description: "Double patty chicken burger with cheese and special sauce", veg: false, image: "images/double-chicken-burger.jpeg" },
                { name: "Veg Whopper", price: 180, description: "Classic veggie whopper with fresh vegetables", veg: true, image: "images/vegburger.png" },
                { name: "Chicken Whopper", price: 220, description: "Flame-grilled chicken patty with lettuce and tomato", veg: false, image: "images/chicken-whopper.jpeg" },
                { name: "Paneer King", price: 190, description: "Crispy paneer patty with special sauce", veg: true, image: "images/paneer-king.jpeg" }
            ],
            "Sides": [
                { name: "French Fries", price: 80, description: "Crispy golden fries with seasoning", veg: true, image: "images/french-fries.jpeg" },
                { name: "Onion Rings", price: 90, description: "Crispy battered onion rings", veg: true, image: "images/onion-rings.jpeg" },
                { name: "Chicken Nuggets", price: 120, description: "Tender chicken nuggets (6 pieces)", veg: false, image: "images/chicken-nuggets.jpeg" }
            ],
            "Beverages": [
                { name: "Coca Cola", price: 60, description: "Chilled Coca Cola (Regular)", veg: true, image: "images/coca-cola.jpeg" },
                { name: "Milkshake", price: 110, description: "Thick chocolate milkshake", veg: true, image: "images/milkshake.jpeg" }
            ]
        }
    },
    {
        id: 2,
        name: "Pizza Hut",
        image: "images/pizza-hut.jpeg",
        cuisines: ["Pizza", "Italian", "Fast Food"],
        rating: 4.2,
        deliveryTime: "35-40",
        priceForTwo: 400,
        address: "Koramangala, Bangalore",
        offer: "40% OFF",
        veg: false,
        menu: {
            "Pizzas": [
                { name: "Farmhouse Special Pizza", price: 300, description: "Loaded with farm-fresh vegetables and cheese", veg: true, image: "images/pizza.png" },
                { name: "Chicken Supreme", price: 350, description: "Grilled chicken with peppers and onions", veg: false, image: "images/chicken-supreme.jpeg" },
                { name: "Margherita", price: 250, description: "Classic margherita with fresh mozzarella", veg: true, image: "images/margherita.jpeg" },
                { name: "Pepperoni Delight", price: 380, description: "Loaded with pepperoni and extra cheese", veg: false, image: "images/pepperoni-delight" }
            ],
            "Pasta": [
                { name: "Lasagna", price: 250, description: "Classic Italian lasagna with cheese", veg: true, image: "images/lasagna.jpeg" },
                { name: "Spaghetti Carbonara", price: 220, description: "Creamy spaghetti with bacon", veg: false, image: "images/spaghetti.png" },
                { name: "Penne Arrabiata", price: 200, description: "Spicy tomato-based penne pasta", veg: true, image: "images/penne-arrabiata.jpeg" }
            ],
            "Sides": [
                { name: "Garlic Bread", price: 120, description: "Toasted bread with garlic butter", veg: true, image: "images/garlic-bread.jpeg" },
                { name: "Cheese Sticks", price: 150, description: "Crispy mozzarella sticks with marinara", veg: true, image: "images/cheese-sticks.jpeg" }
            ]
        }
    },
    {
        id: 3,
        name: "Domino's Pizza",
        image: "images/domino's-pizza.jpeg",
        cuisines: ["Pizza", "Italian"],
        rating: 4.4,
        deliveryTime: "25-30",
        priceForTwo: 400,
        address: "Indiranagar, Bangalore",
        offer: "Buy 1 Get 1",
        veg: false,
        menu: {
            "Pizzas": [
                { name: "Margherita", price: 200, description: "Classic margherita with fresh basil", veg: true, image: "images/margherita.jpeg" },
                { name: "Peppy Paneer", price: 280, description: "Spicy paneer with capsicum", veg: true, image: "images/peppy-paneer.jpeg" },
                { name: "Mexican Green Wave", price: 300, description: "Mexican-style vegetables with jalapenos", veg: true, image: "images/mexican-green-wave.jpeg" },
                { name: "Chicken Dominator", price: 380, description: "Double chicken with onions and peppers", veg: false, image: "images/chicken-supreme.jpeg" }
            ],
            "Sides": [
                { name: "Garlic Breadsticks", price: 110, description: "Soft breadsticks with garlic seasoning", veg: true, image: "images/garlic-bread.jpeg" },
                { name: "Stuffed Garlic Bread", price: 150, description: "Bread stuffed with cheese and herbs", veg: true, image: "images/stuffed-garlic-bread.jpeg" },
                { name: "Chicken Wings", price: 200, description: "Spicy grilled chicken wings", veg: false, image: "images/fried-chicken.png" }
            ],
            "Desserts": [
                { name: "Choco Lava Cake", price: 90, description: "Hot chocolate cake with molten center", veg: true, image: "images/choco-lava-cake.jpeg" }
            ]
        }
    },
    {
        id: 4,
        name: "KFC",
        image: "images/kfc.jpeg",
        cuisines: ["Chicken", "American", "Fast Food"],
        rating: 4.1,
        deliveryTime: "30-35",
        priceForTwo: 450,
        address: "Whitefield, Bangalore",
        offer: "30% OFF",
        veg: false,
        menu: {
            "Chicken": [
                { name: "Fried Chicken Bucket", price: 450, description: "8 pieces of crispy fried chicken", veg: false, image: "images/fried-chicken-bucket.jpeg" },
                { name: "Chicken Popcorn", price: 180, description: "Bite-sized crispy chicken pieces", veg: false, image: "images/chicken-popcorn.jpeg" },
                { name: "Hot Wings", price: 220, description: "Spicy chicken wings (6 pieces)", veg: false, image: "images/hot-wings.jpeg" },
                { name: "Chicken Strips", price: 200, description: "Crispy chicken strips (4 pieces)", veg: false, image: "images/fried-chicken.png" }
            ],
            "Burgers & Wraps": [
                { name: "Zinger Burger", price: 180, description: "Spicy crispy chicken burger", veg: false, image: "images/chicken-whopper.jpeg" },
                { name: "Chicken Roll", price: 140, description: "Grilled chicken wrapped in soft tortilla", veg: false, image: "images/chicken-roll.png" },
                { name: "Twister", price: 160, description: "Crispy chicken with veggies in a wrap", veg: false, image: "images/twister.jpeg" }
            ],
            "Sides": [
                { name: "French Fries", price: 80, description: "Crispy seasoned fries", veg: true, image: "images/french-fries.jpeg" },
                { name: "Coleslaw", price: 70, description: "Fresh cabbage slaw", veg: true, image: "images/coleslaw.jpeg" }
            ]
        }
    },
    {
        id: 5,
        name: "Subway",
        image: "images/subway.jpeg",
        cuisines: ["Sandwiches", "Healthy", "Fast Food"],
        rating: 4.0,
        deliveryTime: "20-25",
        priceForTwo: 300,
        address: "HSR Layout, Bangalore",
        veg: true,
        menu: {
            "Subs": [
                { name: "Veg Delight Sub", price: 150, description: "Fresh vegetables with cheese and sauces", veg: true, image: "images/sandwich.png" },
                { name: "Paneer Tikka Sub", price: 180, description: "Grilled paneer tikka with veggies", veg: true, image: "images/paneer-tikka-sub.jpeg" },
                { name: "Corn & Peas Sub", price: 160, description: "Sweet corn and peas with cheese", veg: true, image: "images/corn-and-peas-sub.jpeg" },
                { name: "Aloo Patty Sub", price: 140, description: "Crispy aloo patty with fresh veggies", veg: true, image: "images/aloo-patty-sub.jpeg" }
            ],
            "Salads": [
                { name: "Veggie Delite Salad", price: 120, description: "Fresh garden vegetables with dressing", veg: true, image: "images/veggie delight salad.jpeg" },
                { name: "Paneer Tikka Salad", price: 150, description: "Grilled paneer with greens", veg: true, image: "images/paneer-tikka-salad.jpeg" }
            ],
            "Sides": [
                { name: "Cookies", price: 50, description: "Freshly baked cookies (2 pieces)", veg: true, image: "images/cookies.jpeg" },
                { name: "Chips", price: 40, description: "Crispy potato chips", veg: true, image: "images/chips.jpeg" }
            ]
        }
    },
    {
        id: 6,
        name: "Chinese Wok",
        image: "images/chinese-wok.jpeg",
        cuisines: ["Chinese", "Asian"],
        rating: 4.2,
        deliveryTime: "35-40",
        priceForTwo: 350,
        address: "BTM Layout, Bangalore",
        offer: "₹50 OFF",
        veg: false,
        menu: {
            "Rice & Noodles": [
                { name: "Veg Hakka Noodles", price: 150, description: "Stir-fried noodles with vegetables", veg: true, image: "images/spaghetti.png" },
                { name: "Chicken Hakka Noodles", price: 180, description: "Noodles with chicken and vegetables", veg: false, image: "images/chicken-hakka-noodles.jpeg" },
                { name: "Veg Fried Rice", price: 140, description: "Wok-tossed rice with mixed vegetables", veg: true, image: "images/spaghetti.png" },
                { name: "Schezwan Fried Rice", price: 160, description: "Spicy Schezwan-style fried rice", veg: true, image: "images/schezwan-fried-rice.jpeg" }
            ],
            "Starters": [
                { name: "Spring Roll", price: 120, description: "Crispy vegetable spring rolls (4 pieces)", veg: true, image: "images/spring-roll.png" },
                { name: "Veg Manchurian", price: 140, description: "Fried vegetable balls in spicy sauce", veg: true, image: "images/veg-manchurian.jpeg" },
                { name: "Chilli Chicken", price: 200, description: "Spicy chicken in Indo-Chinese sauce", veg: false, image: "images/hot-wings.jpeg" },
                { name: "Gobi Manchurian", price: 130, description: "Cauliflower in tangy Manchurian sauce", veg: true, image: "images/gobi-manchurian.jpeg" }
            ],
            "Soups": [
                { name: "Hot & Sour Soup", price: 90, description: "Spicy and tangy soup", veg: true, image: "images/hot-and-sour-soup.jpeg" },
                { name: "Sweet Corn Soup", price: 80, description: "Creamy sweet corn soup", veg: true, image: "images/sweet-corn-soup.jpeg" }
            ]
        }
    }
];

// Make available globally
if (typeof window !== 'undefined') {
    window.restaurantsData = restaurantsData;
}
