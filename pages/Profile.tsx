
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { User, Mail, Phone, MapPin, Package, LogOut, Save, UserCircle, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Order } from '../types';

const Profile: React.FC = () => {
  const { userProfile, currentUser, refreshProfile, isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'orders'>('info');

  useEffect(() => {
    if (userProfile) {
      setFormData({
        fullName: userProfile.fullName || '',
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        city: userProfile.city || '',
        postalCode: userProfile.postalCode || '',
      });
    }
  }, [userProfile]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const fetched: Order[] = [];
        querySnapshot.forEach(doc => fetched.push({ id: doc.id, ...doc.data() } as Order));
        setOrders(fetched);
      } catch (err) {
        console.error("Error fetching user orders:", err);
      }
    };
    fetchOrders();
  }, [currentUser]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), formData);
      await refreshProfile();
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Update failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => signOut(auth);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Profile Sidebar */}
        <aside className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-full h-full bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600">
                <UserCircle size={64} />
              </div>
              {isAdmin && (
                <div className="absolute -bottom-1 -right-1 bg-amber-600 text-white p-1.5 rounded-full border-4 border-white dark:border-slate-800 shadow-lg" title="Admin Account">
                  <ShieldCheck size={16} />
                </div>
              )}
            </div>
            
            <h2 className="text-2xl font-bold">{userProfile?.fullName || 'User'}</h2>
            <p className="text-slate-500 text-sm mb-4">{userProfile?.email}</p>
            
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block ${isAdmin ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
              {userProfile?.role || 'Customer'}
            </div>
            
            <div className="mt-10 space-y-2 text-left">
              <button
                onClick={() => setActiveTab('info')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'info' ? 'bg-amber-600 text-white shadow-lg' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
              >
                <User size={18} /> My Details
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'orders' ? 'bg-amber-600 text-white shadow-lg' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
              >
                <Package size={18} /> Order History
              </button>
              
              {isAdmin && (
                <Link
                  to="/admin"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-900 hover:text-white dark:hover:bg-amber-600 transition-all font-medium mt-2"
                >
                  <LayoutDashboard size={18} /> Admin Dashboard
                </Link>
              )}
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all mt-6 font-medium"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {activeTab === 'info' ? (
            <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">Account Information</h3>
                {isAdmin && <span className="text-xs font-bold text-amber-600 flex items-center gap-1 uppercase tracking-tighter"><ShieldCheck size={14}/> Verified Admin</span>}
              </div>
              
              <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2 text-slate-600 dark:text-slate-400">Full Name</label>
                  <input
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2 text-slate-600 dark:text-slate-400">Phone Number</label>
                  <input
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                    placeholder="+44 ..."
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold flex items-center gap-2 text-slate-600 dark:text-slate-400">Default Delivery Address</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2 text-slate-600 dark:text-slate-400">City</label>
                  <input
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2 text-slate-600 dark:text-slate-400">Postal Code</label>
                  <input
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                  />
                </div>
                
                <div className="md:col-span-2 pt-6">
                  <button
                    disabled={isSaving}
                    type="submit"
                    className="bg-slate-900 dark:bg-amber-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-amber-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
                  >
                    <Save size={18} /> {isSaving ? 'Saving Changes...' : 'Update Profile'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-8">My Order History</h3>
              {orders.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 p-20 rounded-3xl text-center border border-dashed border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="bg-slate-100 dark:bg-slate-900/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <Package size={32} />
                  </div>
                  <p className="text-slate-500 font-medium">You haven't placed any orders yet.</p>
                  <Link to="/products" className="text-amber-600 font-bold hover:underline mt-2 inline-block">Shop now</Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b dark:border-slate-700 pb-6 mb-6">
                        <div className="space-y-1">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Order Number</p>
                          <p className="text-sm font-mono font-bold text-slate-700 dark:text-slate-200">#{order.id.slice(0, 8).toUpperCase()}</p>
                          <p className="text-xs text-slate-400 italic">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20' : 
                            order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/20' : 
                            'bg-blue-100 text-blue-700 dark:bg-blue-900/20'
                          }`}>
                            {order.status}
                          </div>
                          <span className="text-xl font-black text-slate-900 dark:text-white">£{order.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Items Purchased</p>
                          <div className="space-y-3">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                <span className="text-sm font-medium"><span className="text-amber-600 font-bold">{item.quantity}x</span> {item.name}</span>
                                <span className="text-xs text-slate-400 italic">{item.seaterType}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4">
                           <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Delivery Address</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                              {order.customerDetails.address}<br />
                              {order.customerDetails.city}, {order.customerDetails.postalCode}
                            </p>
                          </div>
                          <div className="p-4 bg-slate-900 text-white rounded-2xl text-[10px]">
                            <p className="font-bold mb-1 uppercase tracking-tighter">Payment Mode</p>
                            <p className="text-amber-500 font-black">CASH ON DELIVERY</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
