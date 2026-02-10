
import { useEffect, useState } from 'react';
import './userpanel.css';
import api from '../services/api';
import '../global_components/HomePage.css';
import './updateProductForm.css';
import toast, { Toaster } from 'react-hot-toast';
import './cart.css';

import UserProducts from './UserProducts';



function UserCart(){
    const [cartitems,setCartItems] = useState([]);
    const [totalPrice,setTotalPrice] = useState(0);

    const fetchUserCartItems = async() => {
        try{
        const res = await api.get('/cartitems-user/');
        const cartitems_res = res.data;
        setCartItems(cartitems_res);

        // update total price
        /*
        const calculatedTotal = cartitems.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
            }, 0);
        setTotalPrice(calculatedTotal);*/

        }catch{
            toast.error('خطا در دریافت سبد خرید');
        }
    }

    useEffect(() => {
        const calculatedTotal = cartitems.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
            }, 0);
        setTotalPrice(calculatedTotal);
    },[cartitems]);

    useEffect(() => {
        fetchUserCartItems();
    },[]);


    const handleDelete = async(itemID) => {
        try{
            const res = await api.delete(`/cartitems-user/${itemID}/`);

            if(res.status >=200 && res.status<300){ 
                toast.success('محصول حذف شد');
                fetchUserCartItems();
            }
        }catch{
            toast.error('خطا در حذف محصول !');
        }
    }

    const handleAddMinesQuantity = async(itemID,quantity) => {

        try{
        const res = await api.patch(`/cartitems-user/${itemID}/`,{quantity:quantity});

            if(res.status >=200 && res.status<300){
                fetchUserCartItems();
            }
            
        }catch(error){
            toast.error(error.response.data);
        }
    }

    return (<div product-table-container>
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
                {cartitems.map((item) => ( 
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
                    <td><button className={cartitems.length !== 0?'table-buy-button' : 'table-disable-buy-button'}>خرید</button></td>
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
    </div>);

}


export default UserCart;