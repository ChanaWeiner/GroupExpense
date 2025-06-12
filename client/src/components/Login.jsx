import React, { useState } from 'react';
import sendRequest from '../services/serverApi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
  const { login } = useAuth();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await sendRequest('users/login', 'POST', formData);
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
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <button type="submit">Login</button>
            {message && <p>{message}</p>}
        </form>
    );
}
