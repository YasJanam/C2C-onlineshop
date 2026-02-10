
import { useEffect, useState } from 'react';
import '../userpanel_components/userpanel.css';
import api from '../services/api';
import HomePage from '../global_components/products';
import '../global_components/HomePage.css';
import '../userpanel_components/updateProductForm.css';
import '../userpanel_components/cart.css';
import toast, { Toaster } from 'react-hot-toast';

import '../userpanel_components/profile.css';

import EditUser from './EditUser';
import UserProductsAdminPanel from './UserProducts';
import UserCart from './UserCart';
import AddUser from './AddUser';
import UserOrders from './UserOrders';


function AllUsers(){
    const [users,setUsers] = useState([]);
    const [loading,setLoading] = useState(true);
    
    const [editUser,setEditUser] = useState(false);
    const [userProducts,setUserProducts] = useState(false);
    const [userOrders,setUserOrders] = useState(false);
    const [userCart,setUserCart] = useState(false);
    const [addUser,setAddUser] = useState(false);
    const [selectedUser,setSelectedUser] = useState(null);

    const [query,setQuery] = useState('');


    const fetchUsers = async () => {
        try{
        let url = `/users/`;
        if(query !== '') {
            const params = new URLSearchParams();
            params.append('search', query);
            url += `?${params.toString()}`;
        };
            const res = await api.get(url);
            setUsers(res.data);
        }catch{
            toast.error('خطا در واکشی کاربران');
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    },[query]);

    if(loading){
        return (<div><p className='loading'>در حال واکشی کاربران ...</p></div>);
    }

    const handleBack = () => {
        setSelectedUser(null);
        setEditUser(false);
        setUserProducts(false);
        setUserCart(false);
        setUserOrders(false);
        setAddUser(false);
        fetchUsers();
    }

    if(editUser){
        return <EditUser user={selectedUser}  onBack={handleBack} />
    }


    if(userOrders){
        return <UserOrders user={selectedUser} onBack={handleBack} />
    }

    if(userProducts){
        return (<UserProductsAdminPanel user={selectedUser} onBack={handleBack} />);
    }

    if(userCart){
        return <UserCart user={selectedUser} onBack={handleBack} />
    }

    if(addUser){
        return <AddUser onBack={handleBack} />
    }

    
    const handleEditUser = (user) => {
        setEditUser(true);
        setSelectedUser(user);
    }

    const handleDeleteUser = async(user) => {
        try{
            const res = await api.delete(`/users/${user.id}/`);
            if(res.status>=200 && res.status<300){
                toast.success(`${user.first_name} ${user.last_name} حذف شد!`);
            }
            fetchUsers();
        }catch{
            toast.error('خطا در حذف کاربر');
        }
    }

    const handleUserOrders = (user) => {
        setUserOrders(true);
        setSelectedUser(user);
    }

    const handleUserProducts = (user) => {
        setUserProducts(true);
        setSelectedUser(user);
    }

    const handleUserCart = (user) => {
        setUserCart(true);
        setSelectedUser(user);
    }

    const handleAddUser = () => {
        setAddUser(true);
    }

    const handleChangeSearch = (e) => {
        const {value} = e.target;
        setQuery(value);
    }

    return (<div>
    <button className='add-new-user' onClick={() => handleAddUser()}><strong>➕</strong></button>
    <input type="text" 
        id="UserSearchInput"
        onChange={(e) => handleChangeSearch(e)}
         placeholder="جستجو بر اساس نام ، فامیل ، نام کاربری  ..." 
         value={query}
         style={{float:'left'}}
         ></input>
    <div className='product-table-container'>
        <div className='table-header h2'>
            <h2>کاربران</h2>  
        </div >
        <div>
            <table className="products-table">
                <thead>
                    <tr className="table-header-row">
                        <td>نام و نام خانوادگی</td>
                        <td>نام کاربری</td>
                        <td>ویرایش  ✏️</td>
                        <td> محصولات 🏷️</td>
                        <td>سبد خرید 🛒</td>
                        <td>خریدهای قبلی 🛍️</td>
                        <td>حذف کاربر 🗑️</td>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr className="table-row">
                            <td>{user.first_name} {user.last_name}</td>
                            <td><strong>{user.username}</strong></td>
                            <td><button className="table-button2" onClick={() => handleEditUser(user)}>✏️</button></td>
                            <td><button className="table-button2" onClick={() => handleUserProducts(user)}>🏷️</button></td>
                            <td><button className="table-button2" onClick={() => handleUserCart(user)}>🛒</button></td>
                            <td><button className="table-button2" onClick={() => handleUserOrders(user)}>🛍️</button></td>
                            <td><button className="table-button2" onClick={() => handleDeleteUser(user)}>🗑️</button></td>
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
    </div>);

}


export default AllUsers;










