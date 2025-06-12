import React, { useState } from 'react';
import sendRequest from '../services/serverApi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const navigate = useNavigate();
    const {login} = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        paypal_email: '',
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        const cleanedData = {
            ...formData,
            paypal_email: formData.paypal_email.trim() === '' ? null : formData.paypal_email
        };
        try {
            const response = await sendRequest('users/register', 'POST', cleanedData);
            setMessage(response.message || 'Registration successful!');
            if (response.user) {
                login(response.token, response.user);
                navigate('/dashboard');
            }
        }
        catch (error) {
            setMessage(error.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <input name="paypal_email" type="email" placeholder="PayPal Email" value={formData.paypal_email} onChange={handleChange} />
            <button type="submit">Register</button>
            {message && <p>{message}</p>}
        </form>
    );
}