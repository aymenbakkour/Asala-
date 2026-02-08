
import React, { useState, useMemo } from 'react';
import { Product, CartItem, CustomerDetails } from './types';
import { PRODUCTS } from './constants';
import { sendOrderToTelegram } from './services/telegramService';
import { ShoppingCart, Plus, Minus, Trash2, Send, Clock, MapPin, Phone, User, CheckCircle, X } from 'lucide-react';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: '',
    whatsapp: '',
    notes: '',
    deliveryDate: ''
  });

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    setIsSubmitting(true);
    const success = await sendOrderToTelegram({
      items: cart,
      customer,
      total: cartTotal
    });

    if (success) {
      setCart([]);
      setIsCartOpen(false);
      setCustomer({ name: '', whatsapp: '', notes: '', deliveryDate: '' });
      setShowSuccessModal(true);
    } else {
      alert('حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      {/* Header */}
      <header className="bg-amber-600 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="bg-white text-amber-600 p-1.5 rounded-lg">🍲</span>
            متجر الأصالة
          </h1>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 bg-amber-500 rounded-full hover:bg-amber-400 transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full border-2 border-amber-600">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-amber-50 py-10 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-amber-900 mb-3">أشهى المأكولات الشرقية</h2>
          <p className="text-amber-700">نقدم لكم أفضل أنواع الكبة والبرك المحضرة يدوياً.</p>
        </div>
      </section>

      {/* Product Grid */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map(product => (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col">
              <div className="h-44 overflow-hidden relative">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-amber-600 text-white px-3 py-1 rounded-full font-bold text-sm shadow-sm">
                  {product.price.toFixed(2)}€
                </div>
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
                <p className="text-gray-500 text-xs mb-4 flex-grow leading-relaxed">{product.description}</p>
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors font-semibold text-sm"
                >
                  <Plus className="w-4 h-4" />
                  أضف للسلة
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
          <div className="absolute inset-y-0 left-0 max-w-full flex">
            <div className="w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-2xl rounded-r-3xl overflow-hidden">
                <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <h2 className="text-xl font-bold text-gray-900">سلة التسوق</h2>
                    <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <X className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>

                  <div className="mt-6">
                    {cart.length === 0 ? (
                      <div className="text-center py-20">
                        <ShoppingCart className="w-16 h-16 mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400">السلة فارغة حالياً</p>
                      </div>
                    ) : (
                      <div className="flow-root">
                        <ul className="divide-y divide-gray-100">
                          {cart.map((item) => (
                            <li key={item.id} className="py-4 flex items-center gap-4">
                              <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-sm font-bold text-gray-800">{item.name}</h3>
                                <p className="text-amber-600 text-xs font-semibold">{(item.price * item.quantity).toFixed(2)}€</p>
                                <div className="mt-2 flex items-center justify-between">
                                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1">
                                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-gray-400 hover:text-amber-600"><Minus className="w-3.5 h-3.5" /></button>
                                    <span className="text-sm font-bold text-gray-700 w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-gray-400 hover:text-amber-600"><Plus className="w-3.5 h-3.5" /></button>
                                  </div>
                                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="mt-8 border-t pt-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Send className="w-5 h-5 text-amber-600" /> تفاصيل الطلب
                      </h3>
                      <form onSubmit={handleSubmitOrder} className="space-y-4">
                        <div className="space-y-3">
                          <div className="relative">
                            <User className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              name="name"
                              required
                              value={customer.name}
                              onChange={handleInputChange}
                              placeholder="الاسم بالكامل"
                              className="w-full border-gray-200 border py-3 pr-10 pl-4 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-base"
                            />
                          </div>
                          <div className="relative">
                            <Phone className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
                            <input
                              type="tel"
                              name="whatsapp"
                              required
                              value={customer.whatsapp}
                              onChange={handleInputChange}
                              placeholder="رقم الواتساب (مثال: 0049123...)"
                              className="w-full border-gray-200 border py-3 pr-10 pl-4 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-base"
                            />
                          </div>
                          <div className="relative">
                            <Clock className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
                            <input
                              type="date"
                              name="deliveryDate"
                              required
                              value={customer.deliveryDate}
                              onChange={handleInputChange}
                              className="w-full border-gray-200 border py-3 pr-10 pl-4 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-base"
                            />
                          </div>
                          <div className="relative">
                            <MapPin className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
                            <textarea
                              name="notes"
                              value={customer.notes}
                              onChange={handleInputChange}
                              placeholder="ملاحظات إضافية..."
                              className="w-full border-gray-200 border py-3 pr-10 pl-4 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none h-24 text-base"
                            />
                          </div>
                        </div>
                        
                        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex justify-between items-center my-6">
                          <span className="text-gray-600 font-semibold">المجموع المستحق:</span>
                          <span className="text-xl font-black text-amber-900">{cartTotal.toFixed(2)}€</span>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white py-4 rounded-2xl flex items-center justify-center gap-3 transition-all font-bold text-lg shadow-lg active:scale-95"
                        >
                          {isSubmitting ? (
                            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                          ) : (
                            <Send className="w-5 h-5" />
                          )}
                          تأكيد وإرسال الطلب
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal (Popup) */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowSuccessModal(false)} />
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full relative z-[101] text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">تم استلام طلبك!</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">شكراً لاختيارك متجر الأصالة. سيصلك الرد عبر الواتساب لتأكيد موعد التسليم.</p>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-colors shadow-lg"
            >
              موافق، إغلاق
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t py-10 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-amber-600 text-lg font-black mb-3">متجر الأصالة</h3>
          <p className="text-gray-400 text-sm mb-6">نقدم لكم أشهى المأكولات بجودة منزلية لا تضاهى.</p>
          <div className="inline-flex flex-col items-center p-4 bg-gray-50 rounded-2xl border">
             <span className="text-xs text-gray-400 mb-1">للتواصل المباشر</span>
             <a href="tel:+4917622542262" className="flex items-center gap-2 text-gray-900 font-bold text-lg hover:text-amber-600 transition-colors">
               <Phone className="w-5 h-5 text-amber-600" />
               <span dir="ltr">+4917622542262</span>
             </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
