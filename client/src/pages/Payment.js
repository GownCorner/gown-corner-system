import React from 'react';
import { useLocation } from 'react-router-dom';
import './Payment.css';

const Payment = () => {
    const location = useLocation();
    const { cartItems = [], formData } = location.state || {};

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price, 0);
    };

    const handlePayment = () => {
        alert('Payment successful! Thank you for your order.');
        // Redirect or reset cart logic
    };

    return (
        <div className="payment-container">
            <h2>Payment</h2>
            <div className="order-summary">
                <h3>Order Summary</h3>
                {cartItems.map((item, index) => (
                    <div key={index} className="order-item">
                        <p>{item.name}</p>
                        <p>₱{item.price.toFixed(2)}</p>
                    </div>
                ))}
                <h4>Total: ₱{calculateTotal().toFixed(2)}</h4>
            </div>
            <div className="shipping-details">
                <h3>Shipping Address</h3>
                <p>{formData.line1}</p>
                <p>{formData.city}, {formData.country}</p>
                <p>{formData.postalCode}</p>
                <p>{formData.phoneNumber}</p>
            </div>
            <button onClick={handlePayment}>Confirm Payment</button>
        </div>
    );
};

export default Payment;
