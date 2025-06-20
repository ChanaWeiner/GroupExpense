import { useState } from 'react';
import sendRequest from '../services/serverApi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import '../styles/Register.css'; // Assuming you have a CSS file for styling
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
                if (!value.trim()) error = 'Name is required.';
                break;
            case 'email':
                if (!value.trim()) error = 'Email is required.';
                else if (!/\S+@\S+\.\S+/.test(value)) error = 'Invalid email format.';
                break;
            case 'password':
                if (!value) error = 'Password is required.';
                else if (value.length < 6) error = 'Password must be at least 6 characters.';
                break;
            case 'confirm_password':
                if (value !== formData.password) error = 'Passwords do not match.';
                break;
            case 'paypal_email':
                if (value && !/\S+@\S+\.\S+/.test(value)) error = 'Invalid PayPal email format.';
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
            const temp = {};
            validateField(name, value);
        });

        const hasErrors = Object.values(errors).some(msg => msg);
        if (hasErrors) throw new Error('Validation failed');
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
        <form onSubmit={handleSubmit} noValidate>
            <h2>Register</h2>

            <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} onBlur={handleBlur} />
            <p className="error">{errors.name || '\u00A0'}</p>

            <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} onBlur={handleBlur} />
            <p className="error">{errors.email || '\u00A0'}</p>

            <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} onBlur={handleBlur} />
            <p className="error">{errors.password || '\u00A0'}</p>

            <input name="confirm_password" type="password" placeholder="Confirm Password" value={formData.confirm_password} onChange={handleChange} onBlur={handleBlur} />
            <p className="error">{errors.confirm_password || '\u00A0'}</p>

            <p>Optional: PayPal Email</p>
            <input name="paypal_email" type="email" placeholder="PayPal Email" value={formData.paypal_email} onChange={handleChange} onBlur={handleBlur} />
            <p className="error">{errors.paypal_email || '\u00A0'}</p>

            <button type="submit">Register</button>

            {message && <p>{message}</p>}
            <Link to="/login" className='link'>Already have an account? Login here</Link>
        </form>
    );
}