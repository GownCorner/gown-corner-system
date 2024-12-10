import React, { useState } from 'react';

const AddressForm = ({ onSubmit }) => {
    const [address, setAddress] = useState({ line1: '', line2: '', city: '', country: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(address);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Enter Address</h2>
            <input type="text" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} placeholder="Address Line 1" />
            <button type="submit">Submit Address</button>
        </form>
    );
};

export default AddressForm;
