// src/App.js
import { Routes, Route } from 'react-router-dom';
import LoginPage from './global_components/login';
//import HomePage from './components/HomePage';
import Sidebar from './userpanel_components/Sidebar';
import UserProducts from './userpanel_components/UserProducts';
import AdminSidebar from './adminpanel/sidbar_admin';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/userpanel" element={<Sidebar />} />
        <Route path="/adminpanel" element={<AdminSidebar/>}/>
     
      </Routes>
    </div>
  );
}

export default App;
