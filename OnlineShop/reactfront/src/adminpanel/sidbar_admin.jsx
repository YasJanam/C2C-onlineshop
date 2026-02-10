
import { useEffect, useState } from 'react';
import '../userpanel_components/userpanel.css';
import api from '../services/api';
import HomePage from '../global_components/products';
import '../global_components/HomePage.css';
import '../userpanel_components/updateProductForm.css';

import AllUsers from './AllUsers';
import Categories from './Categories';
/*
import AddUserProduct from './AddProduct';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import UserProducts from './UserProducts';
import UserCart from './Cart';
import UserOrders from './UserOrders';
import UserProfile from './profile';*/


function AdminSidebar() {
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
      id: 'users-menu',
      label: 'مدیریت کاربران',
      items: [
        { id: 'all-users', label: 'همه کاربران', action: 'renderUsers' },
        //{ id: 'add-user', label: 'افزودن کاربر جدید', action: 'renderAddUser' }
      ]
    },
    {
      id: 'category-menu',
      label: 'مدیریته دسته بندی',
      items: [
        { id: 'categories', label: 'دسته ها', action: 'renderUserCart' },
      ]
    },

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
        return <AdminHomePage />;
      case 'all-users':
        return <AllUsers />;
        /*
      case 'add-user':
        return (<AddUser onBack={handleBack} />);
        */
   /*(
    <div>
      {showUserProducts ? (
        <UserProducts/>
      ) : (
        <AddUserProduct onBack={handleBack} />
      )}
    </div>
  );*/
      case 'categories':
        return <Categories />;
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

export default AdminSidebar;



function AdminHomePage(){
    return <div></div>
}