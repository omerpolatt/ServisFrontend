import React, { useState } from 'react';
import { useRegisterStore } from '../stores/RegisterStore';
import '../css/RegisterForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; 
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const RegisterForm: React.FC = () => {
  const { register, sendVerificationCode, verifyCode, verificationCodeSent, isVerified } = useRegisterStore();

  const [formData, setFormData] = useState({
    UserName: '', 
    UserMail: '', 
    UserPassword: '',
    verificationCode: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!verificationCodeSent) {
        console.log("E-posta doğrulama kodu gönderiliyor:", formData.UserMail);
        await sendVerificationCode(formData.UserMail);
        toast.info('Doğrulama kodu gönderildi. Lütfen e-postanızı kontrol edin.', {
          position: "top-right",
          autoClose: 3000,
        });
      } else if (!isVerified) {
        console.log("Doğrulama kodu kontrol ediliyor:", formData.verificationCode);
        await verifyCode(formData.UserMail, formData.verificationCode);
        toast.success('Doğrulama başarılı! Şimdi kaydınızı tamamlayabilirsiniz.', {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        console.log("Kayıt işlemi yapılıyor:", formData);
        await register(formData);
        toast.success('Kayıt başarılı! Hoşgeldiniz.', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); 
  };

  return (
    <div className="register-page">
      <ToastContainer />
      <div className="register-container">
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
