

// =======================================
// ------------ نمایش کاربران عادی ----------
async function renderUsers() {
  content.innerHTML = `
  <input type="text" id="UserSearchInput" placeholder="جستجو بر اساس نام ، فامیل ، نام کاربری  ..." style="width: 25%; float: left; margin-left:25px; padding: 10px; margin-bottom: 20px; border-radius: 8px; border: 1px solid #ccc;">
  <h2>لیست کاربران عادی</h2>
  <div id="usersTable"></div>
  `;
  const container = document.getElementById('usersTable');

  const searchInput = document.getElementById('UserSearchInput'); 

    renderUsersWithQuery('');

    let typingTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
        const query = e.target.value.trim();
        container.innerHTML= ``;
        renderUsersWithQuery(query);
        }, 300);
    });
}


async function renderUsersWithQuery(query) {

  const table = document.createElement('table');
  table.className = 'cart-table';
  table.innerHTML = `
        <thead>
            <tr>
                <th>نام کاربر</th>
                <th> فامیل</th>
                <th>یوزرنیم</th>
                <th>ویرایش</th>
                <th>محصولات کاربر</th>
                <th>سبدخرید</th>
                <th>خرید های قبلی</th>
                <th>حذف کاربر</th>

            </tr>
        </thead>
        <tbody></tbody>
        `; 

    const container = document.getElementById('usersTable')

    const tbody = table.querySelector('tbody');

    tbody.innerHTML = '';

    const users = await fetchUsers(query);

    users.forEach(user =>{
      const tr = document.createElement('tr');
            tr.className = 'cart-row';
            tr.innerHTML=`
            <td>${user.first_name}</td>
            <td>${user.last_name}</td>
            <td>${user.username}</td>
            `;  

            const update_td = document.createElement('td');
            const update_button = document.createElement('button');
            update_button.className = 'cart-button';
            update_button.textContent = 'ویرایش';
            update_button.addEventListener('click', () => renderUpdateUserByAdmin(user));
            update_td.appendChild(update_button);
            tr.appendChild(update_td);

            // ستون محصولات
            const products_td = document.createElement('td');
            const products_btn = document.createElement('button');
            products_btn.className = 'cart-button';
            products_btn.textContent = 'محصولات';
            products_btn.addEventListener('click', () => renderUserProducts(user.id));
            products_td.appendChild(products_btn);
            tr.appendChild(products_td);

            // ستون سبد خرید
            const cart_td = document.createElement('td');
            const cart_btn = document.createElement('button');
            cart_btn.className = 'cart-button';
            cart_btn.textContent = 'سبد خرید';
            cart_btn.addEventListener('click', () => renderUserCart(user.id));
            cart_td.appendChild(cart_btn);
            tr.appendChild(cart_td);

            // ستون خریدهای قبلی
            const orders_td = document.createElement('td');
            const orders_btn = document.createElement('button');
            orders_btn.className = 'cart-button';
            orders_btn.textContent = 'خریدهای قبلی';
            orders_btn.addEventListener('click', () => renderUserOrdersByAdmin(user.id));
            orders_td.appendChild(orders_btn);
            tr.appendChild(orders_td);

            // ستون حذف
            const delete_td = document.createElement('td');
            const delete_btn = document.createElement('button');
            delete_btn.className = 'delete-cartItem-button';
            delete_btn.textContent = 'حذف';
            delete_btn.addEventListener('click', () => renderDeleteUser(user.id));
            delete_td.appendChild(delete_btn);
            tr.appendChild(delete_td);
                tbody.appendChild(tr);    
              });

              container.appendChild(table);
}


async function fetchUsers(query='') {
    try{
    let url = `${API}/users/`;
    if(query) {
        const params = new URLSearchParams();
        params.append('search', query);
        url += `?${params.toString()}`;
    };
    const res = await fetch(url,{
        method:'GET',
        headers:{
            'Authorization':`Bearer ${token}`
        }
    });
    if(!res.ok){
        alert('error, get users request failed');
        return;
    };
    const cats = await res.json();
    return cats ;

    }catch{
    alert('خطا در دریافت کاربران');
    return null;
    }
}


// ------- نمایش محصولات یک کاربر --------

async function renderUserProducts(user_id) {
    content.innerHTML = `
    <input type="text" id="UserProductsSearchInput" placeholder="جستجو بر اساس نام  ..." style="width: 20%; float: left; margin-left:20px; padding: 10px; margin-bottom: 10px; border-radius: 8px; border: 1px solid #ccc;">
   <button class="back-button2" onclick="renderUsers()">بازگشت</button>
    <h2 style="text-align:center;"> محصولات</h2>
    <br>
    
    <div id="userProducts-adminpanel" class="product-container"></div>`;
    const container = document.getElementById('userProducts-adminpanel');
    const searchInput = document.getElementById('UserProductsSearchInput');

    renderUserProductsWithQuery('',user_id);

    let typingTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
        const query = e.target.value.trim();
        container.innerHTML= ``;
        renderUserProductsWithQuery(query,user_id);
        }, 300);
    });    
   
  
}


async function renderUserProductsWithQuery(query,user_id) {
  const container = document.getElementById('userProducts-adminpanel');
  //container.innerHTML = '';

  const prods = await fetchUserProducts(query,user_id);
  prods.forEach(d => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
            <h3>${d.name}</h3>
            <p><strong>قیمت : </strong>${d.price}</p>
            <p><strong>تعداد : </strong>${d.stock}</p>
            <p><strong>توصیف : </strong>${d.description}</p>
            `;

            card.addEventListener('click', () => showUserProductDetials(d));
            container.appendChild(card);        
      });

}


async function fetchUserProducts(query='',user_id) {
  try{
    let url = `${API}/user/products/${user_id}/`;
    if(query) {
        const params = new URLSearchParams();
        params.append('search', query);
        url += `?${params.toString()}`;
    };
    const res = await fetch(url,{
        method:'GET',
        headers:{
            'Authorization':`Bearer ${token}`
        }
    });
    if(!res.ok){
        alert('error, get products request failed');
        return;
    };
    const products = await res.json();
    return products ;
  }catch{
    alert('خطا در دریافت لیست محصولات');
  }
}


// --------- نمایش جزییات محصول یک کاربر ---------
async function showUserProductDetials(d) {

        content.innerHTML = `
        <div class="product-detail-card">
        <h2 id="show-ProductName-adminPage" >${d.name}</h2>
        
        <div class="userProduct-info-adminPage">
            <p id="showPrice"><strong>قیمت : </strong>${d.price}</p>
            <p id="showStock"><strong>تعداد : </strong>${d.stock}</p>
            <p id="showDescription"><strong>توصیف : </strong>${d.description}</p>
            <p id="showOwner"><strong>صاحب محصول : </strong>${d.product_owner.first_name} ${d.product_owner.last_name}</p>

        <h4>دسته ها</h4>
        <ul>
            ${d.categories.length
                ? d.categories.map(c =>`<li>${c.category.name}</li>`)
                : ''
            }
        </ul>
        </div>
        <br>
        
        <button onclick="renderUserProducts(${d.product_owner.id})">بازگشت</button>
        <button onclick="deleteUserProductByAdmin(${d.product_owner.id},${d.id})" >حذف</button>
        
        `; 
        // دکمه حذف مشکل داره ----- >
        // <button onclick="deleteUserProductByAdmin(${d.product_owner.id},${d.id})" >حذف</button>
  }


// -------- حذف محصولِ کاربر -------
async function deleteUserProductByAdmin(user_id,product_id) {
    try{
      const res = await fetch(`${API}/products/${product_id}/`,{
        method:'DELETE',
        headers:{
          'Authorization':`Bearer ${token}`,
        }
      });
      if(!res.ok){
        alert('خطا در حذف محصول');
      }
      renderUserProducts(user_id);
    }catch{
      alert('خطا در انجام عملیات');
    }
}


// ------- حذف یک کاربر ------
async function deleteUserProduct(user_id,product_id) {
    try{
      const res = await fetch(`${API}/products/${product_id}/`,{
        method:'DELETE',
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      if(!res.ok){
        alert('محصول حذف نشد');
        return;
      }

      renderUserProducts(user_id);

    }catch{
      alert('خطا در حذف کاربر');
    }
}


// ----- حذف کاربر ------
async function renderDeleteUser(id) {
  try{
    const res = await fetch(`${API}/users/${id}/`,{
      method:'DELETE',
      headers:{
        'Authorization':`Bearer ${token}`,
      }
    });

    if(!res.ok){
      alert('کاربر حذف نشد');
      return;
    };

    renderUsers();
  }catch{
    alert('خطا در حذف کاربر');
  }
}


async function renderUserOrders(id) {

}

// ========================
// --------- user cart ---------
async function renderUserCart(user_id) {
  try{
    content.innerHTML = `
    <button class="back-button2" onclick="renderUsers()">بازگشت</button>
    <h2 style="text-align:center;">سبد خرید</h2>
    <br>
    <div id="usercart-byadmin"></div>
    `;
    const container = document.getElementById('usercart-byadmin');

        const table = document.createElement('table');
        table.className = 'cart-table';
        table.innerHTML = `
        <thead>
            <tr>
                <th>نام محصول</th>
                <th>قیمت واحد</th>
                <th>تعداد</th>
                <th>قیمت کل</th>
                <th>حذف</th>
                <th>+1 </th>
                <th>-1</th>

            </tr>
        </thead>
        <tbody></tbody>
        <tfoot></tfoot>
        `;
         
        const tbody = table.querySelector('tbody');
        const tfoot = table.querySelector('tfoot');  
    /*
    const res = await fetch(`${API}/cart/${user_id}/`,{
      method:'GET',
      headers:{
        'Authorization':`Bearer ${token}`
      }
    });

    const cart = await res.json();*/


    const res_items = await fetch(`${API}/cartitems/${user_id}/`,{
      method:'GET',
      headers:{
        'Authorization':`Bearer ${token}`,
      }
    });

    const cartitems = await res_items.json();

        var price_all = 0
      
        cartitems.forEach(c => {
            const tr = document.createElement('tr');
            tr.className = 'cart-row';
            tr.innerHTML=`
            <td>${c.product.name}</td>
            <td>${c.product.price}</td>
            <td>${c.quantity}</td>
            <td>${c.product.price * c.quantity}</td>
            <td><button class="delete-cartItem-button" onclick="renderDeleteCartItemByAdmin(${user_id},${c.id})">حذف</button> </td>
            <td><button id="addOneByAdmin${c.id}" class="cart-button" onclick="renderChangeQuantityByAdmin(${user_id},${c.id},${c.quantity + 1})"> +1 </button></td>
            <td><button id="reduceOneByAdmin${c.id}" class="cart-button" onclick="renderChangeQuantityByAdmin(${user_id},${c.id},${c.quantity - 1})"> -1</button></td>
            `;
            price_all += (c.product.price * c.quantity);
            tbody.appendChild(tr);
        });

        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>جمع کل</td>
        <td>${price_all}</td>
        `;

        tfoot.appendChild(tr)

        container.appendChild(table); 
    
  }catch{
    alert('خطا در انجام عملیات');
  }
}

// -------- delete userCartItem --------
async function renderDeleteCartItemByAdmin(user_id,item_id) {
  try{
    const res = await fetch(`${API}/cartitems-admin/${item_id}/`,{
      method:'DELETE',
      headers:{
        'Authorization':`Bearer ${token}`,
      }
    });
    

    if(!res.ok){
      alert('خطا در حذف آیتم');

    };

    renderUserCart(user_id);
  }catch{
    alert('خطا');
  }
}

// ------ +1 , -1 quantity -------------
async function renderChangeQuantityByAdmin(user_id,item_id,quantity) {
  try{
        const res = await fetch(`${API}/cartitems-admin/${item_id}/`,{
            method:'PATCH',
            headers:{
                'Authorization':`Bearer ${token}`,
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
              quantity:quantity
            }),
        });

        if(!res.ok) {
          const data = await res.json();
            alert(`${data}`);
            /*
            const data = await res.json();
            if (mode === '+') {
               const but = document.getElementById(`addOneByAdmin${item_id}`);
               but.textContent = `${data}`;
            }else{
               const but = document.getElementById(`reduceOneByAdmin${item_id}`);
               but.textContent = `${data}`;             
            }*/
            return;
        }else{
          renderUserCart(user_id);
        }
  }catch{
    alert('خطا در تغییر تعداد');
  }
}



// -------- user orders -------
async function renderUserOrdersByAdmin(user_id) {
  try{
    content.innerHTML = `
    <button class="back-button2" onclick="renderUsers()">بازگشت</button>
    <h2 style="text-align:center;">سفارشات کاربر</h2>
    <br>
    <div id="userorder-byadmin"></div>
    `;
    const container = document.getElementById('userorder-byadmin');

        const table = document.createElement('table');
        table.className = 'cart-table';
        table.innerHTML = `
        <thead>
            <tr>
                <th>تاریخ خرید</th>
                <th>قیمت کل</th>
            </tr>
        </thead>
        <tbody></tbody> 
        `;
         
    const tbody = table.querySelector('tbody');
      
    const res = await fetch(`${API}/orders-admin/${user_id}/`,{
      method:'GET',
      headers:{
        'Authorization':`Bearer ${token}`,
      }
    });

    const orders = await res.json();
    //const items = await order.items;
      
        orders.forEach(c => {
            const tr = document.createElement('tr');
            //const items = await c.items;
            tr.className = 'cart-row';
            tr.innerHTML=`
            <td>${c.created_at}</td>
            <td>${c.total_price}</td>
            `;
      //<td><button class="delete-cartItem-button" onclick="renderOrderItemsByAdmin(${user_id},${c.id})">مشاهده جزییات خرید</button> </td>
            tr.addEventListener('click',() => renderOrderItemsByAdmin(user_id,c.items));
            tbody.appendChild(tr);
        });

        container.appendChild(table); 
    
  }catch{
    alert('خطا در انجام عملیات');
  }
}


// ------------ order items by admin -------
async function renderOrderItemsByAdmin(user_id,items) {
    content.innerHTML = `
    <button class="cart-button" onclick="renderUserOrdersByAdmin(${user_id})">بازگشت</button>
    <h2 style="text-align:center;">آیتم های خریداری شده</h2>
    <div id="userOrderItemContainer-admin" class="order-container"></div>`;
    const container = document.getElementById('userOrderItemContainer-admin');
      /*
        const button = document.createElement('button');
        button.className = 'cart-button';
        button.textContent = 'بازگشت';
        button.onclick = () => renderUserOrdersByAdmin(user_id);
        container.appendChild(button);
      */
    try{

       /*
        const res = await fetch(`${API}/orders-user/${id}`,{
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${token}`
          }
    });
        const data = await res.json();
        const items = await data.items*/

        items.forEach(d =>{
            const card = document.createElement('div');
            card.className = 'product-detail-card';
            //const date = new Date(d.created_at); 
            card.innerHTML = `
            <h2>${d.product_name}</h2>
            <p><strong>صاحب محصول : </strong>${d.product_owner.first_name} ${d.product_owner.last_name}</p>
            <p><strong> تعداد : </strong>${d.quantity}</p>
            <p><strong> قیمت یک عدد : </strong>${d.price}</p>
            
            <p><strong>قیمت کل: </strong>${d.total_price}</p>
            <p><strong> توصیف : </strong>${d.description}</p>    
            `;
            // <p><strong>تاریخ : </strong>${d.created_at}</p>
            // <button onclick="renderUserOrders()">بازگشت</button>
            //card.onclick = () => showOrderItemDetails(d.id);
            container.appendChild(card);
        });

    }catch{
        alert('error, OrderItems');
    } 
}


// -------- add new user --------
async function renderAddNewUser() {
  
  content.innerHTML = `
    <h2 style="text-align:center; color:#333; margin-bottom:20px;">افزودن کاربر جدید</h2>

    <div id="addUserByAdmin" style="
        display:flex; flex-direction:column; gap:15px; 
        max-width:600px; margin:auto; padding:20px; 
        border-radius:15px; box-shadow:0 4px 15px rgba(0,0,0,0.1);
        background:#f9f9f9;
    ">

    <label>نام </label>
    <input id="first-name" style="padding:12px; border-radius:8px; border:1px solid #ccc; font-size:16px;">

    <label>فامیل </label>
    <input id="last-name"  style="padding:12px; border-radius:8px; border:1px solid #ccc; font-size:16px;">

    <label>ایمیل </label>
    <input id="email"  style="padding:12px; border-radius:8px; border:1px solid #ccc; font-size:16px;">

    <label>نقش کاربر</label>
    <select id="select-user-group" style="padding:12px; border-radius:8px; border:1px solid #ccc;font-size:16px;">
    <option value="user">کاربر عادی</option>
    </select>

    <label>نام کاربری *</label>
    <input id="user_username" style="padding:12px; border-radius:8px; border:1px solid #ccc; font-size:16px;">

    <label>رمز عبور *</label>
    <input id="user_password" type="password" style="padding:12px; border-radius:8px; border:1px solid #ccc; font-size:16px;">

    <br>
    </div>
   `;

   const container = document.getElementById('addUserByAdmin');


   const button = document.createElement('button');
   button.className = 'add-button2';
   //button.style = "background:#3810a5; font-size:20px;";
   button.textContent = 'ثبت';
   container.appendChild(button);
   button.addEventListener('click', async () => {
  try{
    const payload = {
        first_name:document.getElementById('first-name').value,
        last_name:document.getElementById('last-name').value,
        email:document.getElementById('email').value,
        username:document.getElementById('user_username').value,
        password:document.getElementById('user_password').value,
        group:document.getElementById('select-user-group').value,
      };

   const res = await fetch(`${API}/user/admin/`,{
    method:'POST',
    headers:{
      'Authorization':`Bearer ${token}`,
      'Content-Type':'application/json'
    },
    body:JSON.stringify(payload)
   });

   const data = await res.json();

   if(!res.ok){
   button.textContent = data.error;
   button.style ="background:red";
   await sleep(2000);
   //return ;
   //renderAddNewUser();
   renderUsers();
   };

   //const but = document.getElementById('addUserByAdmin-button')
   button.style ="background:#28a745";
   button.textContent = 'کاربر افزوده شد';
   
   await sleep(1400);
   //renderAddNewUser();
   renderUsers();
   
   //renderAddNewUser();
  }catch{
    alert('خطا در انجام عملیات');
  }
   });
}


async function submitAddNewUserByAdmin() {
  try{
const payload = {
    first_name:document.getElementById('first-name').value,
    last_name:document.getElementById('last-name').value,
    email:document.getElementById('email').value,
    username:document.getElementById('user_username').value,
    password:document.getElementById('user_password').value,
    group:'user',
   };

   const res = await fetch(`${API}/user/admin/`,{
    method:'POST',
    headers:{
      'Authorization':`Bearer ${token}`,
      'Content-Type':'application/json'
    },
    body:JSON.stringify(payload)
   });

   if(!res.ok){
    alert('خطا در افزودن کاربر');
    return;
   }
   const but = document.getElementById('addUserByAdmin-button')
   but.textContent = 'کاربر افزوده شد';
   //renderAddNewUser();
  }catch{
    alert('خطا در انجام عملیات');
  }
}


// ---------- update user by admin ----------
async function renderUpdateUserByAdmin(user) {
  const currentGroup = user.groups && user.groups.length ? user.groups[0].name :"";

  content.innerHTML = `
  <button class="back-button2" onclick="renderUsers()">بازگشت</button>
    <h2 style="text-align:center; color:#333; margin-bottom:20px;"> ویرایش کاربر</h2>
    <div id="updateUserByAdmin" style="
        display:flex; flex-direction:column; gap:15px; 
        max-width:600px; margin:auto; padding:20px; 
        border-radius:15px; box-shadow:0 4px 15px rgba(0,0,0,0.1);
        background:#f9f9f9;
    ">

    <label>نام </label>
    <input id="first-name-update" value="${user.first_name || ''}"  style="padding:12px; border-radius:8px; border:1px solid #ccc; font-size:16px;">

    <label>فامیل </label>
    <input id="last-name-update" value="${user.last_name || ''}" style="padding:12px; border-radius:8px; border:1px solid #ccc; font-size:16px;">

    <label>ایمیل </label>
    <input id="email-update" value="${user.email || ''}" style="padding:12px; border-radius:8px; border:1px solid #ccc; font-size:16px;">

    <label>نقش کاربر</label>
    <select id="select-user-group-update" style="padding:12px; border-radius:8px; border:1px solid #ccc;font-size:16px;">
    <option value="">انتخاب نقش(${currentGroup}:حفظ نقش کنون)</option>
    <option value="user">کاربر عادی</option>
    <option value="admin">ادمین</option>
    </select>

    <label> نام کاربری</label>
    <input id="user_username-update" value="${user.username}" readonly style="padding:12px; border-radius:8px; border:1px solid #ccc; font-size:16px;">

    <label>رمز عبور</label>
    <input id="user_password-update" type="password" style="padding:12px; border-radius:8px; border:1px solid #ccc; font-size:16px;">

    <br>
    </div>
   `;

  //document.getElementById('select-user-group-update').value = user.groups && user.groups.length ? user.groups[0].name : '';

  const container = document.getElementById('updateUserByAdmin');

   const button = document.createElement('button');
   button.className = 'add-button2';
   button.textContent = 'ویرایش';
   container.appendChild(button);
   button.addEventListener('click', async () => {
  try{
  const payload = {
      first_name:document.getElementById('first-name-update').value,
      last_name:document.getElementById('last-name-update').value,
      email:document.getElementById('email-update').value,
      username:user.username,
      password:document.getElementById('user_password-update').value,
      group:document.getElementById('select-user-group-update').value,
    };

    const res = await fetch(`${API}/user/admin/`,{
      method:'PATCH',
      headers:{
        'Authorization':`Bearer ${token}`,
        'Content-Type':'application/json'
      },
      body:JSON.stringify(payload)
    });

    const data = await res.json();

    if(!res.ok){
    button.textContent = data.error;
    button.style ="background:red";
    await sleep(2000);
    renderUsers();
    };

    button.style ="background:#28a745";
    button.textContent = 'کاربر ویرایش شد';
    
    await sleep(2000);
    renderUsers();
    
    //renderAddNewUser();
  }catch{
    alert('خطا در انجام عملیات');
  }
   });
}
