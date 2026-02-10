

import { useEffect, useState } from 'react';
//import { Tree } from 'react-arborist';
import api from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import '../userpanel_components/userpanel.css';
import './category.css';

function Categories() {

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  //const [selectedCat,setSelectedCat] = useState(null); // نود انتخاب شد کنونی

  const [children,setChildren] = useState([]); //فرزندان نود انتخاب شده کنونی
  const [root,setRoot] = useState(null); // همه
  const [path,setPath] = useState([]);

  const [addCat,setAddCat] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/category/');
      const data = res.data;
      
      setCategories(data);
      setLoading(false);

      const rootCategory = data.find(d => d.name === 'همه');
      if (rootCategory) {
        setRoot(rootCategory);
        if(path.length===0){
          path.push(rootCategory)
        }
      }


    } catch (error) {
      console.error('❌ خطا:', error);
      toast.error('خطا در واکشی دسته ها');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  
  useEffect(() => {
    const parent = path[path.length-1];
    const newChildren = categories.filter(d => 
        d.parent && d.parent.id === parent.id
      );
   setChildren(newChildren);
  }, [categories,path]); 



  const handleClick = (category) => {
    setPath(prev => [...prev,category]);
  }
 
  const handleBack = () => {
    if(path.length >1){
      setPath(prev => prev.slice(0,-1));
    }
  }

  const onBack = () => {
    setAddCat(false);
    fetchCategories();
  }

  const handleAddCat = () => {
    setAddCat(true);
  }

  const handleDeleteCat = async(cat) => {
    try{
      const res = await api.delete(`/category/${cat.id}/`);
      if(res.status>=200 && res.status<300){
        toast.success('دسته حذف شد!');
      }
      fetchCategories();
    }catch{
      toast.error('خطا در حذف دسته');
    }
  }


  if (loading) {
    return <div><p className='loading'>در حال بارگذاری . . .</p></div>;
  }

  if(addCat){
    return <AddCategory parent={path[path.length-1]} onBack={onBack}/>
  }

  return (<>
  <div className='home-page'>
    {(path.length>1)?
     <button onClick={() => handleBack()} className='orders-back-btn'><strong>→</strong></button> :
    <></> }
    <div>
      <button className='add-new-cat' style={{textAlign:'left'}} onClick={() => handleAddCat()}><strong>➕</strong></button>
    </div>
  <div>
    <h2>{path[path.length-1].name}</h2>
  </div>
  <div className='product-container'>
    {children.map(cat => ( 
    <div key={cat.id} className='category-card'>
      <button className="remove-cat" onClick={() => handleDeleteCat(cat)}>🗑️</button>
      <div onClick={() => handleClick(cat)}>
        <h3><strong>{cat.name}</strong></h3>
      </div>
    </div>
    ))
    }
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
  </>);
}

function AddCategory({parent,onBack}){
  const [form,setForm] = useState({name:''});

  const onChange = (e) => {
        const {name,value} = e.target;
        setForm(prev => ({
          ...prev,
          [name]:value
        }))
  }

  const onSubmit = async(e) => {
    e.preventDefault();
    try{
      const res = await api.post('/category/',{
        parent_id:parent.id,
        name:form.name
      });

      if(res.status>=200 && res.status <300){
        toast.success('دسته بندی اضافه شد!');
      }
      onBack();
    }catch{
        toast.error('خطا در افزودن دسته بندی!');
        onBack();
    }
  }

  return (<div>
    <div>
      <button onClick={onBack} className='orders-back-btn'><strong>→</strong></button>
    </div>
    <div className='update-product-form'>
    <form onSubmit={onSubmit}>
      <div className="form-group">
          <label htmlFor='name'>name</label>
          <input value={form.name}
          className="form-control"
          name='name' 
          onChange={(e) => onChange(e)}
          ></input>
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


export default Categories;