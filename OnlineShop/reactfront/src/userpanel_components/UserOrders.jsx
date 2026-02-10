
import { useEffect, useState } from 'react';
import './userpanel.css';
import api from '../services/api';
import '../global_components/HomePage.css';
import './updateProductForm.css';
import toast, { Toaster } from 'react-hot-toast';

import './cart.css';
import './order.css';

function UserOrders(){
    const [orders,setOrders] = useState([]);
    const [selectedOrder,setSelectedOrder] = useState(null);

    const fetchOrders = async() => {
        try{
            const res = await api.get('/orders-user/'); 
            const user_orders = res.data;
            setOrders(user_orders);
        }catch(error){
            toast.error(error.response.data)
        }
    }

    useEffect(()=>{
        fetchOrders();
    },[]); 

    const handleSelectOrder = (order) => {
        setSelectedOrder(order);
    }

    const handleBack = () => {
        setSelectedOrder(null);
    }

    if(selectedOrder){
        return <UserOrderItems
            order = {selectedOrder}
            onBack = {() => handleBack()}
        />;
    }


    return (<div className='product-container'> 
    <h2>خریدهای قبلی</h2>
   
    {orders.length?(orders.map((order) =>
        (<div  className='product-card' onClick={(order) => handleSelectOrder(order)}  key={order.id}>
            <p>تاریخ خرید : {order.created_at}</p>
            <p>قیمت کل : {order.total_price}</p>
      <div className='product-footer'>
        <span className='view-details'>مشاهده جزییات →</span>     
      </div>
    </div>))):  <p className='no-prodcut' >خرید قبلی ندارید</p>}
    </div>);
}



function UserOrderItems({order,onBack}){ 
    const [orderItems,setOrderItems] = useState([]);

    const fetchOrderItems = async() => {
        try{
            const res = await api.get(`/orders-user/${order.id}`);
            setOrderItems(res.data);
            
        }catch(error){
            console.error('خطا در دریافت محصولات خرید قبلی');
        }
        
    }

    useEffect(() => {
        fetchOrderItems();
    },[]);

    return ( 
        <div>
        <div>
            <button onClick={onBack} className='orders-back-btn'><strong>→</strong></button>
        </div>
        <div className='product-table-container'>
            
            <div className='table-header h2'>
                <h2>محصولات خریداری شده</h2>        
            </div>
                <div>
                    <table className="products-table"> 
                        <thead>
                            <tr className="table-header-row">
                                <td> نام کالا</td>
                                <td>قیمت واحد</td>
                                <td>تعداد</td>
                                <td>قیمت کل</td>
                                <td>صاحب محصول</td>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.map((item) => ( 
                                <tr className="table-row">
                                    <td><strong>{item.product.name}</strong></td>
                                    <td>{item.price}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.quantity * item.price}</td>
                                    <td>{item.product.product_owner}</td>
                                </tr>
                                )) //toLocaleString 
                                } 
                        </tbody>
                        <tfoot>
                            <tr>
                                <td><div><p>مبلغ کل : {order.total_price}</p></div></td>
                                <td><div><p>تاریخ خرید : {order.created_at}</p></div></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

        </div>
    </div>
    );
}


export default UserOrders;