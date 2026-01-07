
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Product, Category, SeaterType } from '../types';
import ProductCard from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'All');
  const [selectedSeater, setSelectedSeater] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number>(5000);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'products'));
      const items: Product[] = [];
      querySnapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() } as Product));
      setProducts(items);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSeater = selectedSeater === 'All' || product.seaterType === selectedSeater;
      const matchesPrice = product.price <= priceRange;
      
      return matchesSearch && matchesCategory && matchesSeater && matchesPrice;
    });
  }, [products, searchQuery, selectedCategory, selectedSeater, priceRange]);

  const categories = ['All', ...Object.values(Category)];
  const seaters = ['All', ...Object.values(SeaterType)];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <h1 className="text-4xl font-bold">Furniture Collection</h1>
        
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search our collection..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl"
        >
          {showFilters ? <X size={20} /> : <SlidersHorizontal size={20} />}
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block space-y-8`}>
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Filter size={18} /> Categories
            </h3>
            <div className="space-y-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === cat 
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 font-bold' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Seater Type</h3>
            <div className="grid grid-cols-2 gap-2">
              {seaters.map(seater => (
                <button
                  key={seater}
                  onClick={() => setSelectedSeater(seater)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border ${
                    selectedSeater === seater 
                      ? 'bg-amber-100 border-amber-300 text-amber-700 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-500' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {seater}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Max Price</h3>
              <span className="text-amber-700 dark:text-amber-500 font-bold">£{priceRange}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              className="w-full accent-amber-600"
            />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse bg-slate-200 dark:bg-slate-800 h-80 rounded-xl"></div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-100 dark:bg-slate-800 rounded-3xl">
              <p className="text-slate-500 text-lg">No products found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedSeater('All');
                  setPriceRange(10000);
                  setSearchQuery('');
                }}
                className="mt-4 text-amber-700 dark:text-amber-500 font-bold"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
