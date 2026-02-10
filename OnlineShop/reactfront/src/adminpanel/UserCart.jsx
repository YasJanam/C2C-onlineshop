
import { useEffect, useState } from 'react';
import '../userpanel_components/userpanel.css';
import api from '../services/api';
import HomePage from '../global_components/products';
import '../global_components/HomePage.css';
import '../userpanel_components/updateProductForm.css';
import '../userpanel_components/cart.css';
import toast, { Toaster } from 'react-hot-toast';

import '../userpanel_components/profile.css';


function UserCart({user,onBack}){
    const [totalPrice,setTotalPrice] = useState(0);
    const [cart,setCart] = useState([]);
    const [loading,setLoading] = useState(true);
    
    const fetchUserCart = async() => {
        try{ 
            const res = await api.get(`/cartitems/${user.id}/`);
            setCart(res.data);
        }catch{
            toast.error('خطا در واکشی سبد خرید');
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUserCart();
    },[]);


    useEffect(() => {
        const calculatedTotal = cart.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
            }, 0);
        setTotalPrice(calculatedTotal);
    },[cart]);


    if(loading){ 
        return <div><p className='loading'>در حال واکشی سبد خرید  ...</p></div>;
    }


    const handleAddMinesQuantity = async(itemID,quantity) => {  
        try{
        const res = await api.patch(`/cartitems-admin/${itemID}/`,{quantity:quantity});
        fetchUserCart();
        }catch(error){
            toast.error(error.response.data);
        }
    }

    const handleDelete = async(itemID) => { 
        try{
            const res = await api.delete(`/cartitems-admin/${itemID}/`);
            fetchUserCart();
            if(res.status >=200 && res.status<300){ 
                toast.success('محصول حذف شد');
            }
        }catch{
            toast.error('خطا در حذف محصول !');
        }
    }

    
    return (<div>
        <div className='back-button-div-cartuser'>
            <button onClick={onBack} className='orders-back-btn'><strong>→</strong></button>
        </div>
    <div product-table-container>
            <div className='table-header h2'>
                <h2>سبد خرید</h2>
            </div>
            <table className="products-table">
                <thead >
                    <tr className="table-header-row">
                        <td>نام کالا</td>
                        <td>قیمت واحد</td>
                        <td>تعداد</td>
                        <td>قیمت کل</td>
                        <td>افزایش</td>
                        <td>کاهش </td>
                        <td> حذف</td>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item) => ( 
                        <tr className="table-row">
                            <td>
                                <strong>{item.product.name}</strong>

                            </td>
                            <td>{item.product.price.toLocaleString()}</td>
                            <td>
                                
                                    {item.quantity}
                                
                            </td>
                            
                            <td>{item.quantity * item.product.price}</td>

                            
                            <td><button className="table-button" onClick={() => handleAddMinesQuantity(item.id,item.quantity+1)}>➕</button></td>
                            <td><button className="table-button" onClick={() => handleAddMinesQuantity(item.id,item.quantity-1)}>➖</button></td>
                            <td><button className="table-button" onClick={() => handleDelete(item.id)}>🗑️</button></td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td>جمع کل : {totalPrice}</td>
                    </tr> 
                </tfoot>
            </table>
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
   
    </div>);
}

export default UserCart;