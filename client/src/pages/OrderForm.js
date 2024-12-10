import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import './OrderForm.css';

const OrderForm = () => {
    const { cartItems, totalPrice } = useContext(CartContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit the form to the backend
    };

    return (
        <div className="order-form-page">
            <h1>Complete Your Booking</h1>
            <form onSubmit={handleSubmit}>
                <label>Full Name</label>
                <input type="text" required />
                <label>Address</label>
                <textarea required></textarea>
                <label>Contact Number</label>
                <input type="tel" required />
                <button type="submit">Proceed to Payment</button>
            </form>
            <div className="order-summary">
                <h2>Order Summary</h2>
                {cartItems.map((item, index) => (
                    <div key={index}>
                        <p>{item.name}</p>
                        <p>{item.price}</p>
                    </div>
                ))}
                <p>Total: {totalPrice}</p>
            </div>
        </div>
    );
};

export default OrderForm;
