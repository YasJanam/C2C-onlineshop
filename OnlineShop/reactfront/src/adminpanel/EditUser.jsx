
import { useEffect, useState } from 'react';
import '../userpanel_components/userpanel.css';
import api from '../services/api';
import HomePage from '../global_components/products';
import '../global_components/HomePage.css';
import '../userpanel_components/updateProductForm.css';
import '../userpanel_components/cart.css';
import toast, { Toaster } from 'react-hot-toast';

import '../userpanel_components/profile.css';



/* ---------- Edit User --------- */
function EditUser({user,onBack}){ 

    const [form,setForm] = useState({
        first_name : user.first_name || '',
        last_name : user.last_name || '',
        email : user.email,
        group : user.groups && user.groups.length ? user.groups[0].name :'',
        password : ''
    });

    const handleSubmit = async(e) => { 
         e.preventDefault();
        try{
            const res = await api.patch('/user/admin/',{
                first_name : form.first_name,
                last_name : form.last_name,
                email : form.email,
                username : user.username,
                group : form.group,
                password : form.password
            });
            if(res.status>=200 && res.status<300){
                toast.success('کاربر با موفقیت ویرایش شد !');
            }

        }catch(error){
            toast.error(error);
        }
    }


    const handleChange = (e) => { 
        const {name,value} = e.target;
        setForm(prev => ({
            ...prev,
            [name] : value
        }))
    }

    
 
    return (<div>
        <button onClick={onBack} className='orders-back-btn'><strong>→</strong></button>
        <div className='update-product-form'>
            <h2>ویرایش ✏️</h2>
      
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>first name</label>
                <input 
                className="form-control"
                value={form.first_name}
                name='first_name'
                onChange={handleChange}
                ></input>
            </div>

            <div className="form-group">
                <label>last name</label>
                <input 
                className="form-control"
                value={form.last_name}
                name='last_name'
                onChange={handleChange}
                ></input>
            </div>

            <div className="form-group">
                <label>email</label>
                <input
                className="form-control" 
                value={form.email}
                name='email'
                onChange={handleChange}
                ></input>
            </div>

            <div className="form-group">
                <label>username</label>
                <input 
                className="form-control"
                value={user.username}
                name='username'
                onChange={handleChange}
                readOnly
                ></input>
            </div>

            <div className="form-group">
                <label>group</label>
                <select 
                className='select-edit-user'
                defaultValue={form.group}
                name='group'
                onChange={handleChange}
                >
                    <option value={'user'}>کاربر عادی</option>
                </select>
            </div>

            <div className="form-group">
                <label>password</label>
                <input
                className="form-control"
                name='password'
                onChange={handleChange}
                ></input>
            </div>

            <div className="form-actions">
            <button type='submit' className="btn btn-submit">💾 ذخیره تغییرات</button>
            </div>   
        </form>
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


export default EditUser;
