// ProductDetail.jsx

import { useState, useEffect } from 'react';
import './products.css';
import './HomePage.css';
import api from '../services/api';
import toast, { Toaster } from 'react-hot-toast';

function ProductDetail({ product, onBack, token, API }) {
  const [addingToCart, setAddingToCart] = useState(false);
  const [addToCartMessage, setAddToCartMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const availableStock = product.stock - product.buyed_num;

  // افزودن به سبد خرید
  const handleAddToCart = async () => {
    //if (addingToCart) return;
    
    //setAddingToCart(true);
    //setAddToCartMessage('');
    
    try { 
     
      const res = await api.post('/cartitems-user/',
      {
        product_id: product.id,
      }
      );

      if (res.status>=200 && res.status<300) {
        toast.success('به سبد خرید اضافه شد !✅');
      }

      //toast.success('به سبد خرید اضافه شد !');


    } catch (error) {
      setAddToCartMessage(error.message);
      setMessageType('error');
      console.error('خطا:', error);
      //toast.error(error.data);
      toast.error(error.response.data);
    } finally {
      setAddingToCart(false);
    }
  };

  // نمایش صاحب محصول (اگر نیاز باشد)
  const handleShowOwner = () => {
    // اینجا می‌توانید صاحب محصول را نمایش دهید
    console.log('صاحب محصول:', product.product_owner.id);
    // یا می‌توانید یک کامپوننت جدید باز کنید
  };

  return (
    <div className="product-detail">
      <div className="product-detail-card">
        <h2>{product.name}</h2>
        
        <div className="product-info">
          <div className="info-row">
            <span className="label">قیمت :</span>
            <span className="value">{product.price.toLocaleString()} تومان</span>
          </div>
          
          <div className="info-row">
            <span className="label">تعداد موجود :</span>
            <span className={`value ${availableStock < 5 ? 'low-stock' : ''}`}>
              {availableStock}
              {availableStock < 5 && <span className="stock-warning"> (موجودی کم)</span>}
            </span>
          </div>
          
          <div className="info-row description-row">
            <span className="label">توصیف :</span>
            <p className="value">{product.description}</p>
          </div>
          
          <div className="info-row">
            <span className="label">صاحب محصول :</span>
            <span className="value">
              {product.product_owner.first_name} {product.product_owner.last_name}
            </span>
          </div>

          {/* دسته‌بندی‌ها */}
          {product.categories && product.categories.length > 0 && (
            <div className="categories-section">
              <h4>دسته‌بندی‌ها</h4>
              <div className="categories-tags">
                {product.categories.map((c, index) => (
                  <span key={index} className="category-tag">
                    {c.category.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* دکمه‌های اقدام */}
        <div className="action-buttons">
          <button 
            className="btn btn-secondary"
            onClick={handleShowOwner}
          >
            <span className="btn-icon">👤</span>
            صاحب محصول
          </button>
          
          <button 
            className="btn btn-outline"
            onClick={onBack}
          >
            <span className="btn-icon">←</span>
            بازگشت
          </button>
          
          <button 
            className={`btn btn-primary ${addingToCart ? 'loading' : ''}`}
            onClick={handleAddToCart}
            disabled={addingToCart || availableStock <= 0}
          >
            {addingToCart ? (
              <>
                <span className="spinner"></span>
                در حال افزودن...
              </>
            ) : (
              <>
                <span className="btn-icon">🛒</span>
                افزودن به سبد خرید
              </>
            )}
          </button>
        </div>

        {/* پیام افزودن به سبد خرید */}
        {addToCartMessage && (
          <div className={`cart-message ${messageType}`}>
            {addToCartMessage}
            {messageType === 'success' && ' ✅'}
            {messageType === 'error' && ' ❌'}
          </div>
        )}

        {/* هشدار موجودی کم */}
        {availableStock <= 0 && (
          <div className="out-of-stock">
            ⚠️ این محصول در حال حاضر موجود نمی‌باشد
          </div>
        )}
      </div>
      <Toaster 
            position="top-center"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
            duration: 3000,
            style: {   
                fontSize: '22px',    
                background: '#363636',
                color: '#fff',
                fontFamily: 'IRANSans',
            },
            }}
        />
    </div>
  );
}

//export default ProductDetail;


function HomePage({ token, API }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // دریافت محصولات هنگام لود کامپوننت
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products/');

      const data = res.data;
      // فیلتر محصولات فعال
      const activeProducts = data.filter(d => d.is_active === true);
      setProducts(activeProducts);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('خطا:', err);
    } finally {
      setLoading(false);
    }
  };

  // نمایش جزییات محصول
  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  // بازگشت به لیست محصولات
  const handleBack = () => {
    setSelectedProduct(null);
  };

  // اگر محصولی انتخاب شده، جزییاتش رو نشون بده
  if (selectedProduct) {
    return (
      <ProductDetail 
        product={selectedProduct}
        onBack={handleBack}
        token={token}
        API={API}
      />
    );
  }

  return (
    <div className="home-page">
      <h2>محصولات</h2>
      
      {loading && <p className="loading">در حال بارگذاری محصولات...</p>}
      
      {error && (
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchProducts}>تلاش مجدد</button>
        </div>
      )}
      
      {!loading && !error && (
        <div className="product-container">
          {products.length === 0 ? (
            <p className="no-products">هیچ محصول فعالی وجود ندارد</p>
          ) : (
            products.map((product) => (
              <ProductCard 
                key={product.id}
                product={product}
                onClick={handleProductClick}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// کامپوننت کارت محصول
function ProductCard({ product, onClick }) {
  const availableStock = product.stock - product.buyed_num;

  return (
    <div 
      className="product-card"
      onClick={() => onClick(product)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick(product)}
    >
      <h3>{product.name}</h3>
      <p><strong>قیمت : </strong>{product.price.toLocaleString()} تومان</p>
      <p><strong>تعداد موجود : </strong>{availableStock}</p>
      <p className="description">
        <strong>توصیف : </strong>
        {product.description.length > 100 
          ? `${product.description.substring(0, 100)}...` 
          : product.description
        }
      </p>
      <div className="product-footer">
        <span className="owner">
          {product.product_owner.first_name} {product.product_owner.last_name}
        </span>
        <span className="view-details">مشاهده جزئیات →</span>
      </div>
    </div>
  );
}

export default HomePage;