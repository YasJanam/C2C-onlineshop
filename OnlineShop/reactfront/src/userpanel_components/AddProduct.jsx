import { useEffect, useState } from 'react';
import './userpanel.css';
import api from '../services/api';
//import HomePage from './products';
import '../global_components/HomePage.css';
import './updateProductForm.css';
import toast, { Toaster } from 'react-hot-toast';
//import { ToastContainer, toast } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';
import UserProducts from './UserProducts';

function AddUserProduct({onBack}){
  const [formData,setFormData] = useState({
    name :  '',
    stock :   0,
    price :  0,
    description:  '',
  });

  const handleChange = (e) => {
    const {name,value,type} = e.target;

    const processedValue = type === 'number' ? Number(value) || 0 : value;
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }))
  } 



  const handleSubmit = async (e) => { 
    e.preventDefault();

    try{
    console.log('Form submitted: ',formData);
    const res = await api.post('/user-products/',formData);

    if (res.status >= 200 && res.status < 300) {
      //console.log('updated successful: ',res.data);
    
       toast.success('✅محصول با موفقیت ایجاد شد!');
        onBack();
    }
    }catch(error){
      console.error('❌ create failed:', error);
      toast.success('❌ create failed:', error);
    }
  }


  return(
    <div className='update-product-form' id="create-user-product">
      <h2>افزودن محصول➕</h2>

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label htmlFor='name'>product name</label>
          <input name="name" id="product-name-create" 
          className="form-control"
          value={formData.name}
          onChange={handleChange}
          placeholder="نام محصول را وارد کنید"
          />
        </div>
    
        <div className="form-group">
          <label htmlFor='stock'>product stock</label>
          <input 
          name="stock"
          id="product-stock-create" 
          type='number'
          className="form-control"
          value={formData.stock}
          onChange={handleChange}
          
          placeholder="0"
          />
        </div>


        <div className="form-group">
          <label htmlFor='product-price-create'>product price</label>
          <input 
          name='price'
          id="product-price-create" 
          type='number'
          className="form-control"
          value={formData.price}
          onChange={handleChange}
         
          placeholder="0"
          />
        </div>
 
        <div className="form-group">
          <label htmlFor='product-description-create'>product price</label>
          <textarea 
          name='description'
          id="product-description-create" 
          value={formData.description}
          className="form-control"
          onChange={handleChange}
          rows={5}
          placeholder="توضیحات کامل محصول را وارد کنید..."
          />
        </div>

        <div className="form-actions">
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
          <button type='submit' className="btn btn-submit"> افزودن</button>
          <button type='button' onClick={onBack} className="btn btn-cancel">❌ انصراف</button>
            
        </div>        
      </form>

   </div>
  );
}



export default AddUserProduct;