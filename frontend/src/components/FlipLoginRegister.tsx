import { useState } from 'react';
import LoginForm from '../forum/LoginForm';
import RegisterForm from '../forum/RegisterForm';
import '../css/FlipLoginRegister.css';

const FlipLoginRegister = () => {
  const [isLoginActive, setIsLoginActive] = useState(true);

  const toggleForm = () => {
    setIsLoginActive(!isLoginActive);
  };

  return (
    <div className="flip-container">
      <div className={`card ${isLoginActive ? '' : 'flipped'}`}>
        <div className="front">
          <LoginForm />
          {/* Butonu formun hemen altına yerleştiriyoruz */}
          <div className="toggle-button-container">
            <button onClick={toggleForm} className="form-toggle-button">Register Here</button>
          </div>
        </div>
        <div className="back">
          <RegisterForm />
          {/* Aynı şeyi burada da uyguluyoruz */}
          <div className="toggle-button-container">
            <button onClick={toggleForm} className="form-toggle-button">Sign In Here</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipLoginRegister;
