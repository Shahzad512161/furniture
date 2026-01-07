
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Minus, Plus, Trash2, ArrowLeft, ChevronRight } from 'lucide-react';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <div className="bg-amber-50 dark:bg-amber-900/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-amber-600">
          <Trash2 size={40} />
        </div>
        <h2 className="text-3xl font-bold">Your cart is empty</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          Look like you haven't added anything to your cart yet. Explore our beautiful wooden furniture collection!
        </p>
        <Link to="/products" className="inline-block bg-amber-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-amber-700 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link to="/products" className="hover:text-amber-600 flex items-center gap-1">
          <ArrowLeft size={14} /> Back to Products
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-slate-900 dark:text-white">Shopping Cart</span>
      </div>

      <h1 className="text-4xl font-bold mb-12">Your Cart ({cart.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-6 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">{item.name}</h3>
                    <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-slate-500 text-sm">{item.category} • {item.seaterType}</p>
                </div>
                
                <div className="flex justify-between items-end mt-4">
                  <div className="flex items-center gap-3 border dark:border-slate-600 rounded-lg px-2 py-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-amber-600">
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-amber-600">
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-xl font-bold text-amber-700 dark:text-amber-500">£{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <aside>
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl sticky top-24">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>£{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping (UK)</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t dark:border-slate-700 pt-4 flex justify-between text-xl font-extrabold">
                <span>Total</span>
                <span className="text-amber-700 dark:text-amber-500">£{cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => currentUser ? navigate('/checkout') : navigate('/login?redirect=cart')}
              className="w-full bg-slate-900 dark:bg-amber-600 text-white py-4 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-amber-700 transition-all flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ChevronRight size={18} />
            </button>
            
            {!currentUser && (
              <p className="text-center text-xs text-slate-500 mt-4">
                Please login to place an order.
              </p>
            )}
            
            <div className="mt-8 pt-8 border-t dark:border-slate-700">
              <p className="text-xs text-slate-400 text-center">
                We only accept Cash on Delivery for all UK orders. Secure and reliable furniture shopping.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
