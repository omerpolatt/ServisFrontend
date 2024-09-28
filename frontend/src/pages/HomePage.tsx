import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/task-create'); // Butona tıklandığında görev ekleme formuna yönlendirme yapıyoruz
  };

  return (
    <div>
      <h1>Burası Ana Sayfadır</h1>
      <p>
        Bu sayfa, uygulamanızın ana sayfasıdır. Burada ziyaretçilere genel bilgiler sunabilirsiniz.
      </p>
      <button onClick={handleButtonClick}>Görev Ekleme Sayfasına Git</button> {/* Yönlendirme butonu */}
    </div>
  );
};

export default HomePage;
