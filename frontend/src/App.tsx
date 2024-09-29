import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FlipLoginRegister from './components/FlipLoginRegister';  // FlipLoginRegister'ı ekliyoruz
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccessControl from './components/AccessControl'; // AccessControl bileşeni
import GalleryPage from './pages/GalleryPage';


const App: React.FC = () => {
  return (
    <Router>
      <div>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<FlipLoginRegister />} /> {/* FlipLoginRegister kullanıyoruz */}
          <Route
            path="/anasayfa"
            element={<AccessControl element={<HomePage />} />} // HomePage için erişim kontrolü
          />
           <Route
            path="/galeri"
            element={<AccessControl element={<GalleryPage />} />} // Protecting Gallery page with AccessControl
          />
        </Routes>
        
      </div>
    </Router>
  );
};

export default App;
