const registerBtn = document.getElementById('register');
const errorMsg = document.getElementById('errorMsg');
const login_Btn = document.getElementById("login-panel");

registerBtn.addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        errorMsg.textContent = "لطفاً همه فیلدها را پر کنید";
        errorMsg.style.display = 'block';
        return;
    }

    try {
        // ثبت نام
        const reg_res = await fetch(`${API}/create-user/`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                username:username,
                password:password
            }),
        });
        
        if(!reg_res.ok){
            const err = await reg_res.json()
            alert(JSON.stringify(err));
            return ;
        }
        registerBtn.style = "background:green; color:white;";
        registerBtn.textContent = "ثبت نام با موفقیت انجام شد";

        login_Btn.style = "background:orange;";


        
        /*
        // گرفتن توکن
        const res = await fetch(`${API}/api/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (!res.ok) {
            errorMsg.textContent = data.detail || 'خطا در ورود به پنل';
            errorMsg.style.display = 'block';
            window.location.href = './login.html';
        }

        // ذخیره توکن در localStorage
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        window.location.href = './userpanel.html';
        */
       
    } catch (err) {
        console.error(err);
        errorMsg.textContent = 'خطا در ارتباط با سرور';
        errorMsg.style.display = 'block';
    }
});

if(login_Btn.style.background === 'orange'){
        login_Btn.addEventListener('click',async () =>{
            
        const res = await fetch(`${API}/api/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (!res.ok) {
            errorMsg.textContent = data.detail || 'خطا در ورود به پنل';
            errorMsg.style.display = 'block';
            window.location.href = './login.html';
        }

        // ذخیره توکن در localStorage
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        window.location.href = './userpanel.html';            
        })
}


login_Btn.addEventListener('click',async () => {
    /*
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if(username && password){
        login_Btn.addEventListener('click',async () =>{
            
        const res = await fetch(`${API}/api/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (!res.ok) {
            errorMsg.textContent = data.detail || 'خطا در ورود به پنل';
            errorMsg.style.display = 'block';
            window.location.href = './login.html';
        }

        // ذخیره توکن در localStorage
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        window.location.href = './userpanel.html';            
        });
    }else{
        window.location.href = './login.html';
    }*/
   
    window.location.href = './login.html';

});