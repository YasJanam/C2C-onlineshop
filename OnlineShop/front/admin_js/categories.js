
// ---------- all categories ---------
async function renderCategories() {
    content.innerHTML = `
    <button class="remove-cat-button" style="font-size:30px; float: left; margin-left:8%;" id="removeCategory" onclick="renderRemoveCategory()">-</button>
    <button class="add-cat-button" style="font-size:30px; float: left; margin-left:15px;" id="addCategory" onclick="renderAddNewCategory()">+</button>
    <input type="text" id="searchInput" placeholder="جستجو بر اساس نام ..." style="width: 25%; float: left; margin-left:25px; padding: 10px; margin-bottom: 20px; border-radius: 8px; border: 1px solid #ccc;">
    <h2>دسته ها</h2>
    
    <br>
    <br>
    <div id="categories"></div>
    `;
    const container = document.getElementById('categories');
    container.className = "product-container";
    const searchInput = document.getElementById('searchInput');

    renderCategoriesWithQuery();

    let typingTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
        const query = e.target.value.trim();
        container.innerHTML= ``;
        renderCategoriesWithQuery(query);
        }, 300);
    });
}


async function renderCategoriesWithQuery(query) {

    const cats = await fetchCategories(query);
    const container = document.getElementById('categories');
    

    cats.forEach(d =>{
        if(d.name !== 'همه'){
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
        <h3>${d.name}</h3>
        `;
  
        card.onclick = () => renderCategoryProducts(d.id);
        container.appendChild(card);
        }
        }); 
}

async function renderCategoryProducts(cat_id) {
    content.innerHTML = `
    <button class="back-button2"  onclick="renderCategories()">بازگشت</button>
    <h2 style="text-align:center;">محصولات این دسته</h2>
    <div id="category-products-container/Admin"></div>
    `;
    const container = document.getElementById('category-products-container/Admin');
    container.className = "product-container";
    
    try{
        url = `${API}/category/products/${cat_id}/`;
        const response = await fetch(url,{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            }
        });
        const products = await response.json();

        products.forEach(p =>
        {
            const card = document.createElement('div');
            card.className = "category-card";
            card.innerHTML = `
            <h3>${p.name}</h3>
            <br>
            <p>قیمت واحد : ${p.price}</p>
            <p>تعداد : ${p.stock}</p>
            <br>
            <button class="cart-button" onclick="renderProductOwner(${p.product_owner.id})">صاحب محصول</button>
            `;
            // این دکمه هنوز پیاده نشده
            container.appendChild(card); 
        }
        );

        
    }catch{
        alert('خطا در دریافت محصولات');
    }
}

async function fetchCategories(query = '') {
    try{
    let url = `${API}/category/`;
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
        alert('error, get categories request failed');
        return;
    };
    const cats = await res.json();
    return cats ;

    }catch{
    alert('خطا در دریافت دسته ها');
    return null;
    }
}

// ---------- add new category ----------
async function renderAddNewCategory() {
    
    content.innerHTML =`
    <button class="back-button2" onclick="renderCategories()">بازگشت</button>
   <h2 style="text-align:center; color:#333; margin-bottom:20px;">افزودن دسته جدید</h2>
    
    <div id="addCategory" style="
        display:flex; flex-direction:column; gap:15px; 
        max-width:600px; margin:auto; padding:20px; 
        border-radius:15px; box-shadow:0 4px 15px rgba(0,0,0,0.1);
        background:#f9f9f9;
    ">

    <label>نام </label>
    <input id="cat-name" style="padding:12px; border-radius:8px; border:1px solid #ccc; font-size:16px;">

    <label> دسته والد</label>

    </div>    
    `;

    const container = document.getElementById('addCategory');
    try{
        const res2 = await fetch(`${API}/category/`,{
        method:'GET',
        headers:{
            'Authorization':`Bearer ${token}` 
        }
        });
        
        if(res2.ok){
         categories = await res2.json();
        }
        
    }catch{
    alert('خطا در انجام عملیات');
    return;
   }

    const select = document.createElement("select")
    select.id = "select-parent-cat";
    select.style = "padding:12px; border-radius:8px; border:1px solid #ccc;font-size:16px;";


    categories.forEach(cat =>{
        const option = document.createElement('option');
        option.textContent = cat.name;
        option.value = cat.id; 

        select.append(option);
    });

    container.appendChild(select);
    
    const button = document.createElement('button');
    button.className = 'add-category-button';
    button.textContent = 'ثبت';
    button.addEventListener('click', () => submitAddCategory());

    container.appendChild(document.createElement('br'));

    container.appendChild(button);
}


async function submitAddCategory() {
    try{
    const name = document.getElementById('cat-name').value;
    const parent_id = document.getElementById('select-parent-cat').value;

    const res = await fetch(`${API}/category/`,{
        method:'POST',
        headers:{
            'Authorization':`Bearer ${token}`,
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            name:name,
            parent:parent_id
        })
    });

    if(!res.ok){
        alert("دسته اضافه نشد");
        return;
    }
    //renderCategories();
    renderAddNewCategory();
    
    }catch{
        alert('خطا در افزودن دسته');
    }
}
/*
async function renderCategorisByParent(parent) {
    try{ 
    const container = document.getElementById('content')
    container.innerHTML = ``;
    //container.className = "product-container";

    const url = `${API}/category/?`;

    const res = await fetch(url,{
        method:'GET',
        headers:{
            'Authorization':`Bearer ${token}`
        }
    });

    const cats = await res.json();

    cats.forEach(d =>{
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
        <h2>${d.name}</h2>
        <p style="color:rgba(150, 150, 150, 1); font-size:14px;"><strong>زیر دسته ها: </strong></p>`;
        const children = d.children;
        children.forEach(c => {
            card.innerHTML += `<p><strong>${c.name}</strong></p>`
        });
        card.onclick = () => renderCategoryProducts(d.id);
        container.appendChild(card);
        });

    }catch{
        alert('خطا در دریافت دسته ها');
    }  
}
*/

//---------- remove category ----------
async function renderRemoveCategory() {
    
    content.innerHTML =`
    <button class="back-button2" onclick="renderCategories()">بازگشت</button>
   <h2 style="text-align:center; color:#333; margin-bottom:20px;">حذف دسته</h2>
    
    <div id="removeCategory" style="
        display:flex; flex-direction:column; gap:15px; 
        max-width:600px; margin:auto; padding:20px; 
        border-radius:15px; box-shadow:0 4px 15px rgba(0,0,0,0.1);
        background:#f9f9f9;
    ">

    <label> انتخاب والد</label>

    </div>    
    `;

    const container = document.getElementById('removeCategory');
    /*
    try{
        const res2 = await fetch(`${API}/category/`,{
        method:'GET',
        headers:{
            'Authorization':`Bearer ${token}` 
        }
        });
        
        if(res2.ok){
         categories = await res2.json();
        }
        
    }catch{
    alert('خطا در انجام عملیات');
    return;
   } */

    const select = document.createElement("select")
    select.id = "select-cat-for-delete";
    select.style = "padding:12px; border-radius:8px; border:1px solid #ccc;font-size:16px;";

   /*
    categories.forEach(cat =>{
        if(cat.name !== 'همه'){
        const option = document.createElement('option');
        option.textContent = cat.name;
        option.value = cat.id; 

        select.append(option);
        }
    });
    */
   renderCategoryOptions(select.id);

    container.appendChild(select);
    
    const button = document.createElement('button');
    button.className = 'delete-category-button';
    button.textContent = 'حذف';
    button.addEventListener('click', async () => {
    try{
        const res = await fetch(`${API}/category/${select.value}/`,{
            method:'DELETE',
            headers:{
                'Authorization':`Bearer ${token}`,
                'Content-Type':'application/json'
            }
        });
        if(!res.ok){
            button.textContent = 'خطا در حذف دسته';
        }
        button.textContent='دسته حذف شد';
        button.style="background:#28a745;";
        sleep(1000);
        //button.style = "";
        //renderCategoryOptions(select.id);

        renderRemoveCategory();

    }catch{
        alert('خطا در انجام عملیات');
    }        
    });

    container.appendChild(document.createElement('br'));

    container.appendChild(button);    
}


async function renderCategoryOptions(select_id){
    
    try{
        const res2 = await fetch(`${API}/category/`,{
        method:'GET',
        headers:{
            'Authorization':`Bearer ${token}` 
        }
        });
        
        if(res2.ok){
         categories = await res2.json();
        }
        
    }catch{
    alert('خطا در انجام عملیات');
    return;
   }

    const select = document.getElementById(select_id);
    select.innerHTML='';
    categories.forEach(cat =>{
        if(cat.name !== 'همه'){
        const option = document.createElement('option');
        option.textContent = cat.name;
        option.value = cat.id; 

        select.append(option);
        }
    });   
}


async function submitRemoveCategory(id) {
    try{
        const res = await fetch(`${API}/category/${id}/`,{
            method:'DELETE',
            headers:{
                'Authorization':`Bearer ${token}`,
                'Content-Type':'application/json'
            }
        });
        if(!res.ok){
            alert
        }
    }catch{

    }
}