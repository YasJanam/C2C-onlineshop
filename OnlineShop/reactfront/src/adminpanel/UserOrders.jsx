
import { useEffect, useState } from 'react';
import '../userpanel_components/userpanel.css';
import api from '../services/api';
import HomePage from '../global_components/products';
import '../global_components/HomePage.css';
import '../userpanel_components/updateProductForm.css';
import '../userpanel_components/cart.css';
import toast, { Toaster } from 'react-hot-toast';

import '../userpanel_components/profile.css';




function UserOrders({user,onBack}){
    const [orders,setOrders] = useState([]);
    const [orderLoading,setOrderLoading] = useState(true);

    // show order-details 
    const [selectedOrder,setSelectedOrder] = useState(null);
    const [showDetails,setShowDetails] = useState(false);

    const fetchOrders = async() => {
        try{
            const res = await api.get(`/orders-admin/${user.id}/`);
            if(res.status>=200 && res.status<300){
                setOrderLoading(false);
            }
            setOrders(res.data);
        }catch{
            toast.error('خطا در واکشی سفارشات');
        }
    }

    const handleBack = () => {
        setSelectedOrder(null);
        setShowDetails(false);
    }

    const handleShowDetails = (order) => {
        
        setSelectedOrder(order);
        setShowDetails(true);
    }

    useEffect(() => {
        fetchOrders();
    },[]);

    if(orderLoading){
        return <div><p className='loading'>در حال بارگذاری ...</p></div>;
    }

    if(showDetails){
        return <OrderDetails order={selectedOrder} onBack={handleBack}/>
    }


    return (<div>
        <div className='back-button-div-cartuser'>
            <button onClick={onBack} className='orders-back-btn'><strong>→</strong></button>
        </div>
    <div product-table-container>
            <div className='table-header h2'>
                <h2>خریدهای قبلی</h2>
            </div>
            <table className="products-table">
                <thead >
                    <tr className="table-header-row">
                        <td>تاریخ خرید</td>
                        <td>قیمت کل</td>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((item) => ( 
                        <tr className="table-row" key={item.id} onClick={() => handleShowDetails(item)}>
                            <td>
                                <strong>{item.created_at}</strong>

                            </td>
                            <td>{item.total_price}</td>
                        </tr>
                    ))}
                </tbody>
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


export default UserOrders;


function OrderDetails({order,onBack}){  
    /*
    const [items,setItems] = useState([]);
    const [loading,setLoading] = useState(true);

    const fetchItems = async() => {
        try{
            const res = await api.get(`/orderitems/${order.id}/`);
            if(res.status>=200 && res.status<300){
                setLoading(false);
            }
            setItems(res.data);
        }catch{
            toast.error('خطا در واکشی موارد خریداری شده!');
        }
    }

    useEffect(() => {
        fetchItems();
    },[order.id]);*/

    if (!order.items) {
    return (<div>
        <button onClick={onBack} className='orders-back-btn'><strong>→</strong></button>
        <div><p className='loading'>در حال بارگذاری ...</p></div>
    </div>);
    }

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
                            {order.items.map((item) => ( 
                                <tr className="table-row">
                                    <td><strong>{item.product.name}</strong></td>
                                    <td>{item.price}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.quantity * item.price}</td>
                                    <td>{item.product.product_owner.username} ({item.product.product_owner.first_name} {item.product.product_owner.last_name})</td>
                                </tr>
                                )) //toLocaleString 
                                } 
                        </tbody>
                    </table>
                </div>
        </div>
    </div>
    );    
}