import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/Project';
import FlipLoginRegister from './components/FlipLoginRegister';  // Giriş ve kayıt bileşeni
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccessControl from './components/AccessControl';
import BucketPage from './pages/Bucket';
import FileList from './pages/File';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <ToastContainer />
        <Routes>
          {/* Giriş ve kayıt sayfası */}
          <Route path="/login-register" element={<FlipLoginRegister />} />

          {/* Anasayfa, erişim kontrolü ile korumalı */}
          <Route
            path="/project" element={<AccessControl element={<HomePage />} />}
          />

          {/* Alt bucket sayfası */}  
          <Route
            path="/project/:parentProjectId"
            element={<AccessControl element={<BucketPage />} />}
          />

          <Route path="/bucket/:bucketId" element={<FileList />} />

          {/* Giriş yapılmamışsa ana sayfaya gitmeye çalışanlar giriş ekranına yönlendirilir */}
          <Route path="*" element={<Navigate to="/login-register" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
