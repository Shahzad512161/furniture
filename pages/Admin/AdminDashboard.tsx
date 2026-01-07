
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Product, Order, Category, SeaterType } from '../../types';
import { Plus, Trash2, Edit2, ShoppingBag, List, Package, X, AlertTriangle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: Category.SOFAS,
    seaterType: SeaterType.ONE,
    imageUrl: '',
  });

  const fetchData = async () => {
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
      if (err.message.includes('permission')) {
        setError("Missing Admin Permissions. Ensure your user document has {role: 'admin'} and Firestore Rules are set.");
      } else {
        setError("An error occurred while fetching data.");
      }
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
      alert("Product added!");
    } catch (error) {
      console.error(error);
      alert("Failed to add product. Check permissions.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Delete this product?")) {
      try {
        await deleteDoc(doc(db, 'products', id));
        fetchData();
      } catch (err) {
        alert("Failed to delete. Check permissions.");
      }
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
      fetchData();
    } catch (err) {
      alert("Failed to update status. Check permissions.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">Admin Terminal</h1>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'products' ? 'bg-white dark:bg-slate-700 shadow-sm text-amber-600' : 'text-slate-500'}`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-white dark:bg-slate-700 shadow-sm text-amber-600' : 'text-slate-500'}`}
          >
            Orders
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-6 rounded-3xl mb-8 flex items-start gap-4 text-red-800">
          <AlertTriangle className="shrink-0" />
          <div>
            <p className="font-bold uppercase text-xs tracking-widest mb-1">Access Denied</p>
            <p>{error}</p>
            <p className="text-sm mt-2">1. Update Firestore rules (see FIRESTORE_RULES.txt).<br/>2. Manually edit your user document in Firebase Console to have <code>role: "admin"</code>.</p>
          </div>
        </div>
      )}

      {activeTab === 'products' ? (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2"><List /> Inventory Management</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-slate-900 dark:bg-amber-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
            >
              <Plus size={20} /> Add New Product
            </button>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <table className="w-full text-left bg-white dark:bg-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4"><img src={p.imageUrl} className="w-12 h-12 object-cover rounded-lg" /></td>
                    <td className="px-6 py-4 font-bold">{p.name}</td>
                    <td className="px-6 py-4 text-slate-500">{p.category}</td>
                    <td className="px-6 py-4 font-bold text-amber-600">£{p.price}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 text-slate-400 hover:text-amber-600"><Edit2 size={16} /></button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold flex items-center gap-2"><ShoppingBag /> Customer Orders</h2>
          <div className="grid grid-cols-1 gap-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-md">
                <div className="flex flex-col md:flex-row justify-between mb-6 pb-6 border-b dark:border-slate-700">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order Reference</p>
                    <p className="font-mono font-bold text-lg">{order.id}</p>
                    <p className="text-xs text-slate-500">Date: {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center gap-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="bg-slate-100 dark:bg-slate-900 border-none rounded-xl px-4 py-2 text-sm font-bold outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                    <span className="text-2xl font-extrabold text-amber-600">£{order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <h4 className="font-bold flex items-center gap-2"><Package size={16} /> Order Content</h4>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.name} ({item.seaterType})</span>
                          <span className="font-bold">£{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold flex items-center gap-2 text-amber-600">Customer Info</h4>
                    <div className="text-sm space-y-1 text-slate-600 dark:text-slate-300">
                      <p className="font-bold text-slate-900 dark:text-white">{order.customerDetails.fullName}</p>
                      <p>{order.customerDetails.phone}</p>
                      <p>{order.customerDetails.address}</p>
                      <p>{order.customerDetails.city}, {order.customerDetails.postalCode}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-8 border-b dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold">New Furniture Entry</h2>
              <button onClick={() => setShowAddModal(false)}><X /></button>
            </div>
            <form onSubmit={handleAddProduct} className="p-8 grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-bold uppercase text-slate-400">Name</label>
                <input required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-bold uppercase text-slate-400">Description</label>
                <textarea required rows={2} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-400">Price (GBP)</label>
                <input required type="number" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-400">Category</label>
                <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value as Category})}>
                  {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-400">Seater Type</label>
                <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none" value={newProduct.seaterType} onChange={e => setNewProduct({...newProduct, seaterType: e.target.value as SeaterType})}>
                  {Object.values(SeaterType).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-400">Image URL</label>
                <input required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none" placeholder="https://..." value={newProduct.imageUrl} onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})} />
              </div>
              <div className="col-span-2 pt-4">
                <button type="submit" className="w-full bg-amber-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-amber-700 transition-all">Publish Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
