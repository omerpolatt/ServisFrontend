import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FlipLoginRegister from './components/FlipLoginRegister';  // Giriş ve kayıt bileşeni
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccessControl from './components/AccessControl';  // Erişim kontrol bileşeni

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <ToastContainer />
        <Routes>
          {/* Giriş ve kayıt sayfası */}
          <Route path="/" element={<FlipLoginRegister />} /> 

          {/* Anasayfa, erişim kontrolü ile korumalı */}
          <Route 
            path="/anasayfa" 
            element={<AccessControl element={<HomePage />} />} 
          />

          {/* Giriş yapılmamışsa ana sayfaya gitmeye çalışanlar giriş ekranına yönlendirilir */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
