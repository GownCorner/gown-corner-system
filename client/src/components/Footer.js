import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-section">
                    <h3>Designer Dress,Gowns and Suite Hire</h3>
                    <p>GownCorner by GDL newest leading luxury dress,gowns,suite rental destination, for all of life's special occasions.</p>
                </div>
                <div className="footer-section">
                    <h3>Delivered to Your Door</h3>
                    <p>We'll deliver your chosen dress to you at home, or at work. All you need to do is have fun in it and send it back when you're done!</p>
                </div>
            </div>

            <div className="footer-social">
                <h4>Follow Us on Facebook</h4>
                <div className="social-feed">
                    <a href="https://www.facebook.com/profile.php?id=100069855072637&sk=videos" target="_blank" rel="noopener noreferrer">
                        <img src="/assets/reviews1.jpg" alt="Facebook Video 1" />
                    </a>
                    <a href="https://www.facebook.com/100069855072637/videos/881073500424311" target="_blank" rel="noopener noreferrer">
                        <img src="/assets/reviews2.jpg" alt="Facebook Video 2" />
                    </a>
                    <a href="https://www.facebook.com/100069855072637/videos/1318248672100032" target="_blank" rel="noopener noreferrer">
                        <img src="/assets/reviews3.jpg" alt="Facebook Video 3" />
                    </a>
                </div>
                <a href="https://www.facebook.com/profile.php?id=100069855072637" target="_blank" rel="noopener noreferrer" className="social-follow-button">
                    Follow on Facebook
                </a>
            </div>

            <div className="footer-bottom">
                <div className="footer-links">
                    <h4>Useful Links</h4>
                    <p><a href="/privacy-policy">Privacy Policy</a></p>
                    <p><a href="/terms-of-use">Terms of Use</a></p>
                </div>
                
                <div className="footer-copyright">
                    <p>© Copyright 2024 | Gown Corner by GDL</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
