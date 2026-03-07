import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Customer Support</h3>
          <p>support@moviestream.com</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <p>Upcoming Movies</p>
          <p>Request Dub Movie</p>
        </div>
      </div>
      <p className="footer-bottom">© 2024 MovieStream. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
