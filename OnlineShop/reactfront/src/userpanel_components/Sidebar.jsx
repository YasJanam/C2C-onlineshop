import { useEffect, useState } from 'react';
import './userpanel.css';
import api from '../services/api';
import HomePage from '../global_components/products';
import '../global_components/HomePage.css';
import './updateProductForm.css';
import AddUserProduct from './AddProduct';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import UserProducts from './UserProducts';
import UserCart from './Cart';
import UserOrders from './UserOrders';
import UserProfile from './profile';


function Sidebar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState('home'); // برای مدیریت محتوای صفحه
  //const [showUserProducts, setShowUserProducts] = useState(false);

  // داده‌های منو
  const menuItems = [
    {
      id: 'home-menu',
      label: 'خانه',
      items: [
        { id: 'home', label: 'صفحه اصلی', action: 'renderHomePage' }
      ]
    },
    {
      id: 'products-menu',
      label: 'فروشگاه من',
      items: [
        { id: 'my-products', label: 'محصولات من', action: 'renderUserProducts' },
        { id: 'add-product', label: 'افزودن محصول جدید', action: 'renderAddUserProduct' }
      ]
    },
    {
      id: 'cart-menu',
      label: 'خرید',
      items: [
        { id: 'cart', label: 'سبد خرید', action: 'renderUserCart' },
        { id: 'orders', label: 'خریدهای قبلی', action: 'renderUserOrders' }
      ]
    },
    {
      id: 'profile-menu',
      label: 'پروفایل',
      items: []
    }
  ];

  // هندل کلیک روی آیتم‌های منو
  const handleMenuItemClick = (menuId) => {
    if (activeMenu === menuId) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menuId);
    }
  };

  // هندل کلیک روی زیرمنوها
  const handleSubmenuClick = (action, pageId) => {
    setCurrentPage(pageId);
    console.log(`Action: ${action}, Page: ${pageId}`);
    
  };


  const handleBack = () => {
      //setShowUserProducts(true);
      /* چراخالیه ؟؟ */
     setCurrentPage('my-products');
    
  };

  // هندل کلیک روی پروفایل
  const handleProfileClick = () => {
    setCurrentPage('profile');
    console.log('Profile clicked');
  };

  // رندر محتوای اصلی براساس صفحه انتخاب شده
  const renderContent = () => {
    switch(currentPage) {
      case 'home':
        return <HomePage />;
      case 'my-products':
        return <UserProducts />;
      case 'add-product':
        return (<AddUserProduct onBack={handleBack} />);
   /*(
    <div>
      {showUserProducts ? (
        <UserProducts/>
      ) : (
        <AddUserProduct onBack={handleBack} />
      )}
    </div>
  );*/
      case 'cart':
        return <UserCart />;
      case 'orders':
        return <UserOrders />;
      case 'profile':
        return <UserProfile />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>پنل کاربری</h2>
        
        {menuItems.map((menu) => (
          <div key={menu.id} className="menu-section">
            <div
              className={`menu-item ${activeMenu === menu.id ? 'active' : ''}`}
              onClick={() => {
                if (menu.id === 'profile-menu') {
                  handleProfileClick();
                } else {
                  handleMenuItemClick(menu.id);
                }
              }}
              data-target={menu.id}
            >
              {menu.label}
              {menu.items.length > 0 && (
                <span className="menu-arrow">
                  {activeMenu === menu.id ? '▲' : '▼'}
                </span>
              )}
            </div>
            
            {menu.items.length > 0 && activeMenu === menu.id && (
              <div className="submenu" id={menu.id}>
                {menu.items.map((item) => (
                  <div
                    key={item.id}
                    className={`submenu-item ${currentPage === item.id ? 'active' : ''}`}
                    onClick={() => handleSubmenuClick(item.action, item.id)}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="content" id="content">
        {renderContent()}
      </div>
    </div>
  );
}


/*
function UserProducts() { 
  const [loading, setLoading] = useState(true);
  const [userProducts,setUserProducts] = useState([]);
  const [error,setError] = useState(null);
  const [selectedUserProduct,setSelectedUserProduct] = useState(null);
  //setShowUserProducts(false);
  
  useEffect(()=>{
    fetchUserProducts();
  },[]);

  const fetchUserProducts = async ()=>{
    try{
    setLoading(true);
    const res = await api.get('/user-products/');
    const userProducts = res.data;
    setUserProducts(userProducts);
    }catch(err){
      setError(err.message);
      console.error('خطا در واکشی محصولات کاربر');
    }finally{
      setLoading(false);
    }
  }

    const handleUserProductClick = (userProduct) =>{
      setSelectedUserProduct(userProduct);
    }

    const handleBack = () =>{
      setSelectedUserProduct(null);
    }

    
    if(selectedUserProduct){
      return (
        <UserProductDetail
        userProduct = {selectedUserProduct}
        onBack={handleBack}
        />
      );
    }


  return (
    <div className="home-page">
      <h1>محصولات من</h1>

      {loading && <p className="loading">در حال بارگذاری محصولات ...</p>}

      {error && (
        <div className='error'>
          <p>{error}</p>
          <button onClick={fetchUserProducts}>تلاش مجدد</button>
        </div>
      )}

      {!loading && !error && (
        <div className='product-container'>
          {userProducts.length === 0? (
            <p className='no-prodcut'>محصولی ندارید</p>
          ) : (
            userProducts.map((userproduct) => (
              <UserProductCard
              key = {userproduct.id}
              userproduct = {userproduct}
              onClick={() => handleUserProductClick(userproduct)}
              
              />
            ))
          )
          }
        </div>
      )}
    </div>
  );
}
*/

/*
function UserProductCard({userproduct,onClick}){
  const availableStock = userproduct.stock - userproduct.buyed_num ;

  return (
    <div className='product-card'
    onClick={() => onClick(userproduct)}
    >
      <h3>{userproduct.name}</h3>
      <p><strong>قیمت : </strong>{userproduct.price.toLocaleString()} تومان</p>
      <p><strong>تعداد موجود : </strong>{availableStock}</p>
      <div className='description'>
        {
          userproduct.description.length > 100 ?
          `${userproduct.description.substring(0,100)}...`:
          userproduct.description
        }
      </div>
      <div className='product-footer'>
        <span className="owner">
          {userproduct.product_owner.first_name} {userproduct.product_owner.last_name}
        </span>   
        <span className='view-details'>مشاهده جزییات →</span>     
      </div>
    </div>
  );
}
*/

/*
function UserProductDetail({userProduct,onBack}){
  const availableStock = userProduct.stock - userProduct.buyed_num ;
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  if (editMode) {
    return (
      <UpdateUserProduct 
        userproduct={userProduct}
        onSuccess={() => {
          setEditMode(false); 
        }}
        onCancel={() => setEditMode(false)} 
      />
    );
  }



  const handleDelete = async() => {
    try{
        const res = await api.delete(`/user-products/${userProduct.id}/delete/`);
      if (res.status >= 200 && res.status < 300) {
        //console.log('updated successful: ',res.data);
      
        toast.success('محصول با موفقیت حذف شد!');
        navigate('/user-products'); 
      }      
    }catch{
        toast.error('❌ خطا در انجام عملیات');
    }
  }


  return (
    <div className='product-detail'>
      <div className='product-detail-card'>
        <h2>{userProduct.name}</h2>
        <div className='product-info'>
          <div className='info-row'>
            <span className="label">قیمت :</span>
            <span className="value">{userProduct.price.toLocaleString()} تومان</span>
          </div>

          <div className='info-row'>
            <span className="label">تعداد موجود :</span>
            <span className={`value ${availableStock < 5 ? 'low-stock':''}`}>
              {availableStock}
              {availableStock < 5 && <span className='stock-warning'>(موجودی کم)</span>}
            </span>
          </div>

          <div className="info-row description-row">
            <span className="label">توصیف :</span>
            <p className="value">{userProduct.description}</p>
          </div>

          <div className="info-row">
            <span className="label">صاحب محصول :</span>
            <span className="value">
              {userProduct.product_owner.first_name} {userProduct.product_owner.last_name}
            </span>
          </div>

          {userProduct.categories && userProduct.categories.length >0 && (
            <div className='categories-section'>
              <h2>دسته بندی ها</h2>
              <div className='categories-tags'>
                {userProduct.categoreis.map((c,index) => (
                  <span key={index} className='category-tag'>
                    {c.category.name}
                  </span>
                ))}
              </div>
            </div>
          )}         

        </div>

        <div className='action-buttons'>
            <Toaster 
                position="top-center"
                reverseOrder={false}
                gutter={8}
                toastOptions={{
                duration: 3000,
                style: {   
                    fontSize: '24px',    
                    background: '#363636',
                    color: '#fff',
                    fontFamily: 'IRANSans',
                },
                }}
            />

          <button className='btn btn-secondary'
           onClick={() => setEditMode(true)}>
            ✏️ ویرایش محصول
          </button>
          
          <button className='btn btn-secondary'
          onClick={() => handleDelete()} //handleDeleteUserProduct
          >
            حذف
          </button>  
          

          <button 
            className="btn btn-outline"
            onClick={onBack}
          >
            <span className="btn-icon">←</span>
            بازگشت
          </button>

             
        </div>
      </div>
    </div>
  );
}*/

function renderComponent(component){
  return <component/>;
}


/*
function DeleteUserProduct({userproduct}){ 

  const fetchDeleteProduct = async() => {
  try{
      const res = await api.delete(`/user-products/${userproduct.id}/delete/`);
    if (res.status >= 200 && res.status < 300) {
      //console.log('updated successful: ',res.data);
    
       toast.success('محصول با موفقیت حذف شد!');
    }      
  }catch{
      toast.success('❌ خطا در انجام عملیات');
  }
  }

  useEffect(()=>{
    fetchDeleteProduct();
  },[]);

  const comp = renderComponent({UserProducts});
  return <div>{comp}</div>;
}*/

/*
function UpdateUserProduct({userproduct,onCancel}){
  const [formData,setFormData] = useState({
    name : userproduct?.name || '',
    stock : userproduct?.stock || 0,
    price : userproduct?.price || 0,
    description: userproduct?.description || ''
  });

  const handleChange = (e) => {
    const {id,value,type} = e.target;

    const processedValue = type === 'number' ? Number(value) || 0 : value;
    setFormData(prev => ({
      ...prev,
      [id.replace('product-','').replace('-update','')]: processedValue
    }))
  }

  const handleSubmit = async (e) => { 
    e.preventDefault();

    try{
    console.log('Form submitted: ',formData);
    const res = await api.patch(`/user-products/${userproduct.id}/`,formData);

    if (res.status >= 200 && res.status < 300) {
      console.log('updated successful: ',res.data);
      //alert('✅ محصول آپدیت شد!');
      onCancel();
      //UserProductDetail({userproduct});
    
    }
    }catch(error){
      console.error('❌ Update failed:', error);
    }
  }

  return(
    <div className='update-product-form' id="update-user-product">
      <h2>ویرایش محصول ✏️</h2>

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label htmlFor='product-name-update'>product name</label>
          <input id="product-name-update" 
          className="form-control"
          value={formData.name}
          onChange={handleChange}
          placeholder="نام محصول را وارد کنید"
          />
        </div>

        <div className="form-group">
          <label htmlFor='product-stock-update'>product stock</label>
          <input 
          id="product-stock-update" 
          type='number'
          className="form-control"
          value={formData.stock}
          onChange={handleChange}
          
          placeholder="0"
          />
        </div>


        <div className="form-group">
          <label htmlFor='product-price-update'>product price</label>
          <input 
          id="product-price-update" 
          type='number'
          className="form-control"
          value={formData.price}
          onChange={handleChange}
         
          placeholder="0"
          />
        </div>
 
        <div className="form-group">
          <label htmlFor='product-description-update'>product price</label>
          <textarea 
          id="product-description-update" 
          value={formData.description}
          className="form-control"
          onChange={handleChange}
          rows={5}
          placeholder="توضیحات کامل محصول را وارد کنید..."
          />
        </div>

        <div className="form-actions">
          <button type='submit' className="btn btn-submit">💾 ذخیره تغییرات</button>
          <button type='button' onClick={onCancel} className="btn btn-cancel">❌ انصراف</button>
        </div>        
      </form>

   </div>
  );
}*/



{/*
function AddUserProduct() {
  return (
    <div className="page">
      <h1>افزودن محصول جدید</h1>
  
    </div>
  );
}
*/}

/*
function UserCart() {
  return (
    <div className="page">
      <h1>سبد خرید</h1>
    </div>
  );
}
*/
/*
function UserOrders() {
  return (
    <div className="page">
      <h1>خریدهای قبلی</h1>
    </div>
  );
}*/
/*
function UserProfile() {
  return (
    <div className="page">
      <h1>پروفایل کاربری</h1>
    </div>
  );
}*/

export default Sidebar;
