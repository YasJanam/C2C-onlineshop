import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // فقط این خط
import api from '../services/api';
import './login.css';

function LoginPage() {  // { setIsAuthenticated }
  const navigate = useNavigate();
  
  // state برای فرم
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // هندل تغییرات input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // پاک کردن خطا هنگام تایپ
    if (error) setError('');
  };
  
  // هندل submit فرم
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { username, password } = formData;
    
    // اعتبارسنجی
    if (!username || !password) {
      setError('لطفاً همه فیلدها را پر کنید');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // ۱. گرفتن توکن
      const tokenResponse = await api.post('/api/token/', {
        username,
        password
      });
      
      const { access, refresh } = tokenResponse.data;
      
      // ذخیره توکن‌ها
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // تنظیم هدر برای درخواست‌های بعدی
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      // ۲. گرفتن اطلاعات کاربر
      const userResponse = await api.get('/user-role/');
      const userData = userResponse.data;
      
      // ذخیره اطلاعات کاربر
      localStorage.setItem('role', userData.role);
      localStorage.setItem('user_id', userData.id);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // به‌روزرسانی وضعیت احراز هویت
      //setIsAuthenticated(true);
      
      // ۳. هدایت بر اساس نقش
      if (userData.role === 'admin') {
        navigate('/adminpanel');
      } else if (userData.role === 'user') {
        navigate('/userpanel');
      } else {
        //navigate('/dashboard');
      }
      
    } catch (err) {
      console.error('خطای لاگین:', err);
      
      if (err.response) {
        // خطا از سمت سرور
        if (err.response.status === 401) {
          setError('نام کاربری یا رمز عبور اشتباه است');
        } else if (err.response.status === 400) {
          setError(err.response.data.detail || 'اطلاعات وارد شده معتبر نیست');
        } else {
          setError('خطای سرور. لطفاً بعداً تلاش کنید');
        }
      } else if (err.request) {
        // درخواست ارسال شد اما پاسخی دریافت نشد
        setError('خطا در ارتباط با سرور');
      } else {
        //setError('خطای ناشناخته');
      console.error('🔴 خطای ناشناخته جزئیات:', err);
      setError(`خطا: ${err.message || 'ناشناخته'}`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // رفتن به صفحه ثبت‌نام
  const goToRegister = () => {
    navigate('/register');
  };
  
  return (
    <div className="login-page">
      <div className="login-container">
        <h2>ورود به پنل</h2>
        
        {error && (
          <div className="error-msg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="نام کاربری یا ایمیل"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
            autoComplete="username"
          />
          
          <input
            type="password"
            name="password"
            placeholder="رمز عبور"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            autoComplete="current-password"
          />
          
          <button 
            type="submit" 
            disabled={loading}
            className={loading ? 'loading' : ''}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                در حال ورود...
              </>
            ) : 'ورود'}
          </button>
        </form>
        
        
        <button 
          className="register-btn"
          onClick={goToRegister}
          disabled={loading}
        >
          ثبت نام
        </button>
        
        <div className="login-footer">
          <a href="/forgot-password" className="forgot-password">
            رمز عبور را فراموش کرده‌اید؟
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;