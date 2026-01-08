
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Truck, ShieldCheck, Clock, AlertCircle, Database, ExternalLink } from 'lucide-react';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPermissionError, setIsPermissionError] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(collection(db, 'products'), limit(4));
        const querySnapshot = await getDocs(q);
        const items: Product[] = [];
        querySnapshot.forEach((doc) => items.push({ id: doc.id, ...doc.data() } as Product));
        setFeaturedProducts(items);
        setError(null);
      } catch (err: any) {
        console.error("Home fetch error:", err);
        if (err.code === 'permission-denied' || err.message.toLowerCase().includes('permission')) {
          setIsPermissionError(true);
          setError("Database access restricted by security rules.");
        } else {
          setError("Unable to load products. Please check your connection.");
        }
      }
    };
    fetchFeatured();
  }, []);

  const categories = Object.values(Category).slice(0, 6);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
    <section className="relative h-[80vh] flex items-center overflow-hidden">
  <div className="absolute inset-0">
    <img
      src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=2000"
      alt="Hero Furniture"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent" />
  </div>

  <div className="relative z-10 max-w-3xl mx-auto px-4 text-white text-center space-y-6">
    <span className="inline-block px-4 py-1 rounded-full bg-amber-600 text-xs font-bold uppercase tracking-widest mx-auto">
      UK Exclusive Collection
    </span>

    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight font-gargle">
      Redefine Comfort <br /> in Every Corner.
    </h1>

    <p className="text-lg md:text-xl text-slate-200">
      Experience the fusion of traditional craftsmanship and modern aesthetics.
      Premium wooden furniture delivered across the UK.
    </p>

    <div className="flex justify-center gap-4 pt-4">
      <Link to="/products" className="bg-amber-600 hover:bg-amber-700 px-8 py-4 rounded-lg font-bold">
        Shop Collection
      </Link>
      <Link to="/about" className="bg-white/10 border border-white/30 px-8 py-4 rounded-lg font-bold">
        Our Story
      </Link>
    </div>
  </div>
</section>



      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-y border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-700 dark:text-amber-500">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="font-bold">Fast UK Delivery</h4>
              <p className="text-sm text-slate-500">Express shipping to your doorstep</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-700 dark:text-amber-500">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold">Quality Guaranteed</h4>
              <p className="text-sm text-slate-500">Made from high-grade solid wood</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-700 dark:text-amber-500">
              <Clock size={24} />
            </div>
            <div>
              <h4 className="font-bold">Cash on Delivery</h4>
              <p className="text-sm text-slate-500">Pay only when you receive it</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold">Featured Arrivals</h2>
            <p className="text-slate-500 mt-2">Handpicked pieces from our newest collection</p>
          </div>
          <Link to="/products" className="text-amber-700 dark:text-amber-500 font-bold flex items-center gap-2 hover:underline">
            View All <ArrowRight size={18} />
          </Link>
        </div>
        
        {isPermissionError ? (
          <div className="bg-amber-50 dark:bg-slate-800 border-2 border-amber-200 dark:border-amber-900/50 p-8 rounded-3xl">
            <div className="flex items-start gap-4 text-amber-800 dark:text-amber-200">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-2xl">
                <Database size={32} />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Action Required: Database Setup</h3>
                <p className="text-sm leading-relaxed max-w-2xl">
                  The app is unable to fetch products because Firestore Security Rules are blocking access. 
                  To fix this, you must apply the rules provided in the <strong>FIRESTORE_RULES.txt</strong> file in your project.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="https://console.firebase.google.com/project/_/database/firestore/rules" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-amber-700 transition-colors"
                  >
                    Open Firebase Console <ExternalLink size={16} />
                  </a>
                  <button 
                    onClick={() => window.location.reload()}
                    className="bg-white dark:bg-slate-700 border border-amber-200 dark:border-slate-600 px-5 py-2.5 rounded-xl text-sm font-bold"
                  >
                    Retry Connection
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center gap-4 text-red-800">
            <AlertCircle />
            <p className="font-medium">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-slate-200 dark:bg-slate-800 animate-pulse aspect-square rounded-xl"></div>
              ))
            )}
          </div>
        )}
      </section>

      {/* Categories Grid */}
      <section className="bg-slate-100 dark:bg-slate-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all text-center border border-slate-200 dark:border-slate-700 group"
              >
                <div className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-amber-600 transition-colors">
                  {cat}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
