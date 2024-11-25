import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { registerUser } from '../services/api';
import './Register.css';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await registerUser({ name, email, password });
            localStorage.setItem('token', response.data.token);

            setSuccessMessage('Registration successful! Redirecting...');
            setTimeout(() => {
                const redirectPath = location.state?.from || '/order-form';
                navigate(redirectPath);
            }, 2000);
        } catch (error) {
            const serverError = error.response?.data?.message || 'Registration failed. Please try again.';
            setError(serverError);
        }
    };

    return (
        <div className="register-container">
            <h2>Sign Up</h2>
            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="input-field"
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="input-field"
                />
                <button type="submit" className="register-button">Register</button>
            </form>
        </div>
    );
}

export default Register;
