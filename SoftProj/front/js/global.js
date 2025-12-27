const API = 'http://127.0.0.1:8000';
const content = document.getElementById('content');

const token = localStorage.getItem('access_token');
const user = JSON.parse(localStorage.getItem('user') || '{}');
const studentId = user.id || null;
