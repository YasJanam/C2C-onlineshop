//*************************************************************** 
// ======= User Order & OrderItems ========

async function renderUserOrders() {
    content.innerHTML = `<h2>خرید های قبلی</h2><div id="userOrderContainer" class="order-container"></div>`;
    const container = document.getElementById('userOrderContainer');

    try{
        const res = await fetch(`${API}/orders-user/`,{
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${token}`
          }
    });
        const data = await res.json();
        
        data.forEach(d =>{
            const card = document.createElement('div');
            card.className = 'product-detail-card';
            card.innerHTML = `
            <p><strong>تاریخ : </strong>${d.created_at}</p>
            <p><strong>قیمت کل: </strong>${d.total_price}</p>
            `;

            card.onclick = () => showOrderDetails(d.id);
            container.appendChild(card);
        });
    }catch{
        alert('error, Orders');
    } 
}


async function showOrderDetails(id) {
    content.innerHTML = `<h2>آیتم های خریداری شده</h2><div id="userOrderItemContainer" class="order-container"></div>`;
    const container = document.getElementById('userOrderItemContainer');

        const button = document.createElement('button');
        button.className = 'cart-button';
        button.textContent = 'بازگشت';
        button.onclick = () => renderUserOrders()
        container.appendChild(button);

    try{
        const res = await fetch(`${API}/orders-user/${id}`,{
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${token}`
          }
    });
        const data = await res.json();
        const items = await data.items

        items.forEach(d =>{
            const card = document.createElement('div');
            card.className = 'product-detail-card';
            //const date = new Date(d.created_at); 
            card.innerHTML = `
            <h2>${d.product_name}</h2>
            <p><strong>صاحب محصول : </strong>${d.product.product_owner.first_name} ${d.product.product_owner.last_name}</p>
            <p><strong> تعداد : </strong>${d.quantity}</p>
            <p><strong> قیمت یک عدد : </strong>${d.price}</p>
            
            <p><strong>قیمت کل: </strong>${d.total_price}</p>
            <p><strong> توصیف : </strong>${d.product.description}</p>    
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