import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface AccessControlProps {
  element: JSX.Element;
}

const AccessControl: React.FC<AccessControlProps> = ({ element }) => {
  const token = Cookies.get('token'); // JWT token'ı cookie'den alıyoruz

  // Eğer token yoksa giriş sayfasına yönlendir
  if (!token) {
    return <Navigate to="/login-register" replace />;
  }

  // Token varsa, istenen sayfayı göster
  return element;
};

export default AccessControl;
