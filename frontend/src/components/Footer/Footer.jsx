import { useState } from 'react';
import './Footer.css';
import { sendSupportMessage } from '../../services/api';

const Footer = () => {
  const [dubbingOpen, setDubbingOpen] = useState(false);
  const [dubbingMessage, setDubbingMessage] = useState('');

  const handleDubbingSend = async (e) => {
    e.preventDefault();
    if (dubbingMessage.trim()) {
      try {
        await sendSupportMessage(dubbingMessage, 'dub_request');
        alert('Dubbing request sent! We will respond within 24 hours.');
        setDubbingMessage('');
        setDubbingOpen(false);
      } catch {
        alert('Please login to send messages');
      }
    }
  };

  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>MovieStream</h3>
            <p>Your ultimate streaming platform</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <button onClick={() => setDubbingOpen(true)}>Request Dubbing</button>
            <a className="footer-support-link" href="/dashboard?view=support">24x7 Support</a>
          </div>
        </div>
        <p className="footer-bottom">(c) 2026 My <strong>B</strong> Stream. All rights reserved.</p>
      </footer>

      {dubbingOpen && (
        <div className="chat-modal">
          <div className="chat-box">
            <div className="chat-header">
              <h3>Request Dubbing</h3>
              <button onClick={() => setDubbingOpen(false)}>X</button>
            </div>
            <form onSubmit={handleDubbingSend}>
              <textarea
                placeholder="Enter movie name and preferred language..."
                value={dubbingMessage}
                onChange={(e) => setDubbingMessage(e.target.value)}
              />
              <button type="submit">Submit Request</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
