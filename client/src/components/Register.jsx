import { useState } from 'react';
import sendRequest from '../services/serverApi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import '../styles/Register.css';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    paypal_email: '',
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value.trim()) error = 'יש להזין שם.';
        break;
      case 'email':
        if (!value.trim()) error = 'יש להזין דוא"ל.';
        else if (!/\S+@\S+\.\S+/.test(value)) error = 'פורמט דוא"ל לא תקין.';
        break;
      case 'password':
        if (!value) error = 'יש להזין סיסמה.';
        else if (value.length < 6) error = 'הסיסמה חייבת להיות לפחות 6 תווים.';
        break;
      case 'confirm_password':
        if (value !== formData.password) error = 'הסיסמאות אינן תואמות.';
        break;
      case 'paypal_email':
        if (value && !/\S+@\S+\.\S+/.test(value)) error = 'פורמט דוא"ל של PayPal לא תקין.';
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([name, value]) => {
      validateField(name, value);
    });

    const hasErrors = Object.values(errors).some(msg => msg);
    if (hasErrors) throw new Error('האימות נכשל');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      validateAll();

      const cleanedData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        paypal_email: formData.paypal_email.trim() === '' ? null : formData.paypal_email
      };

      const response = await sendRequest('users/register', 'POST', cleanedData);
      setMessage(response.message || 'ההרשמה הצליחה!');

      if (response.user) {
        login(response.token, response.user);
        navigate('/group-expense');
      }
    }
    catch (error) {
      setMessage(error.message || 'ההרשמה נכשלה. אנא נסה שוב.');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate dir="rtl" className="auth-form">
      <h2 className="auth-title">הרשמה</h2>

      <input
        name="name"
        placeholder="שם מלא"
        value={formData.name}
        onChange={handleChange}
        onBlur={handleBlur}
        className="auth-input"
      />
      <p className="auth-error">{errors.name || '\u00A0'}</p>

      <input
        name="email"
        type="email"
        placeholder='דוא"ל'
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        className="auth-input"
      />
      <p className="auth-error">{errors.email || '\u00A0'}</p>

      <input
        name="password"
        type="password"
        placeholder="סיסמה"
        value={formData.password}
        onChange={handleChange}
        onBlur={handleBlur}
        className="auth-input"
      />
      <p className="auth-error">{errors.password || '\u00A0'}</p>

      <input
        name="confirm_password"
        type="password"
        placeholder="אישור סיסמה"
        value={formData.confirm_password}
        onChange={handleChange}
        onBlur={handleBlur}
        className="auth-input"
      />
      <p className="auth-error">{errors.confirm_password || '\u00A0'}</p>

      <p className="auth-label">אופציונלי: דוא"ל PayPal</p>
      <input
        name="paypal_email"
        type="email"
        placeholder='דוא"ל PayPal'
        value={formData.paypal_email}
        onChange={handleChange}
        onBlur={handleBlur}
        className="auth-input"
      />
      <p className="auth-error">{errors.paypal_email || '\u00A0'}</p>

      <button type="submit" className="add-btn">הרשמה</button>

      {message && <p className="auth-message">{message}</p>}
      <Link to="/login" className='auth-link'>כבר יש לך חשבון? התחבר כאן</Link>
    </form>
  );
}
