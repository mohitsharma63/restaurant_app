export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  preparationTime?: number;
  rating?: number;
  isPopular?: boolean;
}

export interface QrCodeData {
  id: string;
  tableNumber: number;
  qrData: string;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
}

export const staticRestaurant = {
  id: "rest-1",
  name: "Delicious Bistro",
  address: "123 Main St, City",
  phone: "+1-234-567-8900",
  isOpen: true
};

export const staticCategories: Category[] = [
  { id: "1", name: "Appetizers", description: "Starter dishes and small plates", isActive: true, sortOrder: 1 },
  { id: "2", name: "Main Courses", description: "Primary dishes and entrees", isActive: true, sortOrder: 2 },
  { id: "3", name: "Desserts", description: "Sweet treats and desserts", isActive: true, sortOrder: 3 },
  { id: "4", name: "Beverages", description: "Drinks and refreshments", isActive: true, sortOrder: 4 },
  { id: "5", name: "Soups", description: "Hot and cold soups", isActive: true, sortOrder: 5 },
  { id: "6", name: "Salads", description: "Fresh salads and greens", isActive: true, sortOrder: 6 },
  { id: "7", name: "Pizza", description: "Wood-fired pizzas", isActive: true, sortOrder: 7 },
  { id: "8", name: "Pasta", description: "Italian pasta dishes", isActive: true, sortOrder: 8 },
  { id: "9", name: "Seafood", description: "Fresh seafood options", isActive: true, sortOrder: 9 },
  { id: "10", name: "Vegetarian", description: "Plant-based options", isActive: true, sortOrder: 10 },
  { id: "11", name: "Specials", description: "Chef's special dishes", isActive: true, sortOrder: 11 }
];

export const staticMenuItems: MenuItem[] = [
  {
    id: "1",
    restaurantId: "rest-1",
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with parmesan cheese, croutons and caesar dressing",
    price: "12.99",
    category: "Salads",
    imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
    isAvailable: true,
    isVegetarian: true,
    preparationTime: 10,
    rating: 4.5,
    isPopular: true
  },
  {
    id: "2",
    restaurantId: "rest-1",
    name: "Margherita Pizza",
    description: "Classic pizza with fresh mozzarella, tomatoes, and basil",
    price: "16.99",
    category: "Pizza",
    imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400",
    isAvailable: true,
    isVegetarian: true,
    preparationTime: 15,
    rating: 4.8,
    isPopular: true
  },
  {
    id: "3",
    restaurantId: "rest-1",
    name: "Grilled Salmon",
    description: "Fresh Atlantic salmon with herbs and lemon butter sauce",
    price: "24.99",
    category: "Seafood",
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400",
    isAvailable: true,
    preparationTime: 20,
    rating: 4.7,
    isPopular: true
  },
  {
    id: "4",
    restaurantId: "rest-1",
    name: "Chicken Parmesan",
    description: "Breaded chicken breast with marinara sauce and melted cheese",
    price: "19.99",
    category: "Main Courses",
    imageUrl: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400",
    isAvailable: true,
    preparationTime: 25,
    rating: 4.6
  },
  {
    id: "5",
    restaurantId: "rest-1",
    name: "Tomato Basil Soup",
    description: "Creamy tomato soup with fresh basil and a touch of cream",
    price: "8.99",
    category: "Soups",
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400",
    isAvailable: true,
    isVegetarian: true,
    preparationTime: 8,
    rating: 4.3
  },
  {
    id: "6",
    restaurantId: "rest-1",
    name: "Bruschetta",
    description: "Toasted bread topped with diced tomatoes, garlic, and fresh basil",
    price: "9.99",
    category: "Appetizers",
    imageUrl: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400",
    isAvailable: true,
    isVegetarian: true,
    preparationTime: 10,
    rating: 4.4
  },
  {
    id: "7",
    restaurantId: "rest-1",
    name: "Spaghetti Carbonara",
    description: "Classic Italian pasta with eggs, cheese, pancetta, and black pepper",
    price: "17.99",
    category: "Pasta",
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400",
    isAvailable: true,
    preparationTime: 18,
    rating: 4.5,
    isPopular: true
  },
  {
    id: "8",
    restaurantId: "rest-1",
    name: "Chocolate Brownie",
    description: "Rich chocolate brownie served with vanilla ice cream",
    price: "7.99",
    category: "Desserts",
    imageUrl: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400",
    isAvailable: true,
    isVegetarian: true,
    preparationTime: 5,
    rating: 4.9,
    isPopular: true
  },
  {
    id: "9",
    restaurantId: "rest-1",
    name: "Fresh Orange Juice",
    description: "Freshly squeezed orange juice",
    price: "4.99",
    category: "Beverages",
    imageUrl: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400",
    isAvailable: true,
    isVegetarian: true,
    preparationTime: 3,
    rating: 4.2
  },
  {
    id: "10",
    restaurantId: "rest-1",
    name: "Veggie Burger",
    description: "Plant-based burger with lettuce, tomato, and special sauce",
    price: "14.99",
    category: "Vegetarian",
    imageUrl: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400",
    isAvailable: true,
    isVegetarian: true,
    preparationTime: 15,
    rating: 4.1
  },
  {
    id: "11",
    restaurantId: "rest-1",
    name: "Spicy Thai Curry",
    description: "Authentic Thai red curry with vegetables and coconut milk",
    price: "18.99",
    category: "Specials",
    imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400",
    isAvailable: true,
    isVegetarian: true,
    isSpicy: true,
    preparationTime: 20,
    rating: 4.6
  },
  {
    id: "12",
    restaurantId: "rest-1",
    name: "BBQ Ribs",
    description: "Slow-cooked pork ribs with our signature BBQ sauce",
    price: "22.99",
    category: "Main Courses",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d766942947?w=400",
    isAvailable: true,
    preparationTime: 30,
    rating: 4.8,
    isPopular: true
  }
];

export const staticQrCodes: QrCodeData[] = [
  {
    id: "qr-1",
    tableNumber: 1,
    qrData: "/menu/rest-1/1",
    isActive: true,
    createdAt: "2024-01-01T10:00:00Z"
  },
  {
    id: "qr-2", 
    tableNumber: 2,
    qrData: "/menu/rest-1/2",
    isActive: true,
    createdAt: "2024-01-01T10:05:00Z"
  },
  {
    id: "qr-3",
    tableNumber: 3, 
    qrData: "/menu/rest-1/3",
    isActive: true,
    createdAt: "2024-01-01T10:10:00Z"
  },
  {
    id: "qr-4",
    tableNumber: 4,
    qrData: "/menu/rest-1/4", 
    isActive: true,
    createdAt: "2024-01-01T10:15:00Z"
  },
  {
    id: "qr-5",
    tableNumber: 5,
    qrData: "/menu/rest-1/5",
    isActive: true,
    createdAt: "2024-01-01T10:20:00Z"
  }
];

export const generateQrCodeUrl = (data: string): string => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`;
};

export const getMenuUrl = (restaurantId: string, tableNumber: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/menu/${restaurantId}/${tableNumber}`;
};