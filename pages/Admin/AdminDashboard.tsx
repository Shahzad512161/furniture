
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, orderBy, query, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { Product, Order, Category, SeaterType } from '../../types';
import { Plus, Trash2, Edit2, ShoppingBag, List, Package, X, AlertTriangle, ShieldCheck, Database, RefreshCcw } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { currentUser, userProfile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'debug'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  
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
      // Fetch Products
      const pSnap = await getDocs(collection(db, 'products'));
      const pItems: Product[] = [];
      pSnap.forEach(doc => pItems.push({ id: doc.id, ...doc.data() } as Product));
      setProducts(pItems);

      // Fetch Orders
      const oSnap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
      const oItems: Order[] = [];
      oSnap.forEach(doc => oItems.push({ id: doc.id, ...doc.data() } as Order));
      setOrders(oItems);
      
      setError(null);
    } catch (err: any) {
      console.error("Admin fetch error:", err);
      if (err.message.toLowerCase().includes('permission')) {
        setError("Missing Admin Permissions. The database rejected your request.");
        setActiveTab('debug'); // Auto-switch to debug tab on permission error
      } else {
        setError("An error occurred while fetching data. Check your internet connection.");
      }
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      alert("Permission Denied: You cannot write to the database yet.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Delete this product?")) {
      try {
        await deleteDoc(doc(db, 'products', id));
        fetchData();
      } catch (err) {
        alert("Permission Denied: You cannot delete items yet.");
      }
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
      fetchData();
    } catch (err) {
      alert("Permission Denied: Order status update failed.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            Admin Terminal <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 text-xs px-2 py-1 rounded-md uppercase tracking-widest">v1.0</span>
          </h1>
          <p className="text-slate-500 mt-1">Manage your UK inventory and customer orders.</p>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'products' ? 'bg-white dark:bg-slate-700 shadow-md text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <List size={16}/> Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'orders' ? 'bg-white dark:bg-slate-700 shadow-md text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <ShoppingBag size={16}/> Orders
          </button>
          <button
            onClick={() => setActiveTab('debug')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'debug' ? 'bg-white dark:bg-slate-700 shadow-md text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <ShieldCheck size={16}/> System
          </button>
        </div>
      </div>

      {activeTab === 'debug' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-8 border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2"><Database className="text-amber-600"/> Permission Diagnostics</h2>
                <p className="text-sm text-slate-500">Verify your admin credentials against the cloud database.</p>
              </div>
              <button 
                onClick={async () => {
                  await refreshProfile();
                  fetchData();
                }}
                className="p-3 bg-amber-600 text-white rounded-full hover:rotate-180 transition-all duration-500"
                title="Sync and Refresh"
              >
                <RefreshCcw size={20} />
              </button>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Application State</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border dark:border-slate-800">
                      <span className="text-sm font-medium">Logged in as:</span>
                      <span className="text-sm font-mono text-amber-600">{currentUser?.email}</span>
                    </div>
                    <div className="flex justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border dark:border-slate-800">
                      <span className="text-sm font-medium">UI Recognition (Email Prefix):</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${currentUser?.email?.toLowerCase().startsWith('admin') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {currentUser?.email?.toLowerCase().startsWith('admin') ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>
                    <div className="flex justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border dark:border-slate-800">
                      <span className="text-sm font-medium">Firestore Document Role:</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${userProfile?.role === 'admin' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {userProfile?.role?.toUpperCase() || 'NOT FOUND'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Troubleshooting Steps</h3>
                <div className="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">1</div>
                    <p>Go to <strong>Firebase Console</strong> <strong>Firestore</strong>.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">2</div>
                    <p>Open the <code>users</code> collection and find the document for <code>{currentUser?.email}</code>.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">3</div>
                    <p>Change the <code>role</code> field from <code>"customer"</code> to <code>"admin"</code>.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">4</div>
                    <p>Ensure you have published the rules from <code>FIRESTORE_RULES.txt</code> in the Rules tab.</p>
                  </div>
                </div>
                
                {error && (
                  <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-start gap-3 text-red-700">
                    <AlertTriangle className="shrink-0" size={18} />
                    <p className="text-xs font-medium">{error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-2"><List /> Inventory List</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full sm:w-auto bg-slate-900 dark:bg-amber-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 hover:scale-105 transition-all shadow-lg"
            >
              <Plus size={20} /> Add New Item
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b dark:border-slate-700">
                  <tr>
                    <th className="px-8 py-5">Product</th>
                    <th className="px-8 py-5">Category</th>
                    <th className="px-8 py-5">Seater</th>
                    <th className="px-8 py-5">Price</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {products.length > 0 ? products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <img src={p.imageUrl} className="w-12 h-12 object-cover rounded-xl shadow-sm group-hover:scale-110 transition-transform" />
                          <span className="font-bold text-slate-800 dark:text-slate-200">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5"><span className="text-sm font-medium text-slate-500">{p.category}</span></td>
                      <td className="px-8 py-5"><span className="text-xs font-bold text-slate-400">{p.seaterType}</span></td>
                      <td className="px-8 py-5 font-black text-amber-600">£{p.price.toLocaleString()}</td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-slate-400 hover:text-amber-600 transition-colors"><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-slate-400 italic">
                        No products in inventory. Click "Add New Item" to start.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold flex items-center gap-2"><ShoppingBag /> Active Orders</h2>
          <div className="grid grid-cols-1 gap-8">
            {orders.length > 0 ? orders.map(order => (
              <div key={order.id} className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/5 rounded-bl-full pointer-events-none" />
                
                <div className="flex flex-col md:flex-row justify-between mb-8 pb-8 border-b dark:border-slate-700">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Reference</p>
                    <p className="font-mono font-black text-xl text-slate-900 dark:text-white">#{order.id.slice(0,10).toUpperCase()}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><RefreshCcw size={12}/> {new Date(order.createdAt).toLocaleDateString()}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span className="font-bold text-amber-600 uppercase tracking-tighter">Cash on Delivery</span>
                    </div>
                  </div>
                  <div className="mt-6 md:mt-0 flex items-center gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</p>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`bg-slate-100 dark:bg-slate-900 border-none rounded-xl px-5 py-2.5 text-xs font-black outline-none appearance-none cursor-pointer transition-all ${
                          order.status === 'delivered' ? 'text-green-600' : 'text-amber-600'
                        }`}
                      >
                        <option value="pending">PENDING</option>
                        <option value="processing">PROCESSING</option>
                        <option value="shipped">SHIPPED</option>
                        <option value="delivered">DELIVERED</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total</p>
                      <span className="text-3xl font-black text-slate-900 dark:text-white">£{order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <Package size={14} className="text-amber-600"/> Order Breakdown
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border dark:border-slate-800">
                          <img src={item.imageUrl} className="w-12 h-12 object-cover rounded-lg" />
                          <div className="flex-grow">
                            <p className="text-sm font-bold truncate">{item.name}</p>
                            <p className="text-[10px] text-slate-500">{item.quantity} Unit(s) • {item.seaterType}</p>
                          </div>
                          <p className="text-sm font-black">£{item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-6 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border dark:border-slate-800">
                    <h4 className="text-xs font-black uppercase tracking-widest text-amber-600">Customer Logistics</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400">Recipient</p>
                        <p className="text-sm font-bold">{order.customerDetails.fullName}</p>
                        <p className="text-xs text-slate-500 font-mono">{order.customerDetails.phone}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400">Shipping Destination</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {order.customerDetails.address}<br />
                          {order.customerDetails.city}, {order.customerDetails.postalCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-32 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                <ShoppingBag className="mx-auto text-slate-200 mb-4" size={64}/>
                <p className="text-slate-400 font-medium italic">Waiting for customer orders...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border dark:border-slate-700 animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <h2 className="text-2xl font-black">New Product Entry</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"><X /></button>
            </div>
            <form onSubmit={handleAddProduct} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Product Title</label>
                  <input required className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition-all" placeholder="e.g. Victorian Oak Dining Table" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Detailed Description</label>
                  <textarea required rows={3} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none" placeholder="Craftsmanship details, wood quality, dimensions..." value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Retail Price (GBP)</label>
                  <input required type="number" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition-all" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Product Category</label>
                  <select className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition-all appearance-none cursor-pointer" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value as Category})}>
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Seating Capacity</label>
                  <select className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition-all appearance-none cursor-pointer" value={newProduct.seaterType} onChange={e => setNewProduct({...newProduct, seaterType: e.target.value as SeaterType})}>
                    {Object.values(SeaterType).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">High-Res Image URL</label>
                  <input required className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500 transition-all" placeholder="https://unsplash.com/..." value={newProduct.imageUrl} onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})} />
                </div>
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full bg-slate-900 dark:bg-amber-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-800 dark:hover:bg-amber-700 transition-all shadow-xl active:scale-[0.98]">Publish to Store</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
