
import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700">
      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-700">
        <img
          src={product.imageUrl || `https://picsum.photos/seed/${product.id}/600/600`}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2">
           <span className="bg-white/90 dark:bg-slate-900/90 text-amber-700 dark:text-amber-400 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
            {product.category}
          </span>
          {product.seaterType !== 'N/A' && (
             <span className="bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 px-2 py-1 rounded text-[10px] font-bold">
              {product.seaterType}
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 dark:text-white line-clamp-1 mb-1">{product.name}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 h-10 mb-4">{product.description}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-amber-700 dark:text-amber-500">£{product.price.toLocaleString()}</span>
          <button
            onClick={() => addToCart(product)}
            className="flex items-center gap-2 bg-slate-900 dark:bg-amber-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 dark:hover:bg-amber-700 transition-colors"
          >
            <Plus size={16} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
