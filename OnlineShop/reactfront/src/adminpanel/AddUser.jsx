
import { useEffect, useState } from 'react';
import '../userpanel_components/userpanel.css';
import api from '../services/api';
import HomePage from '../global_components/products';
import '../global_components/HomePage.css';
import '../userpanel_components/updateProductForm.css';
import '../userpanel_components/cart.css';
import toast, { Toaster } from 'react-hot-toast';

import '../userpanel_components/profile.css';



function AddUser({onBack}){
    const [form,setForm] = useState({
        first_name : '',
        last_name : '',
        email : '',
        username : '',
        password : '',
        
    });

    const handleChange = (e) => {
        const {name,value} = e.target;
        setForm(prev => ({
            ...prev,
            [name]:value
        }))
    }

    const onSubmit = async(e) => { 
        e.preventDefault();
        
        try{
        const res = await api.post('/user/admin/',{ 
            first_name: form.first_name,
            last_name : form.last_name,
            email : form.email,
            username : form.username,
            password : form.password,
            group : 'user'
        });
        if(res.status>=200 && res.status<300){
            toast.success('کاربر با موفقیت افزوده شد !');
            
        }
        }catch(error){
            toast.error('خطا در ساخت کاربر',error);
        }
    }

    return (<div>
            <button onClick={onBack} className='orders-back-btn'><strong>→</strong></button>
            <div className='update-product-form'>
                <h2>افزودن کاربر</h2>
        <form onSubmit={onSubmit}>

            <div className="form-group">
            <label htmlFor='first_name'>user first-name</label>
            <input 
            name='first_name'
            className="form-control"
            value={form.first_name}
            onChange={handleChange}
            />
            </div>

            <div className="form-group">
            <label htmlFor='last_name'>user last-name</label>
            <input 
            name='last_name' 
            className="form-control"
            value={form.last_name}
            onChange={handleChange}
            />
            </div>

            <div className="form-group">
            <label htmlFor='email' >email</label>
            <input 
            name='email' 
            className="form-control"
            value={form.email}
            onChange={handleChange}
            />
            </div>


            <div className="form-group">
            <label htmlFor='username' >username</label>
            <input 
            name='username' 
            required
            className="form-control"
            value={form.username}
            onChange={handleChange}
            />
            </div>

            <div className="form-group">
            <label htmlFor='password' >password</label>
            <input 
            name='password' 
            required
            className="form-control"
            
            type='password'
            onChange={handleChange}
            />
            </div>


            <div className="form-actions">
            <button type='submit' className="btn btn-submit">💾 ذخیره</button>
            </div>        
        </form>
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
    </div>);

}

export default AddUser;