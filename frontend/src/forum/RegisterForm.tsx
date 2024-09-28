import React, { useState } from 'react';
import { useRegisterStore } from '../stores/RegisterStore';
import '../css/RegisterForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; 

const RegisterForm: React.FC = () => {
  const { register, sendVerificationCode, verifyCode, verificationCodeSent, isVerified } = useRegisterStore(); 

  const [formData, setFormData] = useState({
    UserName: '', 
    UserMail: '', 
    UserPassword: '',
    verificationCode: '' // Kullanıcı tarafından girilen doğrulama kodu
  });

  const [showPassword, setShowPassword] = useState(false); // Şifre gösterme/gizleme

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCodeSent) {
      console.log("E-posta doğrulama kodu gönderiliyor:", formData.UserMail);
      await sendVerificationCode(formData.UserMail);
    } else if (!isVerified) {
      console.log("Doğrulama kodu kontrol ediliyor:", formData.verificationCode);
      await verifyCode(formData.UserMail, formData.verificationCode);
    } else {
      console.log("Kayıt işlemi yapılıyor:", formData);
      await register(formData);
    }
  };
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); 
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* E-posta alanı: Doğrulama kodu gönderilmemişse göster */}
          {!verificationCodeSent && (
            <div className="input-icon-container">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              <input
                type="email"
                value={formData.UserMail}
                onChange={(e) => setFormData({ ...formData, UserMail: e.target.value })}
                className="input-field"
                placeholder="Email"
                required
              />
            </div>
          )}

          {/* Doğrulama kodu gönderildiyse ve henüz doğrulanmadıysa kod girişi yap */}
          {verificationCodeSent && !isVerified && (
            <div className="input-icon-container">
              <input
                type="text"
                value={formData.verificationCode}
                onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
                className="input-field"
                placeholder="Verification Code"
                required
              />
            </div>
          )}

          {/* Doğrulama kodu doğruysa kullanıcı adı ve şifre girişi yap */}
          {isVerified && (
            <>
              <div className="input-icon-container">
                <FontAwesomeIcon icon={faUser} className="input-icon" />
                <input
                  type="text"
                  value={formData.UserName}
                  onChange={(e) => setFormData({ ...formData, UserName: e.target.value })}
                  className="input-field"
                  placeholder="Username"
                  required
                />
              </div>

              <div className="input-icon-container">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.UserPassword}
                  onChange={(e) => setFormData({ ...formData, UserPassword: e.target.value })}
                  className="input-field"
                  placeholder="Password"
                  required
                />
                <span className="password-toggle" onClick={togglePasswordVisibility}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="toggle-icon" />
                </span>
              </div>
            </>
          )}

          <button
            type="submit"
            className="register-button"
          >
            {verificationCodeSent ? (isVerified ? "Register" : "Verify Code") : "Send Verification Code"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
