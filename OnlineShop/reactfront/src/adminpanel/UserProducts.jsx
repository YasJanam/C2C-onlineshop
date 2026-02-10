
import { useEffect, useState } from 'react';
import '../userpanel_components/userpanel.css';
import api from '../services/api';
import HomePage from '../global_components/products';
import '../global_components/HomePage.css';
import '../userpanel_components/updateProductForm.css';
import '../userpanel_components/cart.css';
import toast, { Toaster } from 'react-hot-toast';

import '../userpanel_components/profile.css';




function UserProductsAdminPanel({user,onBack}){
    const [products,setProducts] = useState([]);
    const [productsLoading,setProductsLoading] = useState(true);
    const [productDetails,setProductDetails] = useState(false);

    const [selectedProduct,setSelectedProduct] = useState(null);

    const fetchUserProducts = async() => {
        try{
            const res = await api.get(`/user/products/${user.id}/`);
            setProducts(res.data);
        }catch(error){
            console.error(error);
            toast.error('خطا در نمایش محصولات');
        }finally{
            setProductsLoading(false);
        }
    }

    useEffect(() => {
        fetchUserProducts();
    },[user.id]);

    const handleDeleteProduct = async(product) => {
        try{
            const res = await api.delete(`/products/${product.id}/`);
            fetchUserProducts();
        }catch(error){
            console.error(error);
            toast.error("خطا در حذف محصول");
        }
    }

    const handleShowDetails = (product) => {
        setProductDetails(true);
        setSelectedProduct(product);
    }

    const handleBackChild = () => {
        setProductDetails(false);
        setSelectedProduct(null);
    }

    if(productsLoading){
        return <div><p className='loading'>در حال بارگذاری محصولات ...</p></div>;
    }

    if(productDetails){
        return <UserProductDetails product={selectedProduct} onBack={handleBackChild} />
    }

    return (<div>
        <button onClick={onBack} className='orders-back-btn'><strong>→</strong></button>
    <div className='product-table-container'>
        {/*<button onClick={onBack} className='orders-back-btn'><strong>➕</strong></button>*/}
        <div className='table-header h2'>
            <h2>محصولات {user.first_name} {user.last_name}</h2>
        </div >
        
        <div>
            <table className="products-table">
                <thead>
                    <tr className="table-header-row">
                        <td>نام محصول</td>
                        <td>قیمت واحد💲</td>
                        <td>تعداد</td>
                        <td>تعداد مانده</td>
                        {/*<td>توصیف</td>*/}
                        <td>حذف 🗑️</td>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr className="table-row" key={product.id} onClick={() => handleShowDetails(product)}>
                            <td>{product.name}</td>
                            <td><strong>{product.price}</strong></td>
                            <td>{product.stock}</td>
                            <td>{product.stock - product.buyed_num}</td>
                            {/*<td><p>{product.description}</p></td>*/}
                            <td><button className="table-button2" onClick={() => handleDeleteProduct(product)}>🗑️</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
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
    </div>
    </div>
    );
}



function UserProductDetails({product,onBack}){
    const availableStock = product.stock - product.buyed_num ;
    //const [editMode, setEditMode] = useState(false);

  return (<div>
    <button onClick={onBack} className='orders-back-btn'><strong>→</strong></button>
    <div className='product-detail'>
      <div className='product-detail-card'>
        <h2>{product.name}</h2>
        <div className='product-info'>
          <div className='info-row'>
            <span className="label">قیمت :</span>
            <span className="value">{product.price.toLocaleString()} تومان</span>
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
            <p className="value">{product.description}</p>
          </div>

          <div className="info-row">
            <span className="label">صاحب محصول :</span>
            <span className="value">
              {product.product_owner.first_name} {product.product_owner.last_name}
            </span>
          </div>

          {product.categories && product.categories.length >0 && (
            <div className='categories-section'>
              <h2>دسته بندی ها</h2>
              <div className='categories-tags'>
                {product.categoreis.map((c,index) => (
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
        </div>
      </div>
    </div>

    </div>
  );
}

export default UserProductsAdminPanel;