
async function renderProductOwner(user_id) {
    try{
        content.innerHTML = `
        <button class="back-button2" onclick="renderHomePage()">بازگشت</button>
        `;
        const respone = await fetch(`${API}/user-profile/${user_id}/`,{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            }
        });
        
        const profile = await respone.json();
        
        const card = document.createElement('div');
        card.className = "product-detail-card";
        card.innerHTML = `
        <h3 style="text-align:center;">${profile.user.first_name} ${profile.user.last_name}</h3>
        <p  style="text-align:center; ">شماره تماس : ${profile.phone_number}</p>
        <p style="text-align:center;">ایمیل : ${profile.user.email}</p>
        <button onclick="chat_with(${user_id})" style="background:#fb8619;">چت</button>
       
        `;
        content.appendChild(card);
        
    }catch{
        alert('خطا در گرفتن اطلاعات کاربر');
    }
}

async function myProfile() {
    try{
        content.innerHTML = `
        `;
        const res = await fetch(`${API}/myprofile/`,{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`,
                'Content-Type':'application/json',
            }
        });

        if(!res.ok){
            alert('خطا در دریافت پروفایل');
            return;
        };

        const prof = await res.json();

        const card = document.createElement('div');
        card.className = "product-detail-card";
        card.innerHTML = `
            <h3 style="text-align:center;">پروفایل</h3>

            <label>first name</label>
            <input id="my-fname" value="${prof.user.first_name || ''}">
            <br>

            <label>last name</label>
            <input id="my-lname" value="${prof.user.last_name || ''}">
            <br>

            <label>username</label>
            <input id="my-username" value="${prof.user.username}" readonly>
            <br>


            <label>phone number</label>
            <input id="my-phoneNumber" value="${prof.phone_number || ''}">
            <br>

            <label>email</label>
            <input id="my-email" value="${prof.user.email || ''}">

            <br>           
            <label>post-code</label>
            <input id="my-post-code" value="${prof.post_code || ''}">

            <br>
            <br>
            <label >address</label>
            <br>
            <textarea id="my-address">${prof.address || ''}</textarea>
        `;
        
        /*
        const in_fname = document.getElementById('my-fname');
        const in_lname = document.getElementById('my-lname');
        const in_pnum = document.getElementById('my-phoneNumber');
        const in_email = document.getElementById('my-address');
        const in_postcode = document.getElementById('my-post-code');*/
        
        const button = document.createElement('button');
        button.textContent = "ثبت تغییرات";
        button.addEventListener('click',async () => {

        prof.user.first_name = document.getElementById('my-fname').value;
        prof.user.last_name = document.getElementById('my-lname').value;
        prof.phone_number = document.getElementById('my-phoneNumber').value;
        prof.address = document.getElementById('my-address').value;
        prof.post_code = document.getElementById('my-post-code').value;
        prof.user.email = document.getElementById('my-email').value;
        
        const update_res = await fetch(`${API}/myprofile/`,{
            method:'PATCH',
            headers:{
                'Authorization':`Bearer ${token}`,
                'Content-Type':'application/json'
            },
            body:JSON.stringify(prof),
        });

        if(!update_res.ok){
            alert('خطا در ویرایش پروفایل');
            return;
        };

        myProfile();
        });

        card.appendChild(button);
        content.appendChild(card);
    }catch{
        alert('خطا در انجام عملیات');
    }
}