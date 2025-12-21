const API = 'http://127.0.0.1:8000';
const content = document.getElementById('content');

document.querySelectorAll('.menu-item').forEach(item => {
  const targetId = item.getAttribute('data-target');
  if (!targetId) return;

  item.addEventListener('click', () => {
    const menu = document.getElementById(targetId);
    if (!menu) return;

    document.querySelectorAll('.submenu').forEach(sm => {
      if (sm !== menu) sm.style.display = 'none';
    });

    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
  });
});

// ---------------- coursesList ------------------
async function renderOferedCourseList() {
  content.innerHTML = `
    <h2>لیست دروس ارائه شده</h2>
    <input type="text" id="searchInput" placeholder="جستجو بر اساس نام درس، کد یا استاد..." style="width: 100%; padding: 10px; margin-bottom: 20px; border-radius: 8px; border: 1px solid #ccc;">
    <div class="offered-container"></div>
  `;

  const container = document.querySelector('.offered-container');
  const searchInput = document.getElementById('searchInput');

  async function render(query='') {
    container.innerHTML = '';
    try {
      const data = await fetchOfferedCourses(query);

      data.forEach(c => {
        const courseName = c.course?.name || 'نامشخص';
        const courseCode = c.course?.code || '---';
        const group = c.group_code || '---';
        const prof = c.prof_name || 'نامشخص';
        const capacity = c.capacity || '---';
        const semester = c.semester || '---';
        const sessions = c.sessions?.length
          ? c.sessions.map(s => `${s.day_of_week} (${s.time_slot})`).join(', ')
          : 'ندارد';

        const card = document.createElement('div');
        card.className = 'offered-card';
        card.innerHTML = `
          <h3>${courseName} (${courseCode})</h3>
          <p><strong>گروه:</strong> ${group}</p>
          <p><strong>استاد:</strong> ${prof}</p>
          <p><strong>ظرفیت:</strong> ${capacity}</p>
          <p><strong>ترم:</strong> ${semester}</p>
          <p><strong>جلسات:</strong> ${sessions}</p>
        `;

        card.addEventListener('click', () => showCourseOfferingDetails(c));
        container.appendChild(card);
      });
    } catch(err) {
      console.error(err);
      alert('خطا در دریافت داده‌ها');
    }
  }

  // رندر اولیه بدون فیلتر
  render();

  let typingTimer;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      const query = e.target.value.trim(); // حذف فاصله‌های اضافی
      if (query === '') {
        container.innerHTML = ''; // پاک کردن نتایج
        return;
      }
      render(query); // ارسال query فقط اگر غیرخالی باشد
    }, 300);
  });
}

async function fetchOfferedCourses(query='') {
  let url = `${API}/courseofferings/`;
  if(query) {
   const params = new URLSearchParams();
   params.append('search', query);
   url += `?${params.toString()}`;

  }
  

  const res = await fetch(url);
  if (!res.ok) throw new Error('خطا در دریافت داده‌ها');
  return await res.json();
}



// نمایش جزئیات کامل درس ارائه شده + پیشنیازها
function showCourseOfferingDetails(offering) {
  const course = offering.course;

  content.innerHTML = `
    <div class="offered-detail-card">
      <h2>جزئیات درس ارائه شده</h2>

      <p><strong>نام درس:</strong> ${course.name}</p>
      <p><strong>کد درس:</strong> ${course.code}</p>
      <p><strong>واحد:</strong> ${course.unit}</p>
      <p><strong>گروه:</strong> ${offering.group_code}</p>
      <p><strong>ترم:</strong> ${offering.semester}</p>
      <p><strong>استاد:</strong> ${offering.prof_name || 'نامشخص'}</p>
      <p><strong>ظرفیت:</strong> ${offering.capacity}</p>

      <h4>جلسات</h4>
      <ul>
        ${offering.sessions.length
          ? offering.sessions.map(s => `<li>${s.day_of_week || 'روز نامشخص'} (${s.time_slot || 'زمان نامشخص'}) - ${s.location || 'مکان نامشخص'}</li>`).join('')
          : '<li>ندارد</li>'}
      </ul>

      <h4>پیش‌نیازها</h4>
      <ul>
        ${course.prerequisites.length
          ? course.prerequisites.map(p => `<li>${p.name} (${p.code})</li>`).join('')
          : '<li>ندارد</li>'}
      </ul>

      <button onclick="renderOferedCourseList()">بازگشت</button>
    </div>
  `;
}



/* ----------------create---------------- */
/*
function renderOfereCourse() {
  content.innerHTML = `
    <h2>ارائه درس</h2>
    <div class="offered-form">
      <input id="courseId" placeholder="آیدی درس">
      <input id="groupCode" placeholder="کد گروه">
      <input id="profName" placeholder="نام استاد">
      <input id="capacity" placeholder="ظرفیت" type="number">
      <input id="semester" placeholder="ترم" type="number">
      <button onclick="submitAddOfferedCourse()">ثبت</button>
    </div>
  `;
}

async function submitAddOfferedCourse() {
  try {
    const payload = {
      course: document.getElementById('courseId').value,
      group_code: document.getElementById('groupCode').value,
      prof_name: document.getElementById('profName').value,
      capacity: Number(document.getElementById('capacity').value),
      semester: Number(document.getElementById('semester').value)
    };

    const res = await fetch(`${API}/courseofferings/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json();
      console.error(err);
      alert('خطا در افزودن درس ارائه شده: ' + (err.detail || 'مشکل نامشخص'));
      return;
    }

    alert('درس ارائه شده با موفقیت اضافه شد');
    renderOferedCourseList();
  } catch (error) {
    console.error(error);
    alert('خطا در ارتباط با سرور');
  }
}
*/

async function renderOfferCourse() {
  content.innerHTML = `
    <h2 style="text-align:center; color:#333; margin-bottom:20px;">ارائه درس</h2>
    <div class="offered-form" style="
        display:flex; flex-direction:column; gap:15px; 
        max-width:600px; margin:auto; padding:20px; 
        border-radius:15px; box-shadow:0 4px 15px rgba(0,0,0,0.1);
        background:#f9f9f9;
    ">
      <select id="courseSelect" style="
        padding:12px; border-radius:8px; border:1px solid #ccc;
        font-size:16px;
      ">
        <option value="">انتخاب درس</option>
      </select>

      <input id="groupCode" placeholder="کد گروه" style="padding:12px; border-radius:8px; border:1px solid #ccc; font-size:16px;" />
      <input id="profName" placeholder="نام استاد" style="padding:12px; border-radius:8px; border:1px solid #ccc; font-size:16px;" />
      <input id="capacity" placeholder="ظرفیت" type="number" style="padding:12px; border-radius:8px; border:1px solid #ccc; font-size:16px;" />
      <input id="semester" placeholder="ترم" type="number" style="padding:12px; border-radius:8px; border:1px solid #ccc; font-size:16px;" />

      <div id="sessionsContainer">
        <h4 style="margin-top:0; color:#555;">جلسات</h4>
      </div>

      <button type="button" id="addSessionBtn" style="
        padding:12px; background:#007bff; color:white; border:none; border-radius:8px;
        cursor:pointer; font-size:16px;
      ">افزودن جلسه</button>

      <button type="button" id="submitOfferedCourseBtn" style="
        padding:12px; background:#28a745; color:white; border:none; border-radius:8px;
        cursor:pointer; font-size:16px;
      ">ثبت</button>
    </div>
  `;

  const courseSelect = document.getElementById('courseSelect');
  const sessionsContainer = document.getElementById('sessionsContainer');

  // --- دریافت لیست درس‌ها ---
  try {
    const res = await fetch(`${API}/courses/`);
    if (!res.ok) throw new Error("خطا در دریافت درس‌ها");
    const courses = await res.json();
    courses.forEach(c => {
      const option = document.createElement('option');
      option.value = c.code;
      option.textContent = `${c.code} - ${c.name}`;
      courseSelect.appendChild(option);
    });
  } catch (error) {
    console.error(error);
    alert('خطا در دریافت لیست درس‌ها');
  }

  // --- ایجاد row جلسه ---
  function createSessionRow() {
    const row = document.createElement('div');
    row.className = 'session-row';
    row.style.display = 'flex';
    row.style.gap = '10px';
    row.style.marginBottom = '10px';
    row.style.alignItems = 'center';
    row.style.background = '#fff';
    row.style.padding = '10px';
    row.style.borderRadius = '8px';
    row.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';

    row.innerHTML = `
      <select class="dayOfWeek" style="padding:8px; border-radius:6px; border:1px solid #ccc; flex:1;">
        <option value="">روز هفته</option>
        <option value="Saturday">شنبه</option>
        <option value="Sunday">یکشنبه</option>
        <option value="Monday">دوشنبه</option>
        <option value="Tuesday">سه‌شنبه</option>
        <option value="Wednesday">چهارشنبه</option>
      </select>
      <select class="timeSlot" style="padding:8px; border-radius:6px; border:1px solid #ccc; flex:1;">
        <option value="">ساعت</option>
        <option value="8-10">8:00 - 10:00</option>
        <option value="10-12">10:00 - 12:00</option>
        <option value="14-16">14:00 - 16:00</option>
        <option value="16-18">16:00 - 18:00</option>
      </select>
      <input class="location" placeholder="محل" style="padding:8px; border-radius:6px; border:1px solid #ccc; flex:1;" />
      <button type="button" class="removeSessionBtn" style="
        padding:8px 12px; background:#dc3545; color:white; border:none; border-radius:6px;
        cursor:pointer;
      ">حذف</button>
    `;

    const removeBtn = row.querySelector('.removeSessionBtn');
    removeBtn.addEventListener('click', () => row.remove());

    sessionsContainer.appendChild(row);
  }

  // اضافه کردن جلسه اولیه
  createSessionRow();

  document.getElementById('addSessionBtn').addEventListener('click', createSessionRow);
  document.getElementById('submitOfferedCourseBtn').addEventListener('click', submitAddOfferedCourse);
}

/* ----------------- ارسال فرم ----------------- */
async function submitAddOfferedCourse() {
  try {
    const courseCode = document.getElementById('courseSelect').value;
    if (!courseCode) {
      alert('لطفاً یک درس انتخاب کنید');
      return;
    }

    const sessionRows = document.querySelectorAll('.session-row');
    const sessions = Array.from(sessionRows)
      .map(row => {
        const day = row.querySelector('.dayOfWeek').value;
        const time = row.querySelector('.timeSlot').value;
        const location = row.querySelector('.location').value || "";
        if (day && time) return { day_of_week: day, time_slot: time, location };
        return null;
      })
      .filter(s => s !== null);

    const payload = {
      course_code: courseCode,
      group_code: document.getElementById('groupCode').value,
      prof_name: document.getElementById('profName').value,
      capacity: Number(document.getElementById('capacity').value),
      semester: Number(document.getElementById('semester').value),
      sessions: sessions
    };

    console.log("Payload:", payload);

    const res = await fetch(`${API}/courseofferings/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json();
      console.error(err);
      alert('خطا در افزودن درس ارائه شده: ' + (err.detail || JSON.stringify(err)));
      return;
    }

    alert('درس ارائه شده با موفقیت اضافه شد');
    renderOferedCourseList();
  } catch (error) {
    console.error(error);
    alert('خطا در ارتباط با سرور');
  }
}


/* ------------ update ---------------*/
async function renderUpdateOferedCourse() {
  content.innerHTML = `<h2>انتخاب درس ارائه شده برای آپدیت</h2>
    <div class="offered-container"></div>`;
  const container = document.querySelector('.offered-container');

  try {
    const res = await fetch(`${API}/courseofferings/`);
    if (!res.ok) throw new Error("خطا در دریافت لیست دروس ارائه شده");
    const data = await res.json();

    data.forEach(c => {
      const card = document.createElement('div');
      card.className = 'offered-card';
      card.innerHTML = `
        <h3>${c.course.name} (${c.course.code})</h3>
        <p><strong>گروه:</strong> ${c.group_code}</p>
        <button onclick="renderUpdateOfferedForm(${c.id})">آپدیت</button>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    alert('خطا در دریافت لیست دروس ارائه شده');
  }
}

function renderUpdateOfferedForm(id) {
  content.innerHTML = `
    <h2>آپدیت درس ارائه شده</h2>
    <div class="offered-form">
      <input id="groupCode" class="input-field" placeholder="کد گروه">
      <input id="profName" class="input-field" placeholder="نام استاد">
      <input id="capacity" class="input-field" placeholder="ظرفیت" type="number">
      <input id="semester" class="input-field" placeholder="ترم" type="number">

      <div id="sessionsContainer"><h4>جلسات</h4></div>
      <button type="button" id="addSessionBtn" class="btn-add">افزودن جلسه</button>
      <button type="button" id="submitUpdateOfferedBtn" class="btn-submit">ثبت تغییرات</button>
    </div>
  `;

  const sessionsContainer = document.getElementById('sessionsContainer');

  // --- اضافه کردن جلسه اولیه یا بارگذاری سشن‌ها ---
  async function loadExistingSessions() {
    try {
      const res = await fetch(`${API}/courseofferings/${id}/`);
      if (!res.ok) throw new Error("خطا در دریافت اطلاعات درس ارائه شده");
      const data = await res.json();

      // مقداردهی اولیه inputها
      document.getElementById('groupCode').value = data.group_code || '';
      document.getElementById('profName').value = data.prof_name || '';
      document.getElementById('capacity').value = data.capacity || '';
      document.getElementById('semester').value = data.semester || '';

      // بارگذاری جلسات
      if (data.sessions && data.sessions.length > 0) {
        data.sessions.forEach(s => createSessionRow(s));
      } else {
        createSessionRow();
      }
    } catch (error) {
      console.error(error);
      alert("خطا در بارگذاری اطلاعات سشن‌ها");
      createSessionRow();
    }
  }

  function createSessionRow(session = {}) {
    const row = document.createElement('div');
    row.className = 'session-row';
    row.style.display = 'flex';
    row.style.gap = '5px';
    row.style.marginBottom = '5px';
    row.innerHTML = `
      <select class="dayOfWeek input-field">
        <option value="">روز هفته</option>
        <option value="Saturday" ${session.day_of_week==='Saturday'?'selected':''}>شنبه</option>
        <option value="Sunday" ${session.day_of_week==='Sunday'?'selected':''}>یکشنبه</option>
        <option value="Monday" ${session.day_of_week==='Monday'?'selected':''}>دوشنبه</option>
        <option value="Tuesday" ${session.day_of_week==='Tuesday'?'selected':''}>سه‌شنبه</option>
        <option value="Wednesday" ${session.day_of_week==='Wednesday'?'selected':''}>چهارشنبه</option>
      </select>
      <select class="timeSlot input-field">
        <option value="">ساعت</option>
        <option value="8-10" ${session.time_slot==='8-10'?'selected':''}>8:00 - 10:00</option>
        <option value="10-12" ${session.time_slot==='10-12'?'selected':''}>10:00 - 12:00</option>
        <option value="14-16" ${session.time_slot==='14-16'?'selected':''}>14:00 - 16:00</option>
        <option value="16-18" ${session.time_slot==='16-18'?'selected':''}>16:00 - 18:00</option>
      </select>
      <input class="location input-field" placeholder="محل" value="${session.location || ''}" />
      <button type="button" class="removeSessionBtn btn-add">حذف</button>
    `;
    row.querySelector('.removeSessionBtn').addEventListener('click', () => row.remove());
    sessionsContainer.appendChild(row);
  }

  // اضافه کردن جلسه جدید
  document.getElementById('addSessionBtn').addEventListener('click', () => createSessionRow());

  // بارگذاری اطلاعات فعلی و سشن‌ها
  loadExistingSessions();

  // ثبت تغییرات
  document.getElementById('submitUpdateOfferedBtn').addEventListener('click', async () => {
    try {
      const sessionRows = document.querySelectorAll('.session-row');
      const sessions = Array.from(sessionRows).map(row => {
        const day = row.querySelector('.dayOfWeek').value;
        const time = row.querySelector('.timeSlot').value;
        const location = row.querySelector('.location').value || "";
        if(day && time) return { day_of_week: day, time_slot: time, location };
        return null;
      }).filter(s => s !== null);

      const payload = {
        group_code: document.getElementById('groupCode').value,
        prof_name: document.getElementById('profName').value,
        capacity: Number(document.getElementById('capacity').value),
        semester: Number(document.getElementById('semester').value),
        sessions: sessions
      };

      console.log("Update Payload:", payload);

      const res = await fetch(`${API}/courseofferings/${id}/`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });

      if(!res.ok){
        const err = await res.json();
        console.error(err);
        alert('خطا در آپدیت درس ارائه شده: ' + (err.detail || 'مشکل نامشخص'));
        return;
      }

      alert('درس ارائه شده با موفقیت آپدیت شد');
      renderOferedCourseList();
    } catch(err){
      console.error(err);
      alert('خطا در ارتباط با سرور');
    }
  });
}

/*
async function renderUpdateOferedCourse() {
  content.innerHTML = `<h2>انتخاب درس ارائه شده برای آپدیت</h2><div class="offered-container"></div>`;
  const container = document.querySelector('.offered-container');

  try {
    const res = await fetch(`${API}/courseofferings/`);
    const data = await res.json();

    data.forEach(c => {
      const card = document.createElement('div');
      card.className = 'offered-card';
      card.innerHTML = `
        <h3>${c.course.name} (${c.course.code})</h3>
        <p><strong>گروه:</strong> ${c.group_code}</p>
        <button onclick="renderUpdateOfferedForm(${c.id})">آپدیت</button>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    alert('خطا در دریافت لیست دروس ارائه شده');
  }
}

function renderUpdateOfferedForm(id) {
  content.innerHTML = `
    <h2>آپدیت درس ارائه شده</h2>
    <div class="offered-form">
      <input id="groupCode" placeholder="کد گروه">
      <input id="profName" placeholder="نام استاد">
      <input id="capacity" placeholder="ظرفیت" type="number">
      <input id="semester" placeholder="ترم" type="number">
      <button onclick="submitUpdateOfferedCourse(${id})">ثبت تغییرات</button>
    </div>
  `;
}

async function submitUpdateOfferedCourse(id) {
  try {
    const payload = {
      group_code: document.getElementById('groupCode').value,
      prof_name: document.getElementById('profName').value,
      capacity: Number(document.getElementById('capacity').value),
      semester: Number(document.getElementById('semester').value)
    };

    const res = await fetch(`${API}/course-offerings/${id}/`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json();
      console.error(err);
      alert('خطا در آپدیت درس ارائه شده: ' + (err.detail || 'مشکل نامشخص'));
      return;
    }

    alert('درس ارائه شده با موفقیت آپدیت شد');
    renderOferedCourseList();
  } catch (error) {
    console.error(error);
    alert('خطا در ارتباط با سرور');
  }
}
*/

/* --------------- delete ---------------*/
async function renderDeleteOferedCourse() {
  content.innerHTML = `<h2>حذف درس ارائه شده</h2><div class="offered-container"></div>`;
  const container = document.querySelector('.offered-container');

  try {
    const res = await fetch(`${API}/courseofferings/`);
    if (!res.ok) throw new Error('خطا در دریافت لیست دروس ارائه شده');
    const data = await res.json();

    data.forEach(c => {
      // ساخت یک div برای هر درس ارائه شده
      const card = document.createElement('div');
      card.className = 'delete-card'; // کلاس برای CSS
      card.innerHTML = `
        <span class="course-info">${c.course.name} (${c.course.code}) - گروه: ${c.group_code}</span>
        <button class="delete-btn">حذف</button>
      `;
      const btn = card.querySelector('.delete-btn');
      btn.addEventListener('click', () => deleteOfferedCourse(c.id));
      container.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    alert('خطا در دریافت لیست دروس ارائه شده');
  }
}

async function deleteOfferedCourse(id) {
  if (!confirm('مطمئن هستید؟')) return;

  try {
    const res = await fetch(`${API}/courseofferings/${id}/`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json();
      console.error(err);
      alert('خطا در حذف درس ارائه شده');
      return;
    }
    alert('درس ارائه شده حذف شد');
    renderDeleteOferedCourse();
  } catch (error) {
    console.error(error);
    alert('خطا در ارتباط با سرور');
  }
}

/*
async function renderDeleteOferedCourse() {
  content.innerHTML = `<h2>حذف درس ارائه شده</h2><div class="offered-container"></div>`;
  const container = document.querySelector('.offered-container');

  try {
    const res = await fetch(`${API}/courseofferings/`);
    const data = await res.json();

    data.forEach(c => {
      const btn = document.createElement('button');
      btn.textContent = `حذف ${c.course.name} (${c.course.code})`;
      btn.className = 'delete-btn';
      btn.onclick = () => deleteOfferedCourse(c.id);
      container.appendChild(btn);
    });
  } catch (error) {
    console.error(error);
    alert('خطا در دریافت لیست دروس ارائه شده');
  }
}

async function deleteOfferedCourse(id) {
  if (!confirm('مطمئن هستید؟')) return;

  try {
    const res = await fetch(`${API}/course-offerings/${id}/`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json();
      console.error(err);
      alert('خطا در حذف درس ارائه شده');
      return;
    }
    alert('درس ارائه شده حذف شد');
    renderDeleteOferedCourse();
  } catch (error) {
    console.error(error);
    alert('خطا در ارتباط با سرور');
  }
}
*/