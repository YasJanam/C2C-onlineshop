

//==============================================
// ------- user cart ---------------------------

async function renderUserCart() {
    content.innerHTML = `<h2> سبد خرید</h2>
    <div id="userCartContainer" class="cart-container">
    </div>`;
    const container = document.getElementById('userCartContainer');
  
    try{
        const res = await fetch(`${API}/cartitems-user/`,{
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${token}`
          }
        });
           
        const cartitems = await res.json();
        
        if(cartitems.length !== 0){

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

        var price_all = 0
        //var quantity_all = 0

        cartitems.forEach(c => {
            const tr = document.createElement('tr');
            tr.className = 'cart-row';
            tr.innerHTML=`
            <td>${c.product.name}</td>
            <td>${c.product.price}</td>
            <td>${c.quantity}</td>
            <td>${c.product.price * c.quantity}</td>
            <td><button class="delete-cartItem-button" onclick="renderDeleteCartItem(${c.id})">حذف</button> </td>
            <td><button class="cart-button" onclick="renderAddOneQuantity(${c.id},${c.quantity})"> +1 </button></td>
            <td><button class="cart-button" onclick="renderReduceOneQuantity(${c.id},${c.quantity})"> -1</button></td>
            `;

            price_all += (c.product.price * c.quantity);
            //quantity_all += c.quantity;

            tbody.appendChild(tr);
        });
        
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>جمع کل</td>
            <td>${price_all}</td>
            <td><button class="cart-button2" onclick="">خرید</button></td>
            `;

            tfoot.appendChild(tr)

        container.appendChild(table); }
        
    }catch{
        alert('error, cartitem list');
    } 
}




// -----------dalate -----------
async function renderDeleteCartItem(id) {
    try{
        const res = await fetch(`${API}/cartitems-user/${id}/`,{
            method:'DELETE',
            headers:{
                'Authorization':`Bearer ${token}`
            }
        });

        if(!res.ok) throw new Error("خطا در حذف محصول");

        //alert("محصول از سبد خرید شما حذف شد");

        renderUserCart();
    }catch{
        alert("خطا در انجام عملیات");
    }
}


// -----------  quantity  +1 -1  ---------------
async function renderAddOneQuantity(id,quantity) {
    
    const payload = {
        quantity:quantity +1
    };
    try{
        const res = await fetch(`${API}/cartitems-user/${id}/`,{
            method:'PATCH',
            headers:{
                'Authorization':`Bearer ${token}`,
                'Content-Type':'application/json'
            },
            body: JSON.stringify(payload),
        });

        if(!res.ok) {
            alert("تعداد محصول انتخابی بیش از موجودی است");
            return;
        };
        renderUserCart();
        //showCartItemDetails(id);
    }catch{
        alert('خطا');

    }
}

async function renderReduceOneQuantity(id,quantity) {
    const payload = {
        quantity:quantity-1
    };
    try{
        const res = await fetch(`${API}/cartitems-user/${id}/`,{
            method:'PATCH',
            headers:{
                'Authorization':`Bearer ${token}`,
                'Content-Type':'application/json'
            },
            body: JSON.stringify(payload),           
        });

        if(!res.ok) {
            alert("بیش از نمیتوان تعداد را کاهش داد");
            return;
        };
        renderUserCart();
        
        //showCartItemDetails(id);
        
    }catch{
        alert('خطا');
    }
}