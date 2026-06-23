export type MenuItem = {
  name: string;
  description: string;
  price: number;
  isVeg: boolean;
  isSignature?: boolean;
};

export type MenuCategory = {
  id: string;
  label: string;
  items: MenuItem[];
};

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: "starters",
    label: "Starters",
    items: [
      { name: "Paneer Tikka", description: "Char-grilled cottage cheese with house spices", price: 320, isVeg: true, isSignature: true },
      { name: "Murg Malai Tikka", description: "Creamy marinated chicken skewers", price: 380, isVeg: false },
      { name: "Crispy Corn Chaat", description: "Tossed corn kernels with tangy masala", price: 260, isVeg: true },
      { name: "Tandoori Prawns", description: "Spiced jumbo prawns from the clay oven", price: 520, isVeg: false },
    ],
  },
  {
    id: "main-course",
    label: "Main Course",
    items: [
      { name: "Lucknowi Galouti Kebab", description: "Melt-in-mouth minced mutton kebab, an Awadhi classic", price: 460, isVeg: false, isSignature: true },
      { name: "Paneer Lababdar", description: "Cottage cheese in a rich tomato gravy", price: 340, isVeg: true },
      { name: "Dal Bukhara", description: "Slow-cooked black lentils finished with cream", price: 290, isVeg: true },
      { name: "Awadhi Mutton Biryani", description: "Fragrant dum-cooked biryani, a Lucknow signature", price: 480, isVeg: false, isSignature: true },
    ],
  },
  {
    id: "breads-rice",
    label: "Breads & Rice",
    items: [
      { name: "Tandoori Roti", description: "Whole wheat bread from the clay oven", price: 50, isVeg: true },
      { name: "Garlic Naan", description: "Leavened bread with roasted garlic", price: 90, isVeg: true },
      { name: "Jeera Rice", description: "Basmati rice tempered with cumin", price: 220, isVeg: true },
    ],
  },
  {
    id: "desserts",
    label: "Desserts",
    items: [
      { name: "Shahi Tukda", description: "Royal bread pudding soaked in saffron rabri", price: 220, isVeg: true, isSignature: true },
      { name: "Gulab Jamun", description: "Warm milk dumplings in rose-cardamom syrup", price: 180, isVeg: true },
    ],
  },
  {
    id: "beverages",
    label: "Beverages",
    items: [
      { name: "Masala Chai", description: "Spiced Indian tea", price: 90, isVeg: true },
      { name: "Fresh Lime Soda", description: "Sweet or salted, served chilled", price: 120, isVeg: true },
      { name: "Lucknowi Sharbat", description: "House-special rose and basil cooler", price: 150, isVeg: true },
    ],
  },
];
