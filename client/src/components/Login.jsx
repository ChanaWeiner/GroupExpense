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
            if (!trimmedValue) error = 'Email is required.';
            else if (!/\S+@\S+\.\S+/.test(trimmedValue)) error = 'Invalid email format.';
        } else if (name === 'password') {
            if (!trimmedValue) error = 'Password is required.';
            else if (trimmedValue.length < 6) error = 'Password must be at least 6 characters long.';
        }
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const validateForm = () => {
        const newErrors = {};
        const trimmedEmail = formData.email.trim();
        const trimmedPassword = formData.password.trim();

        if (!trimmedEmail) newErrors.email = 'Email is required.';
        else if (!/\S+@\S+\.\S+/.test(trimmedEmail)) newErrors.email = 'Invalid email format.';

        if (!trimmedPassword) newErrors.password = 'Password is required.';
        else if (trimmedPassword.length < 6) newErrors.password = 'Password must be at least 6 characters long.';

        setErrors(newErrors);

        if (Object.keys(newErrors).length !== 0) {
            throw new Error('Form validation failed');
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
            setMessage(response.message || 'Login successful!');
            if (response.user) {
                login(response.token, response.user);
                navigate('/dashboard');
            }
        }
        catch (error) {
            setMessage(error.message || 'Login failed. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <h2>Login</h2>

            <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <p className="error">{errors.email || '\u00A0'}</p>

            <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <p className="error">{errors.password || '\u00A0'}</p>

            <button type="submit">Login</button>

            {message && <p>{message}</p>}
            <Link to="/register" className='link'>Don't have an account? Register here</Link>
        </form>
    );
}
