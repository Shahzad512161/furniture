import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Plus, X } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ================= PRODUCT CARD ================= */}
      <div
        onClick={() => setOpen(true)}
        className="group cursor-pointer bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700"
      >
        <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-700">
          <img
            src={product.imageUrl || `https://picsum.photos/seed/${product.id}/600/600`}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <span className="bg-white/90 dark:bg-slate-900/90 text-amber-700 dark:text-amber-400 px-2 py-1 rounded text-[10px] font-bold uppercase">
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
          <h3 className="font-semibold text-slate-800 dark:text-white line-clamp-1 mb-1">
            {product.name}
          </h3>

          <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 h-10 mb-4">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-amber-700 dark:text-amber-500">
              £{product.price.toLocaleString()}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="flex items-center gap-2 bg-slate-900 dark:bg-amber-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
            >
              <Plus size={16} /> Add
            </button>
          </div>
        </div>
      </div>

      {/* ================= PRODUCT DETAILS MODAL ================= */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">

            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-10 bg-white dark:bg-slate-800 rounded-full p-2 shadow hover:scale-110 transition"
            >
              <X size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* LEFT IMAGE */}
              <div className="bg-slate-100 dark:bg-slate-800">
                <img
                  src={product.imageUrl || `https://picsum.photos/seed/${product.id}/800/800`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* RIGHT DETAILS */}
              <div className="p-8 flex flex-col gap-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
                    {product.category}
                  </span>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-2">
                    {product.name}
                  </h2>
                </div>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {product.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  {product.seaterType !== 'N/A' && (
                    <span className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold">
                      Seater: {product.seaterType}
                    </span>
                  )}
                </div>

                <div className="mt-auto border-t pt-6 flex items-center justify-between">
                  <span className="text-3xl font-black text-amber-700 dark:text-amber-500">
                    £{product.price.toLocaleString()}
                  </span>

                  <button
                    onClick={() => addToCart(product)}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-xl font-bold transition-all"
                  >
                    <Plus size={18} /> Add to Cart
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
