import React, { useState } from 'react';
import { useLoginStore } from '../stores/LoginStore'; // Zustand store import ediyoruz
import { useNavigate } from 'react-router-dom'; // Yönlendirme için
import { toast } from 'react-toastify'; // Toastify ile bildirimler
import 'react-toastify/dist/ReactToastify.css'; // Toastify CSS
import '../css/LoginForm.css'; // CSS dosyasını import ediyoruz
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Göz simgeleri

const LoginForm: React.FC = () => {
  const { login } = useLoginStore(); // Zustand store'dan login fonksiyonunu çekiyoruz
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Yönlendirme için

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Login işlemi yapılıyor
      await login(email, password);
      toast.success('Login successful! Redirecting to homepage...');
      navigate('/project'); // Başarılı girişten sonra yönlendirme
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <h2>Welcome Back!</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="input-container">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-container password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="password-toggle" onClick={togglePasswordVisibility}>
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
        </div>

        <button type="submit" className="login-button">
          SIGN IN
        </button>

        <p className="separator">— Or Sign In With —</p>

        <div className="social-buttons">
          <button className="circle-button facebook-button">
            <FontAwesomeIcon icon={faFacebookF} />
          </button>
          <button className="circle-button twitter-button">
            <FontAwesomeIcon icon={faTwitter} />
          </button>
          <button className="circle-button google-button">
            <FontAwesomeIcon icon={faGoogle} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;