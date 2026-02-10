
import { useEffect, useState } from 'react';
import './userpanel.css';
import api from '../services/api';
import HomePage from '../global_components/products';
import '../global_components/HomePage.css';
import './updateProductForm.css';
import AddUserProduct from './AddProduct';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';




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
}


export default UpdateUserProduct;