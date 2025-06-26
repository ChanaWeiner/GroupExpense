import React, { useState } from 'react';
import sendRequest from '../services/serverApi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

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
        const trimmedValue = value.trim();

        if (name === 'email') {
            if (!trimmedValue) error = 'חובה למלא דוא"ל.';
            else if (!/\S+@\S+\.\S+/.test(trimmedValue)) error = 'פורמט דוא"ל לא תקין.';
        } else if (name === 'password') {
            if (!trimmedValue) error = 'חובה למלא סיסמה.';
            else if (trimmedValue.length < 6) error = 'הסיסמה חייבת להיות באורך של לפחות 6 תווים.';
        }
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const validateForm = () => {
        const newErrors = {};
        const trimmedEmail = formData.email.trim();
        const trimmedPassword = formData.password.trim();

        if (!trimmedEmail) newErrors.email = 'חובה למלא דוא"ל.';
        else if (!/\S+@\S+\.\S+/.test(trimmedEmail)) newErrors.email = 'פורמט דוא"ל לא תקין.';

        if (!trimmedPassword) newErrors.password = 'חובה למלא סיסמה.';
        else if (trimmedPassword.length < 6) newErrors.password = 'הסיסמה חייבת להיות באורך של לפחות 6 תווים.';

        setErrors(newErrors);

        if (Object.keys(newErrors).length !== 0) {
            throw new Error('האימות נכשל');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            validateForm();
            const cleanedData = {
                email: formData.email.trim(),
                password: formData.password.trim(),
            };
            const response = await sendRequest('users/login', 'POST', cleanedData);
            setMessage(response.message || 'התחברות הצליחה!');
            if (response.user) {
                login(response.token, response.user);
                navigate('/group-expense');
            }
        }
        catch (error) {
            setMessage(error.message || 'התחברות נכשלה. אנא נסה שוב.');
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate dir="rtl">
            <h2>התחברות</h2>

            <input
                name="email"
                type="email"
                placeholder="דואר אלקטרוני"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <p className="error">{errors.email || '\u00A0'}</p>

            <input
                name="password"
                type="password"
                placeholder="סיסמה"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <p className="error">{errors.password || '\u00A0'}</p>

            <button type="submit">התחבר</button>

            {message && <p>{message}</p>}
            <Link to="/register" className='link'>אין לך חשבון? הירשם כאן</Link>
        </form>
    );
}
