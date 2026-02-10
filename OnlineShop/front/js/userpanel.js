
/*
const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

// باز/بسته کردن sidebar
hamburger.onclick = () => {
  sidebar.style.display = "flex";
  overlay.style.display = "flex";
};

overlay.onclick = () => {
  sidebar.style.display = "none";
  overlay.style.display = "none";

  // بستن همه submenu ها وقتی sidebar بسته میشه
  document.querySelectorAll('.submenu').forEach(sm => sm.style.display = "none");
};

// باز/بسته کردن submenu ها
document.querySelectorAll('.menu-item').forEach(item => {
  const targetId = item.getAttribute('data-target');
  if (!targetId) return;

  item.onclick = () => {
    const menu = document.getElementById(targetId);
    if (!menu) return;

    // بستن بقیه submenu ها
    document.querySelectorAll('.submenu').forEach(sm => {
      if (sm !== menu) sm.style.display = "none";
    });

    // باز/بسته کردن submenu خود آیتم
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
  };
});
*/



// فعال کردن باز و بسته شدن خودکار زیرمنوها
document.querySelectorAll('.menu-item').forEach(item => {
  const targetId = item.getAttribute('data-target');
  if (!targetId) return;

  item.addEventListener('click', () => {
    const menu = document.getElementById(targetId);
    if (!menu) return;

    // بستن بقیه submenu ها
    document.querySelectorAll('.submenu').forEach(sm => {
      if (sm !== menu) sm.style.display = 'none';
    });

    // باز یا بسته کردن همین منو
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
  });
});



//==========================================
// ------- all products ---------------------
/*
async function renderHomePage() {
    content.innerHTML = `<h2> محصولات</h2><div id="allProducts" class="product-container"></div>`;
    const container = document.getElementById('allProducts');
    try{
        const res = await fetch(`${API}/products/`,{
            method:'GET',
            // چرا به ارسال توکن نیاز هست؟؟ این اندپوینت باید بدون احراز هویت هم کار کنه
            headers:{
                'Authorization':`Bearer ${token}`,
            }
        });

        const data = await res.json();
        data.forEach(d => {
            if(d.is_active===true){
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                <h3>${d.name}</h3>
                <p><strong>قیمت : </strong>${d.price}</p>
                <p><strong>تعداد موجود : </strong>${d.stock - d.buyed_num}</p>
                <p><strong>توصیف : </strong>${d.description}</p>
                `;
                card.onclick = () => showProductDetials(d);
                container.append(card);
            };
        });
    }catch{
        alert("خطا در دریافت محصولات");
    }
}*/

async function renderHomePage() {
    content.innerHTML = `
    <input type="text" id="productsSearchInput" placeholder="جستجو بر اساس نام ..." style="width: 25%; float: left; margin-left:25px; padding: 10px; margin-bottom: 20px; border-radius: 8px; border: 1px solid #ccc;">

    <h2> محصولات</h2><div id="allProducts" class="product-container"></div>`;
    const container = document.getElementById('allProducts');   
    const searchInput = document.getElementById('productsSearchInput');

    renderAllProductsWithQuery('');

    let typingTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
        const query = e.target.value.trim();
        container.innerHTML= ``;
        renderAllProductsWithQuery(query);
        }, 300);
    });
}

async function renderAllProductsWithQuery(query) {
    const container = document.getElementById('allProducts');

    const data = await fetchAllProducts(query);
        data.forEach(d => {
            if(d.is_active===true){
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                <h3>${d.name}</h3>
                <p><strong>قیمت : </strong>${d.price}</p>
                <p><strong>تعداد موجود : </strong>${d.stock - d.buyed_num}</p>
                <p><strong>توصیف : </strong>${d.description}</p>
                `;
                card.onclick = () => showProductDetials(d);
                container.append(card);
            };
        }); 
}


async function fetchAllProducts(query) {
    try{
    url = `${API}/products/`;
    if(query){
        const params = new URLSearchParams();
        params.append('search', query);
        url += `?${params.toString()}`; 
    }
       const res = await fetch(url,{
            method:'GET',
            // چرا به ارسال توکن نیاز هست؟؟ این اندپوینت باید بدون احراز هویت هم کار کنه
            headers:{
                'Authorization':`Bearer ${token}`,
            }
        });
        const data = await res.json();
        return data;     
    }catch{
        alert('خطا در دریافت محصولات')
        renderHomePage();
    }
}

async function showProductDetials(d) {
    try{
        content.innerHTML = `
        
        <div class="product-detail-card">
        <h2 id="showName">${d.name}</h2>
        
        <div class="product-info" id="product_detail_card_">
            <p id="showPrice"><strong>قیمت : </strong>${d.price}</p>
            <p id="showStock"><strong>تعداد موجود : </strong>${d.stock - d.buyed_num}</p>
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
        <div id='card-buttons'>
        <br>
        <button onclick="renderProductOwner(${d.product_owner.id})" style="float:left; background:orange;">صاحب محصول</button> 
        <button onclick="renderHomePage()">بازگشت</button>
      
        <button id="addToUserButton">افزودن به سبد خرید</button>
        
        </div>
        <h4>نظرات در باره این محصول</h4>
        <div id="commentsDiv-product${d.id}"></div>
        `; 

        

        const div_buttons = document.getElementById('card-buttons')

        const comment_button = document.createElement('button');
        comment_button.textContent = 'ثبت نظر';
        comment_button.className = 'product-detail-card button';
        comment_button.style = "background:rgba(145, 234, 2, 1); display: none; margin:5px";
        comment_button.addEventListener('click',() => renderSubmitComment(d.id));
        //div_buttons.appendChild(document.createElement('br'));
        div_buttons.appendChild(comment_button);
        div_buttons.appendChild(document.createElement('br'));
      
    

        const url = `${API}/user-orderitems/${d.id}/`;
        const buy_response = await fetch(url,{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            }
        });
       
        if(buy_response.ok){     
            comment_button.style.display = 'inline-block';       
        }
            /*
            const allCommentsBtn = document.createElement('button');
            allCommentsBtn.textContent = 'نظرات';
            allCommentsBtn.className = 'product-detail-card button';
            allCommentsBtn.addEventListener('click',() => renderProductComments(d.id));
            div_buttons.appendChild(allCommentsBtn);*/

        renderProductComments(d.id);
        
        const button = document.getElementById('addToUserButton');
        button.addEventListener('click',async () => {
                try{
                const payload = {
                    product_id : d.id,
                };
                const res = await fetch(`${API}/cartitems-user/`,{
                    method: "POST",
                    headers:{
                        "Authorization":`Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });
                //const resu = await res.json();
                if (!res.ok) {
                    const resu = await res.json();
                    button.textContent=`${resu}` 
                    button.style="background:red;";
                    return ;
                }


                button.textContent= " به سبد خرید اضافه شد";
                button.style = "background:#28a745; "
                //renderHomePage();
            }catch{
                alert("خطا در انجام عملیات ");
            }
        });
        
    }catch{
        alert('خطا در نمایش جزییات');
    }   
}

async function renderProductComments(product_id) {
    //const main_container = document.getElementById(`commentsDiv-product${d.id}`);
    const comments_res = await fetch(`${API}/product-comments/${product_id}/`,{
        method:'GET',
        headers:{
            'Authorization':`Bearer ${token}`,
        }
    });

    const comments = await comments_res.json();
    comments.forEach(c => {
        renderComment(c,product_id);
    });
}

async function renderComment(comment,product_id) {
    const main_container = document.getElementById(`commentsDiv-product${product_id}`);
    const rating = comment.star;
    comment_div = document.createElement('div');
    
    comment_div.className = "rating-stars";
    comment_div.style = "padding-right:15%;";
    comment_div.innerHTML = ` 
            
           <div style="display:flex; direction:rtl; align-items: center;gap: 15px;">
           <h4>${comment.user.first_name} ${comment.user.last_name}</h4>
            <p style="font-size:12px; color: #666;">${comment.created_at}</p>
            </div>        
        `; 
        for (let i=1;i<= rating;i++){
            comment_div.innerHTML +=`
            <label for="star${rating}" style="color:#ffc107; font-size:25px;">★</label>
            `;
        }
        for (let i=1;i<= 5-rating;i++){
            comment_div.innerHTML +=`
            <label for="star${rating}" style="color:#666; font-size:25px;">★</label>
            `;
        } 
              

       // if(comment.comment){
        comment_div.innerHTML += `<p id="user-comment"  border-color:white;">${comment.comment}</p>
        <br>
        `;
       // } 

    main_container.appendChild(comment_div);
}




async function renderSubmitComment(product_id) {
    try{
        content.innerHTML = `
        <button class="back-button2" onclick="renderHomePage()">بازگشت</button>
        <div id="comment_div" class="product-detail-card" style="width:45%">
        <h3>از 1 تا 5 چه امتیازی میدهید؟؟</h3>
        <br>
            <div class="rating-stars" style="padding-right:25%;">
            
            <input type="radio" id="star5" name="rating" value="5">
            <label for="star5">★</label>
            
            <input type="radio" id="star4" name="rating" value="4">
            <label for="star4">★</label>
            
            <input type="radio" id="star3" name="rating" value="3">
            <label for="star3">★</label>
            
            <input type="radio" id="star2" name="rating" value="2">
            <label for="star2">★</label>
            
            <input type="radio" id="star1" name="rating" value="1">
            <label for="star1">★</label>
            </div>
        <br>
        <div style="padding-top:30px">
            <label>نظرتان را بنویسید</label>
            <br>
            <textarea id="user-comment" style="width:100%;"></textarea>
            <button id="comment_submit" onclick="submitComment(${product_id})" style="background:rgba(66, 230, 2, 1);">ثبت</button>
        </div>
        <br>
        
        `;       
    }catch{
        alert('خطا در انجام عملیات');
    }
}


async function submitComment(product_id) { 
    try{
        const ratingInput = document.querySelector('input[name="rating"]:checked')
        const ratingValue = ratingInput? Number(ratingInput.value) : 0

        const productId = product_id;
        const url = `${API}/user-comments/`;
        const res = await fetch(url,{
            method:'POST',
            headers:{
                'Authorization':`Bearer ${token}`,
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                product_id:productId,
                comment:document.getElementById('user-comment').value,
                star:ratingValue
            })
        });
        if(!res.ok){
            alert('خطا در ثبت نظر');
        }
        //showProductDetials(productId);
        alert('کامنت شما ثبت شد.');
    }catch{
        alert('خطا در انجام عملیات');
    }
}




async function addToUserCart(id) {
    try{
        const payload = {
            product_id :id,
        };
        const res = await fetch(`${API}/cartitems-user/`,{
            method: "POST",
            headers:{
                "Authorization":`Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        //const resu = await res.json();
        if (!res.ok) throw new Error("خطا در افزودن به سبد خرید");

        alert("محصول به سبد خرید اضافه شد");
        renderHomePage();
        
    }catch{
        alert("خطا در انجام عملیات ");
    }
}



//==================================================
// -------- user products --------------------------
async function renderUserProducts() {
    content.innerHTML = `
    <button class="remove-cat-button" style="font-size:30px; float: left; margin-left:8%;" id="removeCategory" onclick="renderRemoveCategory()">-</button>
    <button class="add-cat-button" style="font-size:30px; float: left; margin-left:15px;" id="addCategory" onclick="renderAddNewCategory()">+</button>
    <input type="text" id="searchInput" placeholder="جستجو بر اساس نام ..." style="width: 25%; float: left; margin-left:25px; padding: 10px; margin-bottom: 20px; border-radius: 8px; border: 1px solid #ccc;">
    
    <h2> فروشگاه من</h2><div id="userProductContainer" class="product-container"></div>`;
    const container = document.getElementById('userProductContainer');
    const searchInput = document.getElementById('searchInput');

    renderUserProductsWithQuery('');

    let typingTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
        const query = e.target.value.trim();
        container.innerHTML= ``;
        renderUserProductsWithQuery(query);
        }, 300);
    });
}

async function renderUserProductsWithQuery(query) {

    const data = await fetchUserProductsByQuery(query);
    const container = document.getElementById('userProductContainer');
    
        data.forEach(d =>{
            if(d.is_active === true){
                
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
            <h3>${d.name}</h3>
            <p><strong>قیمت : </strong>${d.price}</p>
            <p><strong>تعداد کل : </strong>${d.stock}</p>
            <p><strong>مانده : </strong>${d.stock - d.buyed_num}</p>
            <p><strong>توصیف : </strong>${d.description}</p>
            `;
            // <p><strong>دسته : </strong>${d.category.name}</p>
            card.onclick = () => showUserProductDetails(d.id);
            container.appendChild(card);
            }
        }); 
}

async function fetchUserProductsByQuery(query) {
    try{
    let url =`${API}/user-products/`; 
    if(query) {
        const params = new URLSearchParams();
        params.append('search', query);
        url += `?${params.toString()}`;
    };
        const res = await fetch(url,{
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${token}`
          }
        });
    if(!res.ok){
        alert('error, get userProducts request failed');
        return;
    };
        const data = await res.json();
        return data;
    }catch{
    alert('خطا در دریافت محصولات');
    return null;
    }
}


async function showUserProductDetails(id) {
      const res = await fetch(`${API}/user-products/${id}`,{
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${token}`
          }
    });

    const  d = await res.json();
    
    content.innerHTML = `
    <div class="product-detail-card">
    <h2 id="showName">${d.name}</h2>
    
    <div class="product-info">
        <p id="showPrice"><strong>قیمت : </strong>${d.price}</p>
        <p id="showStock"><strong>تعداد کل : </strong>${d.stock}</p>
        <p id="showStock"><strong>تعداد خریداری شده : </strong>${d.buyed_num}</p>
        <p id="showStock"><strong>تعداد مانده : </strong>${d.stock - d.buyed_num}</p>
        <p id="showDescription"><strong>توصیف : </strong>${d.description}</p>
        <p><strong>فعال : </strong>${d.is_active}</p>
        <h4>دسته ها</h4>
        <ul>
            ${d.categories.length
                ? d.categories.map(c =>`<li>${c.category.name}</li>`)
                : ''
            }
        </ul>
        
    </div>
    <br>
    <button onclick="renderUserProducts()">بازگشت</button>
    <button onclick="renderDeleteUserProduct(${d.id})" style="background:#d32f2f; float:left;margin-left:3px;">حذف</button>
    <button onclick="renderUpdateUserProduct(${d.id})" style="background:orange; float:left;margin-left:6px;">ویرایش</button>
    
    
    `;  
    // <p><strong>دسته : </strong>${d.category.name}</p>
}


// ----------------------------------------------------
// ========== add new Product by user =========
async function renderAddUserProduct(){

  content.innerHTML = `
    <h2 style="text-align:center; color:#333; margin-bottom:20px;">افزودن محصول برای فروش</h2>

    <div id="addUserProduct" style="
        display:flex; flex-direction:column; gap:15px; 
        max-width:600px; margin:auto; padding:20px; 
        border-radius:15px; box-shadow:0 4px 15px rgba(0,0,0,0.1);
        background:#f9f9f9;
    ">

    <label>نام محصول</label>
    <input id="addName" style="padding:12px; border-radius:8px; border:1px solid #ccc; font-size:16px;">

    <label>تعداد </label>
    <input id="addStock" type="number" style="padding:12px; border-radius:8px; border:1px solid #ccc; font-size:16px;">

    <label>قیمت واحد</label>
    <input id="addPrice" type="number" style="padding:12px; border-radius:8px; border:1px solid #ccc; font-size:16px;">

    <label>توصیف محصول</label>
    <input id="addDescription" style="padding:12px; border-radius:8px; border:1px solid #ccc; font-size:16px;">

    <label>دسته بندی ها</label>

    </div>
   `;

    // --------- render categoties -------------
    const res = await fetch(`${API}/category`,{
    method:'GET',
    headers:{
        'Authorization':`Bearer ${token}` // این باید حذف بشه
    }
  });
  const categories = await res.json();
  
  const Div = document.getElementById("addUserProduct");
  const checkboxDiv = document.createElement("div");
  checkboxDiv.id = "checkboxDiv";
  /*const label = document.createElement("label");
  label.textContent = "دسته بندی ها";
  newdiv.appendChild(label);*/
  const br = document.createElement("br")
  checkboxDiv.appendChild(br);
  checkboxDiv.className = "newDiv";
  categories.forEach(category =>{

    checkboxDiv.innerHTML += `
    <input type="checkbox" name="category" value="${category.id}">
    ${category.name}
    `;
  });

    Div.appendChild(checkboxDiv);

    var myDiv = document.getElementById("addUserProduct");
    const button = document.createElement("button");
    button.textContent = "ثبت";
    button.className = "add-button";
    button.addEventListener('click', () => submitAddUserProduct()); //selectedCategories

    myDiv.appendChild(button); 
}


function checkedCheckBox(checkboxId){
    const checkboxDiv = document.getElementById(checkboxId);
    const checkboxes = checkboxDiv.getElementsByTagName("input");
    
    const selectedCategories = [];
    for (var i=0;i<checkboxes.length;i++){
        if(checkboxes[i].type ==="checkbox" && checkboxes[i].checked){
            selectedCategories.push(parseInt(checkboxes[i].value));
        
        }
    }
    return selectedCategories;
}


async function submitAddUserProduct() { // selectedCategories
    try{

        const category_ids = checkedCheckBox("checkboxDiv");
        const name = document.getElementById('addName').value;
        const stock = document.getElementById('addStock').value;
        const price = document.getElementById('addPrice').value;
        const description = document.getElementById('addDescription').value;

        if(!name){
            alert('نام محصول را وارد کنید');
            return;           
        }

        const payload = {
            name : name,    
            stock: Number(stock),   
            price: Number(price),   
            description: description,
            //categoryIds : categoryIds,
        }; 
        
        
        const res1 = await fetch(`${API}/user-products/`,{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        
        if(!res1.ok ){
            alert('خطا در افزودن محصول' );
            return;
        }

        const data = await res1.json();
        const product_id = data.id;
        

        const res2 = await fetch(`${API}/products-categories/add/`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`,
            },
            body: JSON.stringify({
                product_id : product_id,
                category_ids: category_ids
            })
        });

        if(!res2.ok){
            alert('خطا در افزودن دسته بندی');
        }

        alert('محصول با موفقیت برای فروش اضافه شد');
        renderUserProducts();

    }catch{
        alert('خطا در ارتباط با سرور');
    }
}


// ------------------------------------------
// ========= update product by user =========
async function renderUpdateUserProduct(id) {
     try{  
        const res = await fetch(`${API}/user-products/${id}`,{
            method: 'GET',
            headers:{
                'Authorization':`Bearer ${token}`,
                //'Content-Type': 'application/json',
            }
        });
        
        const data = await res.json(); 
        
        content.innerHTML = `
        <h2 style="text-align:center; color:#333; margin-bottom:20px;">آپدیت محصول برای فروش</h2>

        <div class="update-container" id="update-user-product">
            
            <label>نام محصول</label>
            <input id="updateName" value="${data.name}" style="padding:12px; border-radius:8px; border:1px solid #ccc; font-size:16px;">

            <label>تعداد </label>
            <input id="updateStock" value="${data.stock}" type="number"  style="padding:12px; border-radius:8px; border:1px solid #ccc; font-size:16px;">

            <label>قیمت واحد</label>
            <input id="updatePrice" value="${data.price}" type="number"  style="padding:12px; border-radius:8px; border:1px solid #ccc; font-size:16px;">

            <label>توصیف محصول</label>
            <input id="updateDescription" value="${data.description}" style="padding:12px; border-radius:8px; border:1px solid #ccc; font-size:16px;">

            <label>دسته ها</label>
        

        </div>
        `;
        //
 
        /*
            <label>فعال</label>
            <select id="updateIs_active">
            <option value="${true}">فعال</option>
            <option value="${false}">غیرفعال</option>
            </select>
        */

        // --------- render categoties -------------
        const res2 = await fetch(`${API}/category`,{
        method:'GET',
        headers:{
            'Authorization':`Bearer ${token}` // این باید حذف بشه
        }
        });
        const categories = await res2.json();
        
        const Div = document.getElementById("update-user-product");
        const checkboxDiv = document.createElement("div");
        checkboxDiv.id = "checkboxDivUpdate";
        const br = document.createElement("br")
        checkboxDiv.appendChild(br);
        checkboxDiv.className = "newDiv";
        categories.forEach(category =>{

            checkboxDiv.innerHTML += `
            <input type="checkbox" name="category" value="${category.id}">
            ${category.name}
            `;
        });

        Div.appendChild(checkboxDiv);


        //var myDiv = document.getElementById("addUserProduct");
        const button = document.createElement("button");
        button.textContent = "ثبت";
        button.className = "add-button";
        button.addEventListener('click', () => submitUpdateUserProduct(id)); //selectedCategories

        Div.appendChild(button);

        const bk_button = document.createElement("button");
        bk_button.textContent = "بازگشت";
        bk_button.className ='back-button';
        bk_button.style = "width:15%; font-size:15px; padding:5px;";
        bk_button.addEventListener('click',() =>showUserProductDetails(id));
        Div.appendChild(bk_button);
        
    
    }catch{
        alert("خطا در بارگذاری اطلاعات محصول ");
    }
}


async function submitUpdateUserProduct(id) {
    try{
        const category_ids = checkedCheckBox("checkboxDivUpdate");
        const name = document.getElementById('updateName').value  ;
        const stock = document.getElementById('updateStock').value  ;
        const price = document.getElementById('updatePrice').value  ;
        //const is_active_select = document.getElementById('updateIs_active').value;
       // const is_active = is_active_select === 'true' ? true : false;
        const description = document.getElementById('updateDescription').value  ;

        const payload = {
            name : name,    
            stock: Number(stock),   
            price: Number(price),
            //is_active: Boolean(is_active),   
            description: description  
        }; 
        
        const res = await fetch(`${API}/user-products/${id}/`,{
            method: 'PATCH',
            headers: {
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        });
        
        if(!res.ok){
            alert('خطا در اپدیت محصول' );
            return;
        }

        //const data = await res1.json();
        //const product_id = data.id;
        

        const res2 = await fetch(`${API}/products-categories/add/`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`,
            },
            body: JSON.stringify({
                product_id : id,
                category_ids: category_ids
            })
        });

        if(!res2.ok){
            alert('خطا در افزودن دسته بندی');
        }

        //alert('محصول با موفقیت برای فروش اپدیت شد');
        renderUserProducts();

    }catch{
        alert('خطا در ارتباط با سرور');
    }
}


//-----------------------------------------
// ========= delete ======================
function renderDeleteUserProduct(id) {
    content.innerHTML=`
    <div class="update-container">
    <h3 style="text-align:center; color:#333; margin-bottom:20px;">آیا میخواهید محصول را حذف کنید ؟؟</h3>
    
    <button onclick="deleteUserProduct(${id})" style="
                padding:12px; background:#d32f2f; color:white; border:none; border-radius:8px;
                cursor:pointer; font-size:16px;">بله</button>
    <button onclick="showUserProductDetails(${id})" style="
                padding:12px; background:#1976d2; color:white; border:none; border-radius:8px;
                cursor:pointer; font-size:16px;">خیر</button>
   
    </div>
    `;    
}

async function deleteUserProduct(id) {
    const res = await fetch(`${API}/user-products/${id}/delete/`,{
        method:'DELETE',
        headers:{
            'Authorization':`Bearer ${token}`
        }
    });
    if(!res.ok){
        alert('خطا در حذف محصول');
        showUserProductDetails(id);
        return;
    }
    renderUserProducts();
}




