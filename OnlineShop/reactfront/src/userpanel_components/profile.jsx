

import { useEffect, useState } from 'react';
import './userpanel.css';
import api from '../services/api';
import '../global_components/HomePage.css';
import './updateProductForm.css';
import toast, { Toaster } from 'react-hot-toast';
import './cart.css';
import './profile.css';
import './updateProductForm.css';
import './order.css';
function UserProfile(){
    const [profile,setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [edit,setEdit] = useState(false);


    const fetchProflie = async() => { 
        try{
            const res = await api.get('/myprofile/');
            setProfile(res.data);
        }catch(error){
            console.error(error.response.data);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProflie();
    },[]);

    if (loading) {
        return <div>در حال بارگذاری پروفایل...</div>;
    }

    const handleEdit = () => {
        setEdit(true);
    }

    const handleBack = () => {
        setEdit(false);
        fetchProflie();
    }

    if(edit){
        return <UpdateProfile
                prof={profile}
                onBack={() => handleBack()}
            />;
    }

    return (
        <div className='profile' >
            <div>
                {(profile.user.first_name || profile.user.last_name) ?
                    <h2>{profile.user.first_name} {profile.user.last_name}</h2> :
                    '---'
                }
            </div>

            <div className='user-info'>

                    <div className='profile-info-row'>
                        <span className='profile-label'>phone number:</span>
                            {profile.phone_number? (
                            <span className='profile-value'>{profile.phone_number}</span>) :
                        ''}
                         </div>
                    
                    <div className='profile-info-row'>
                        <span className='profile-label'>email:</span>
                            {profile.user.email?
                                (
                                    <span className='profile-value'>{profile.user.email}</span>
                                ) :
                                ''}               
                    </div>


                    <div className='profile-info-row'>
                        <span className='profile-label'>address:</span>
                        {profile.address?
                            (
                                <span className='profile-value'>{profile.address}</span>
                            ) :
                            ''} 
                    </div> 

                    <div className='profile-info-row'>
                        <span className='profile-label'>post code:</span>
                        {profile.post_code?
                            (
                                <span className='profile-value'>{profile.post_code}</span>
                            ) :
                            ''}
                    </div>  
            </div>
            <div className='action-div'>
                <button onClick={() => handleEdit()}>ویرایش</button>
            </div>
        </div>
    );
}



function UpdateProfile({prof,onBack}){

    const [profile,setProfile] = useState(prof);

    const [form,setForm] = useState({
        first_name : profile.user.first_name || '',
        last_name : profile.user.last_name || '',
        email : profile.user.email || '',
        address : profile.address || '',
        post_code : profile.post_code || '',
        phone_number : profile.phone_number || '',
    });


    const handleSubmit = async(e) => {
        try{
            e.preventDefault();
            const res = await api.patch('/myprofile/',{
                ...profile,
                user: {
                    ...profile.user,
                    first_name:form.first_name,
                    last_name: form.last_name,
                    email : form.email
                },
                address : form.address,
                phone_number : form.phone_number,
                post_code : form.post_code

            });

            toast.success('پروفایل ویرایش شد !');
        }catch(error){
            console.error('خطا در ویرایش محصول');
        }
    }

    const handleChange = (e) => {
        const {name,value} = e.target;
        setForm(prev => ({
            ...prev,
            [name]:value,
        }));
    }

    return (
        <div>
            <button onClick={onBack} className='orders-back-btn'><strong>→</strong></button>
            <div className='update-product-form'>
                <h2>ویرایش پروفایل ✏️</h2>
        <form onSubmit={handleSubmit}>

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
            <label htmlFor='post_code' >post code</label>
            <input 
            name='post_code' 
            className="form-control"
            value={form.post_code}
            onChange={handleChange}
            />
            </div>

            <div className="form-group">
            <label htmlFor='phone_number' >phonr number</label>
            <input 
            name='phone_number' 
            className="form-control"
            value={form.phone_number}
            onChange={handleChange}
            />
            </div>


            <div className="form-group">
            <label htmlFor="address" >address</label>
            <textarea 
            name="address" 
            value={form.address}
            className="form-control"
            onChange={handleChange}
            rows={5}
            />
            </div>

            <div className="form-actions">
            <button type='submit' className="btn btn-submit">💾 ذخیره تغییرات</button>
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
        </div>
    );
}


export default UserProfile;