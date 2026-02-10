

import { useEffect, useState } from 'react';
import './userpanel.css';
import api from '../services/api';
import HomePage from '../global_components/products';
import '../global_components/HomePage.css';
import './updateProductForm.css';
import AddUserProduct from './AddProduct';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import UpdateUserProduct from './UpdateUserProduct';


function UserProductDetail({userProduct,onBack}){
  const availableStock = userProduct.stock - userProduct.buyed_num ;
  const [editMode, setEditMode] = useState(false);
  const [comments,setComments] = useState([]);
  //const navigate = useNavigate();

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

  /*
  const fetchComments = async() => {
    try{
      const res = await api.get(`/product-comments/${userProduct.id}/`);
      setComments(res.data);
    }catch{
      toast.error('خطا در دریافت کامنت ها');
    }
  }
    
  useEffect(() => {
    fetchComments();
  },[]);*/

  const handleDelete = async() => {
    try{
        const res = await api.delete(`/user-products/${userProduct.id}/delete/`);
      if (res.status >= 200 && res.status < 300) {
        //console.log('updated successful: ',res.data);
      
        toast.success('محصول با موفقیت حذف شد!');
        onBack();
      }      
    }catch{
        toast.error('❌ خطا در انجام عملیات');
        onBack();
    }
  }


  return (<div>
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
    {/*
    <div name="comments">
        {comments.map((comment) => (
          <div>
            <div>
              <h3>{comment.user.first_name} {comment.user.last_name}</h3>
              <small>{comment.created_at}</small>
            </div>
            <div>
              <p>{comment.comment}</p>
            </div>
            
          </div>
        ))}
    </div>
    */}
    </div>
  );
}

export default UserProductDetail;