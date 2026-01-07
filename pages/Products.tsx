
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Product, Category, SeaterType } from '../types';
import ProductCard from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'All');
  const [selectedSeater, setSelectedSeater] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number>(10000);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const items: Product[] = [];
        querySnapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() } as Product));
        setProducts(items);
      } catch (err) {
        console.error("Fetch products error:", err);
      } finally {
        setLoading(false);
      }
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
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight">Our Collection</h1>
          <p className="text-slate-500 font-medium">Discover premium wooden furniture for your home.</p>
        </div>
        
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search sofas, beds, tables..."
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-amber-500/10 outline-none transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold transition-all active:scale-95"
        >
          {showFilters ? <X size={20} /> : <SlidersHorizontal size={20} />}
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block space-y-10 sticky top-24 h-fit`}>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
              <Filter size={14} className="text-amber-600" /> Categories
            </h3>
            <div className="space-y-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`block w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
                    selectedCategory === cat 
                      ? 'bg-amber-600 text-white font-bold shadow-lg shadow-amber-200 dark:shadow-none' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Seater Type</h3>
            <div className="grid grid-cols-2 gap-3">
              {seaters.map(seater => (
                <button
                  key={seater}
                  onClick={() => setSelectedSeater(seater)}
                  className={`px-3 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase border-2 transition-all ${
                    selectedSeater === seater 
                      ? 'bg-amber-100 border-amber-600 text-amber-700 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-500' 
                      : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500'
                  }`}
                >
                  {seater}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Budget Limit</h3>
              <span className="text-lg font-black text-amber-600">£{priceRange.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-3">
              <span>£0</span>
              <span>£10,000+</span>
            </div>
          </div>

          <button 
            onClick={() => {
              setSelectedCategory('All');
              setSelectedSeater('All');
              setPriceRange(10000);
              setSearchQuery('');
            }}
            className="w-full py-4 border-2 border-slate-200 dark:border-slate-700 text-slate-500 rounded-2xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            Reset All Filters
          </button>
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse bg-white dark:bg-slate-800 h-96 rounded-3xl border dark:border-slate-700"></div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
              <div className="bg-white dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Search className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-500 text-lg font-medium">No matches found in our current inventory.</p>
              <button 
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedSeater('All');
                  setPriceRange(10000);
                }}
                className="mt-6 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
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
