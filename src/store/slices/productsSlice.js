import { createSlice, createSelector } from '@reduxjs/toolkit';

const INITIAL_VEGETABLES = [
  {
    id: 'veg-1',
    name: 'Organic Baby Spinach',
    category: 'Leafy Greens',
    price: 3.49,
    originalPrice: 4.29,
    unit: '250g pack',
    organic: true,
    rating: 4.9,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'veg-2',
    name: 'Heirloom Roma Tomatoes',
    category: 'Daily Essentials',
    price: 2.99,
    originalPrice: null,
    unit: '500g',
    organic: true,
    rating: 4.8,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'veg-3',
    name: 'Sweet Dutch Carrots',
    category: 'Root Veggies',
    price: 2.49,
    originalPrice: 2.99,
    unit: '500g bunch',
    organic: false,
    rating: 4.7,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'veg-4',
    name: 'Fresh Green Broccoli',
    category: 'Exotic',
    price: 3.19,
    originalPrice: null,
    unit: '1 head (~400g)',
    organic: true,
    rating: 4.8,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'veg-5',
    name: 'Red & Yellow Bell Peppers',
    category: 'Exotic',
    price: 4.49,
    originalPrice: 5.25,
    unit: '3 pcs pack',
    organic: false,
    rating: 4.6,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'veg-6',
    name: 'Farmhouse Red Onions',
    category: 'Root Veggies',
    price: 1.99,
    originalPrice: null,
    unit: '1 kg',
    organic: false,
    rating: 4.7,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'veg-7',
    name: 'Curly Organic Kale',
    category: 'Leafy Greens',
    price: 3.79,
    originalPrice: 4.19,
    unit: '200g bunch',
    organic: true,
    rating: 4.9,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'veg-8',
    name: 'Yukon Gold Potatoes',
    category: 'Root Veggies',
    price: 3.29,
    originalPrice: null,
    unit: '1.5 kg bag',
    organic: false,
    rating: 4.8,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
  },
];

const initialState = {
  items: INITIAL_VEGETABLES,
  searchQuery: '',
  selectedCategory: 'All',
  sortBy: 'featured', // 'featured' | 'price-asc' | 'price-desc' | 'rating'
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = 'All';
      state.sortBy = 'featured';
    },
  },
});

export const { setSearchQuery, setSelectedCategory, setSortBy, resetFilters } =
  productsSlice.actions;

// Base Selectors
const selectAllProducts = (state) => state.products.items;
export const selectSearchQuery = (state) => state.products.searchQuery;
export const selectSelectedCategory = (state) => state.products.selectedCategory;
export const selectSortBy = (state) => state.products.sortBy;

// Memoized Filtered & Sorted Selector
export const selectFilteredProducts = createSelector(
  [selectAllProducts, selectSearchQuery, selectSelectedCategory, selectSortBy],
  (items, searchQuery, selectedCategory, sortBy) => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = items.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });

    const sorted = [...filtered];
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') sorted.sort((a, b) => b.rating - a.rating);

    return sorted;
  }
);

export default productsSlice.reducer;