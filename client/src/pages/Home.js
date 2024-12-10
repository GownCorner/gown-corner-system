import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    // Navigate to the collection page when the button is clicked
    const handleBookNow = () => {
        navigate('/collection');
    };

    return (
        <div className="home">
            {/* Background overlay for better contrast */}
            <div className="overlay"></div>

            {/* Main content container */}
            <div className="content">
                <h1 className="home-title">GOWNCORNER BY GDL</h1>
                <p className="home-subtitle">Luxury Gown Rental</p>
                <button className="cta-button" onClick={handleBookNow}>
                    Book A Gown
                </button>
            </div>
        </div>
    );
};

export default Home;
