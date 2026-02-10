

const API = 'http://127.0.0.1:8000';
const content = document.getElementById('content');

const token = localStorage.getItem('access_token');
const user_role = localStorage.getItem('role');
const user = JSON.parse(localStorage.getItem('user') || '{}');
const userId = user.id || null;



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}