const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Restaurant = require("./models/Restaurant");
const MenuItem = require("./models/MenuItem");

dotenv.config({ quiet: true });

const restaurants = [
  {
    name: "Pizza Palace",
    description: "Wood-fired pizza and Italian classics",
    cuisine: "Italian",
    address: "12 Roma Street",
    image: "",
    rating: 4.5,
    isOpen: true,
    menuItems: [
      { name: "Margherita Pizza", price: 9.99, description: "Tomato, mozzarella, basil", category: "Pizza" },
      { name: "Pepperoni Pizza", price: 11.49, description: "Tomato, mozzarella, pepperoni", category: "Pizza" },
      { name: "Garlic Bread", price: 4.5, description: "Toasted with garlic butter", category: "Sides" },
      { name: "Caesar Salad", price: 6.75, description: "Romaine, parmesan, croutons", category: "Salads" },
      { name: "Tiramisu", price: 5.25, description: "Classic Italian dessert", category: "Desserts" },
    ],
  },
  {
    name: "Sushi House",
    description: "Fresh sushi and Japanese favorites",
    cuisine: "Japanese",
    address: "88 Sakura Ave",
    image: "",
    rating: 4.7,
    isOpen: true,
    menuItems: [
      { name: "California Roll", price: 7.99, description: "Crab, avocado, cucumber", category: "Rolls" },
      { name: "Spicy Tuna Roll", price: 8.99, description: "Tuna, spicy mayo, scallion", category: "Rolls" },
      { name: "Salmon Nigiri (2pc)", price: 5.5, description: "Fresh salmon over rice", category: "Nigiri" },
      { name: "Miso Soup", price: 3.25, description: "Tofu, seaweed, scallion", category: "Sides" },
    ],
  },
  {
    name: "Taco Fiesta",
    description: "Street-style Mexican food",
    cuisine: "Mexican",
    address: "45 Sunset Blvd",
    image: "",
    rating: 4.3,
    isOpen: true,
    menuItems: [
      { name: "Carne Asada Taco", price: 3.5, description: "Grilled steak, onion, cilantro", category: "Tacos" },
      { name: "Chicken Burrito", price: 8.25, description: "Rice, beans, chicken, salsa", category: "Burritos" },
      { name: "Guacamole & Chips", price: 5.0, description: "Fresh avocado dip", category: "Sides" },
      { name: "Quesadilla", price: 6.5, description: "Melted cheese, flour tortilla", category: "Mains" },
      { name: "Churros", price: 4.0, description: "Cinnamon sugar, chocolate sauce", category: "Desserts" },
    ],
  },
];

const seed = async () => {
  await connectDB();

  await Restaurant.deleteMany({});
  await MenuItem.deleteMany({});

  for (const { menuItems, ...restaurantData } of restaurants) {
    const restaurant = await Restaurant.create(restaurantData);
    const items = menuItems.map((item) => ({ ...item, restaurantId: restaurant._id }));
    await MenuItem.insertMany(items);
    console.log(`Seeded ${restaurant.name} with ${items.length} menu items`);
  }

  console.log("Seeding complete");
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seeding failed:", err.message);
  process.exit(1);
});
