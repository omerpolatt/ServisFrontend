import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleGalleryClick = () => {
    navigate('/galeri'); // Redirect to the gallery page
  };

  return (
    <div>
      <h1>Burası Ana Sayfadır</h1>
      <p>
        Bu sayfa, uygulamanızın ana sayfasıdır. Burada ziyaretçilere genel bilgiler sunabilirsiniz.
      </p>
      <button onClick={handleGalleryClick}>Go to Gallery Page</button> {/* New button to redirect to Gallery */}
    </div>
  );
};

export default HomePage;
