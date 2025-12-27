
// ======================================
// گرفتن دروس استاد
// ======================================
async function fetchCourses() {
  try {
    const response = await fetch(`${API}/courseofferings/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("خطا در بارگذاری دروس");
    const data = await response.json();
    renderCourseList(data);
  } catch (error) {
    console.error(error);
    alert("بارگذاری دروس با مشکل مواجه شد.");
  }
}

// ======================================
// رندر لیست دروس
// ======================================
function renderCourseList(courses) {
  const container = document.getElementById("courseList");
  container.innerHTML = "";

  courses.forEach(course => {
    const courseDiv = document.createElement("div");
    courseDiv.className = "course-row";

    const sessions =
      Array.isArray(course.sessions) && course.sessions.length > 0
        ? course.sessions
            .map(s => {
              const day = s.day_of_week ?? "روز نامشخص";
              const time = s.time_slot ?? "ساعت نامشخص";
              const location = s.location ?? "مکان نامشخص";
              return `${day} ${time} (${location})`;
            })
            .join(" | ")
        : "—";

    courseDiv.innerHTML = `
      <div class="course-top">
        <div>
          <div class="course-title">
            ${course.course.name}
          </div>
          <div class="course-meta">
            کد درس: ${course.course.code} | گروه: ${course.group_code}
          </div>
        </div>

        <button class="course-btn" onclick="fetchStudents(${course.id})">
          👥 دانشجویان
        </button>
      </div>

      <div class="course-sessions">
        <strong>زمان‌بندی:</strong> ${sessions}
      </div>

      <div class="student-list" id="students-${course.id}" style="display:none;"></div>
    `;

    container.appendChild(courseDiv);
  });
}



// ======================================
// گرفتن دانشجویان یک درس
// ======================================
/*
async function fetchStudents(courseId) {
  const listDiv = document.getElementById(`students-${courseId}`);
  
  if (listDiv.style.display === "block") {
    listDiv.style.display = "none";
    return;
  }

  try {
    const response = await fetch(`${API}/student-course/${courseId}/students/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("خطا در بارگذاری دانشجویان");
    const students = await response.json();

    listDiv.innerHTML = "";
    students.forEach(student => {
      const studentDiv = document.createElement("div");
      studentDiv.classList.add("student-item");
      studentDiv.innerHTML = `
        <span>${student.full_name}</span>
        <button class="delete-btn" onclick="removeStudent(${courseId}, ${student.id})">حذف</button>
      `;
      listDiv.appendChild(studentDiv);
    });

    listDiv.style.display = "block";

  } catch (error) {
    console.error(error);
    alert("بارگذاری دانشجویان با مشکل مواجه شد.");
  }
}
*/
async function fetchStudents(courseId) {
  const listDiv = document.getElementById(`students-${courseId}`);

  if (listDiv.style.display === "block") {
    listDiv.style.display = "none";
    return;
  }

  try {
    const response = await fetch(`${API}/student-course/${courseId}/students/`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error();

    const students = await response.json();

    listDiv.innerHTML = `
      <div class="students-header">
        👨‍🎓 لیست دانشجویان (${students.length})
      </div>
    `;

    students.forEach(student => {
      listDiv.innerHTML += `
        <div class="student-row">
          <div class="student-name">
            ${student.full_name} 
          </div>
          <button class="remove-student-btn"
                  onclick="removeStudent(${courseId}, ${student.id})">
            حذف
          </button>
        </div>
      `;
    });

    listDiv.style.display = "block";

  } catch {
    alert("خطا در دریافت لیست دانشجویان");
  }
}

// ======================================
// حذف دانشجو از درس
// ======================================
async function removeStudent(courseId, studentId) {
  if (!confirm("آیا مطمئن هستید که می‌خواهید این دانشجو را حذف کنید؟")) return;

  try {
    const response = await fetch(`${API}/student-course/${courseId}/students/${studentId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("خطا در حذف دانشجو");

    // بروزرسانی لیست دانشجویان
    fetchStudents(courseId);

  } catch (error) {
    console.error(error);
    alert("حذف دانشجو با مشکل مواجه شد.");
  }
}

// ======================================
// بارگذاری اولیه
// ======================================
fetchCourses();
