
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { User, Mail, Phone, MapPin, Package, LogOut, Save, UserCircle } from 'lucide-react';
import { Order } from '../types';

const Profile: React.FC = () => {
  const { userProfile, currentUser, refreshProfile } = useAuth();
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
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const fetched: Order[] = [];
      querySnapshot.forEach(doc => fetched.push({ id: doc.id, ...doc.data() } as Order));
      setOrders(fetched);
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
            <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
              <UserCircle size={64} />
            </div>
            <h2 className="text-2xl font-bold">{userProfile?.fullName}</h2>
            <p className="text-slate-500 text-sm mb-6">{userProfile?.email}</p>
            <div className="px-3 py-1 bg-amber-600/10 text-amber-600 rounded-full text-xs font-bold uppercase inline-block">
              {userProfile?.role}
            </div>
            
            <div className="mt-10 space-y-2">
              <button
                onClick={() => setActiveTab('info')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'info' ? 'bg-amber-600 text-white shadow-lg' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                <User size={18} /> My Details
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-amber-600 text-white shadow-lg' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                <Package size={18} /> Order History
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all mt-6"
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
              <h3 className="text-2xl font-bold mb-8">Account Information</h3>
              <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">Full Name</label>
                  <input
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">Phone</label>
                  <input
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold flex items-center gap-2">Address</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">City</label>
                  <input
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">Postal Code</label>
                  <input
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                  />
                </div>
                
                <div className="md:col-span-2 pt-6">
                  <button
                    disabled={isSaving}
                    type="submit"
                    className="bg-amber-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-700 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save size={18} /> {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-8">My Orders</h3>
              {orders.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 p-20 rounded-3xl text-center border border-dashed border-slate-300">
                  <p className="text-slate-500">You haven't placed any orders yet.</p>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b dark:border-slate-700 pb-4">
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Order ID</p>
                        <p className="text-sm font-mono">{order.id}</p>
                      </div>
                      <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                        {order.status}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
                      <div className="col-span-2">
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Items</p>
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <p key={idx} className="text-sm">{item.quantity}x {item.name}</p>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total</p>
                        <p className="text-lg font-bold text-amber-600">£{order.totalAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Date</p>
                        <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
