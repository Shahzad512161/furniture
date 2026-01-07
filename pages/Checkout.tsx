
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Package, Truck, Phone, MapPin, User, CheckCircle2 } from 'lucide-react';

const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { userProfile, currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: userProfile?.fullName || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address || '',
    city: userProfile?.city || '',
    postalCode: userProfile?.postalCode || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'orders'), {
        userId: currentUser.uid,
        customerDetails: formData,
        items: cart,
        totalAmount: cartTotal,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setIsSuccess(true);
      clearCart();
    } catch (error) {
      console.error("Order error:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-8">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
          <CheckCircle2 size={64} />
        </div>
        <h1 className="text-4xl font-extrabold">Thank You!</h1>
        <p className="text-slate-500 text-lg">
          Your order has been placed successfully. We will contact you shortly to confirm the delivery details. 
          Remember, this is a <strong>Cash on Delivery</strong> order.
        </p>
        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-left space-y-2">
          <p className="font-bold">Shipping To:</p>
          <p className="text-slate-600 dark:text-slate-400">{formData.fullName}</p>
          <p className="text-slate-600 dark:text-slate-400">{formData.address}, {formData.city}</p>
          <p className="text-slate-600 dark:text-slate-400">{formData.postalCode}</p>
        </div>
        <button
          onClick={() => navigate('/products')}
          className="bg-amber-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-amber-700 transition-all"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-12">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Truck className="text-amber-600" /> Shipping Details
          </h3>
          
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2"><User size={16} /> Full Name</label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2"><Phone size={16} /> Phone Number</label>
              <input
                required
                type="tel"
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="+44 20 7946 0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2"><MapPin size={16} /> Delivery Address</label>
              <textarea
                required
                rows={3}
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="House number and street name"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">City</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="e.g. London"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Postal Code</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="e.g. SW1A 1AA"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                />
              </div>
            </div>
          </form>
        </div>

        <aside>
          <div className="bg-slate-900 text-white p-8 rounded-3xl sticky top-24">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Package size={20} className="text-amber-500" /> Review Your Order
            </h3>
            
            <div className="max-h-60 overflow-y-auto space-y-4 mb-8 pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">{item.quantity}x <span className="text-white">{item.name}</span></span>
                  <span className="font-bold text-amber-500">£{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-slate-800 pt-6">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>£{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className="text-green-400 font-bold uppercase tracking-widest text-[10px]">Free Delivery</span>
              </div>
              <div className="flex justify-between text-2xl font-extrabold pt-2">
                <span>Total Amount</span>
                <span className="text-amber-500">£{cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-8 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <p className="text-sm text-slate-300">
                <strong>Cash on Delivery (COD)</strong>: You will pay the courier in cash when your furniture arrives at your doorstep.
              </p>
            </div>

            <button
              form="checkout-form"
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-xl font-bold transition-all mt-8 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Placing Order...' : 'Confirm Order (COD)'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
