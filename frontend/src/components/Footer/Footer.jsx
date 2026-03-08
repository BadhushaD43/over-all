import { useState } from 'react';
import './Footer.css';
import { sendSupportMessage } from '../../services/api';

const Footer = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [dubbingOpen, setDubbingOpen] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      try {
        await sendSupportMessage(message);
        alert('Message sent! We will respond within 24 hours.');
        setMessage('');
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
            <button onClick={() => setChatOpen(true)}>24x7 Chat</button>
          </div>
        </div>
        <p className="footer-bottom">© 2024 MovieStream. All rights reserved.</p>
      </footer>

      {chatOpen && (
        <div className="chat-modal">
          <div className="chat-box">
            <div className="chat-header">
              <h3>24x7 Support</h3>
              <button onClick={() => setChatOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSendMessage}>
              <textarea
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      )}

      {dubbingOpen && (
        <div className="chat-modal">
          <div className="chat-box">
            <div className="chat-header">
              <h3>Request Dubbing</h3>
              <button onClick={() => setDubbingOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSendMessage}>
              <textarea
                placeholder="Enter movie name and preferred language..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
