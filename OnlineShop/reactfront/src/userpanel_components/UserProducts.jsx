
import { useEffect, useState } from 'react';
import './userpanel.css';
import api from '../services/api';
import '../global_components/HomePage.css';
import './updateProductForm.css';
import AddUserProduct from './AddProduct';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import UserProductCard from './UserProductsCard';
import UserProductDetail from './UserDetialProductsCard';


function UserProducts() { 
  const [loading, setLoading] = useState(true);
  const [userProducts,setUserProducts] = useState([]);
  const [error,setError] = useState(null);
  const [selectedUserProduct,setSelectedUserProduct] = useState(null);
  const [query,setQuery] = useState('');
  
  useEffect(()=>{
    fetchUserProducts();
  },[query]);

  const fetchUserProducts = async ()=>{
    try{
    setLoading(true);
    let url = `/user-products/`;
    if(query !== '') {
        const params = new URLSearchParams();
        params.append('search', query);
        url += `?${params.toString()}`;
    };
    const res = await api.get(url);
    const userProductsData = res.data;
    const activeProducts = userProductsData.filter(item =>  item.is_active !== false);
    setUserProducts(activeProducts);

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
      fetchUserProducts();
    }

    const handleChangeSearch = (e) => {
      const {value} = e.target;
      setQuery(value);
    }

    
    if(selectedUserProduct){
      return (
        <UserProductDetail
        userProduct = {selectedUserProduct}
        onBack={handleBack} 
        />
      );
    }


  return (<>
    <input 
        type="text" 
        id="UserSearchInput"
        onChange={(e) => handleChangeSearch(e)}
         placeholder="جستجو بر اساس نام  ..." 
         value={query}
         style={{float:'left'}}
         ></input>

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
        <div>
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
         </div>
      )}
    </div>
   </>
  );
}


export default UserProducts;