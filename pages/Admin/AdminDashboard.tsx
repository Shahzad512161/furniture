
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, orderBy, query, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { Product, Order, Category, SeaterType } from '../../types';
import { Plus, Trash2, Edit2, ShoppingBag, List, Package, X, AlertTriangle, ShieldCheck, Database, RefreshCcw, LayoutGrid, Boxes, Search } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { currentUser, userProfile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'debug'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: Category.SOFAS,
    seaterType: SeaterType.ONE,
    imageUrl: '',
  });

  const fetchData = async () => {
    setIsSyncing(true);
    try {
      const pSnap = await getDocs(collection(db, 'products'));
      const pItems: Product[] = [];
      pSnap.forEach(doc => pItems.push({ id: doc.id, ...doc.data() } as Product));
      setProducts(pItems);

      const oSnap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
      const oItems: Order[] = [];
      oSnap.forEach(doc => oItems.push({ id: doc.id, ...doc.data() } as Order));
      setOrders(oItems);
      
      setError(null);
    } catch (err: any) {
      console.error("Admin fetch error:", err);
      if (err.message.toLowerCase().includes('permission')) {
        setError("Missing Admin Permissions. Verify your Firestore role in the System tab.");
        setActiveTab('debug');
      } else {
        setError("Sync failed. Check connection.");
      }
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFixProfile = async () => {
    if (!currentUser) return;
    setIsFixing(true);
    try {
      const isAdminEmail = currentUser.email?.toLowerCase().startsWith('admin');
      const assignedRole = isAdminEmail ? 'admin' : 'customer';
      
      await setDoc(doc(db, 'users', currentUser.uid), {
        uid: currentUser.uid,
        email: currentUser.email,
        fullName: 'System Administrator',
        role: assignedRole,
        createdAt: Date.now()
      });
      
      await refreshProfile();
      alert("Admin document initialized! Access should now be unlocked.");
      fetchData();
    } catch (err: any) {
      alert("Profile creation failed: " + err.message);
    } finally {
      setIsFixing(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'products'), {
        ...newProduct,
        createdAt: Date.now()
      });
      setShowAddModal(false);
      fetchData();
    } catch (error) {
      alert("Database rejection: Only admins can write products.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Delete this product from inventory?")) {
      try {
        await deleteDoc(doc(db, 'products', id));
        fetchData();
      } catch (err) {
        alert("Action restricted.");
      }
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
      fetchData();
    } catch (err) {
      alert("Status update failed.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-black tracking-tight flex items-center gap-4">
            Admin Dashboard <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 text-[10px] px-3 py-1.5 rounded-full uppercase tracking-widest font-black">Secure Terminal</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Unified command center for UK sales and logistics.</p>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-inner">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-8 py-3 rounded-2xl text-sm font-black transition-all flex items-center gap-2 ${activeTab === 'products' ? 'bg-white dark:bg-slate-700 shadow-xl text-amber-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Boxes size={18}/> Inventory
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-8 py-3 rounded-2xl text-sm font-black transition-all flex items-center gap-2 ${activeTab === 'orders' ? 'bg-white dark:bg-slate-700 shadow-xl text-amber-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <ShoppingBag size={18}/> Orders
          </button>
          <button
            onClick={() => setActiveTab('debug')}
            className={`px-8 py-3 rounded-2xl text-sm font-black transition-all flex items-center gap-2 ${activeTab === 'debug' ? 'bg-white dark:bg-slate-700 shadow-xl text-amber-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <ShieldCheck size={18}/> System
          </button>
        </div>
      </div>

      {activeTab === 'debug' && (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-700 shadow-2xl space-y-10">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black tracking-tight">System Status</h2>
                <p className="text-slate-500 text-sm">Real-time authentication diagnostics.</p>
              </div>
              <button 
                onClick={async () => {
                  await refreshProfile();
                  fetchData();
                }}
                className={`p-4 bg-amber-600 text-white rounded-2xl shadow-lg transition-all duration-700 ${isSyncing ? 'animate-spin opacity-50' : 'hover:scale-110 active:scale-90'}`}
              >
                <RefreshCcw size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
               <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border dark:border-slate-700 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Active Account</p>
                  <p className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300">{currentUser?.email}</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border dark:border-slate-700 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">UI Recognition</p>
                  <p className="text-sm font-bold">Email Prefix Validation</p>
                </div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full ${currentUser?.email?.toLowerCase().startsWith('admin') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {currentUser?.email?.toLowerCase().startsWith('admin') ? 'PASSED' : 'FAILED'}
                </span>
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border dark:border-slate-700 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Firestore Record</p>
                  <p className="text-sm font-bold">User Collection Sync</p>
                </div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full ${userProfile?.role === 'admin' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {userProfile?.role?.toUpperCase() || 'NOT FOUND'}
                </span>
              </div>
            </div>

            {!userProfile && currentUser?.email?.toLowerCase().startsWith('admin') && (
              <div className="p-8 bg-amber-50 dark:bg-amber-900/20 border-2 border-dashed border-amber-200 dark:border-amber-700/50 rounded-3xl">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="text-amber-600 shrink-0" size={24} />
                  <div className="space-y-4">
                    <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Missing Database Entry detected.</p>
                    <p className="text-xs leading-relaxed text-amber-800/80 dark:text-amber-400">Your email grants UI access, but the database needs an explicit document to allow writing data.</p>
                    <button 
                      onClick={handleFixProfile}
                      disabled={isFixing}
                      className="w-full py-4 bg-amber-600 text-white rounded-2xl font-black shadow-xl hover:bg-amber-700 transition-all disabled:opacity-50"
                    >
                      {isFixing ? 'Initializing...' : 'Force Create Admin Profile'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl">
             <div className="flex items-center gap-5">
              <div className="p-4 bg-slate-900 dark:bg-amber-600 text-white rounded-3xl shadow-lg">
                <Boxes size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black">Stock Control</h2>
                <p className="text-sm font-bold text-slate-400">{products.length} Products in Inventory</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full md:w-auto bg-slate-900 dark:bg-amber-600 text-white px-10 py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl"
            >
              <Plus size={24} /> New Product
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(p => (
              <div key={p.id} className="group bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <span className="bg-slate-900/90 text-white text-[10px] font-black px-3 py-1.5 rounded-full backdrop-blur uppercase tracking-widest">{p.category}</span>
                    <span className="bg-amber-600/90 text-white text-[10px] font-black px-3 py-1.5 rounded-full backdrop-blur uppercase tracking-widest">{p.seaterType}</span>
                  </div>
                </div>
                <div className="p-8 space-y-4 flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-black leading-tight group-hover:text-amber-600 transition-colors">{p.name}</h3>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">£{p.price.toLocaleString()}</span>
                  </div>
                  <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{p.description}</p>
                </div>
                <div className="p-8 pt-0 flex gap-3">
                  <button className="flex-grow bg-slate-50 dark:bg-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2"><Edit2 size={14}/> Edit</button>
                  <button onClick={() => handleDeleteProduct(p.id)} className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-500">
           <div className="flex items-center gap-5 bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl">
            <div className="p-4 bg-amber-600 text-white rounded-3xl shadow-lg shadow-amber-200 dark:shadow-none">
              <ShoppingBag size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black">Sales Pipeline</h2>
              <p className="text-sm font-bold text-slate-400">{orders.length} Active Customer Orders</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10">
            {orders.length > 0 ? orders.map(order => (
              <div key={order.id} className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-2xl overflow-hidden">
                <div className="p-10 border-b dark:border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-slate-50 dark:bg-slate-900/30">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Order Ref: {order.id.slice(0,8).toUpperCase()}</p>
                    <div className="flex items-center gap-4">
                      <h4 className="text-3xl font-black">£{order.totalAmount.toLocaleString()}</h4>
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                      <p className="text-sm font-bold text-slate-500">{new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-6 w-full md:w-auto">
                    <div className="space-y-2 flex-grow md:flex-grow-0">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Fulfillment Status</p>
                       <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`w-full md:w-48 bg-white dark:bg-slate-800 border-2 rounded-2xl px-5 py-3.5 text-xs font-black outline-none appearance-none cursor-pointer transition-all ${
                          order.status === 'delivered' ? 'border-green-500 text-green-600' : 
                          order.status === 'pending' ? 'border-amber-500 text-amber-600' : 'border-blue-500 text-blue-600'
                        }`}
                      >
                        <option value="pending">PENDING</option>
                        <option value="processing">PROCESSING</option>
                        <option value="shipped">SHIPPED</option>
                        <option value="delivered">DELIVERED</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-16">
                  <div className="lg:col-span-2 space-y-8">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                      <LayoutGrid size={14} className="text-amber-600"/> Item Manifest
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-6 p-5 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border dark:border-slate-800">
                          <img src={item.imageUrl} className="w-16 h-16 object-cover rounded-2xl shadow-md" />
                          <div className="flex-grow">
                            <p className="text-sm font-black truncate">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{item.quantity} Unit • {item.seaterType}</p>
                          </div>
                          <p className="text-sm font-black text-amber-600">£{item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border dark:border-slate-800 space-y-6">
                      <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600">Shipping Details</h5>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</p>
                          <p className="text-sm font-black mt-1">{order.customerDetails.fullName}</p>
                          <p className="text-xs font-mono font-bold text-amber-600">{order.customerDetails.phone}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Address</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium mt-1">
                            {order.customerDetails.address}<br />
                            {order.customerDetails.city}, {order.customerDetails.postalCode}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-slate-900 text-white rounded-[2rem] flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-widest">Payment</p>
                      <p className="text-xs font-black text-amber-500">CASH ON DELIVERY</p>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-40 bg-white dark:bg-slate-800 rounded-[4rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                <ShoppingBag className="mx-auto text-slate-200 mb-6" size={80}/>
                <p className="text-slate-400 font-black text-xl italic uppercase tracking-widest">Queue Empty</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border dark:border-slate-700 animate-in zoom-in-95 duration-500">
            <div className="p-10 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <h2 className="text-3xl font-black">Add New Inventory</h2>
              <button onClick={() => setShowAddModal(false)} className="p-3 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all"><X /></button>
            </div>
            <form onSubmit={handleAddProduct} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Product Title</label>
                  <input required className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-amber-500 transition-all font-bold" placeholder="e.g. Victorian Oak Bed Frame" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
                  <textarea required rows={2} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-amber-500 transition-all font-medium resize-none" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Price (GBP)</label>
                  <input required type="number" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-amber-500 transition-all font-black" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
                  <select className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-amber-500 transition-all font-bold" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value as Category})}>
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Seater Type</label>
                  <select className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-amber-500 transition-all font-bold" value={newProduct.seaterType} onChange={e => setNewProduct({...newProduct, seaterType: e.target.value as SeaterType})}>
                    {Object.values(SeaterType).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Image URL</label>
                  <input required className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-amber-500 transition-all font-bold" placeholder="https://..." value={newProduct.imageUrl} onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})} />
                </div>
              </div>
              <div className="pt-6">
                <button type="submit" className="w-full bg-slate-900 dark:bg-amber-600 text-white py-5 rounded-2xl font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl">Publish to Storefront</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
