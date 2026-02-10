

import { useEffect, useState } from 'react';
import './userpanel.css';
import api from '../services/api';
import HomePage from '../global_components/products';
import '../global_components/HomePage.css';
import './updateProductForm.css';
import AddUserProduct from './AddProduct';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import UserProductDetail from './UserDetialProductsCard';



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

export default UserProductCard;