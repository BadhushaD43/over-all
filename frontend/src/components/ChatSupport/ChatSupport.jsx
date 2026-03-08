import { useState, useEffect } from 'react';
import { getSupportMessages, sendSupportMessage } from '../../services/api';
import './ChatSupport.css';

const ChatSupport = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await getSupportMessages();
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;
    
    try {
      setLoading(true);
      await sendSupportMessage(newMessage.trim());
      setNewMessage('');
      await loadMessages();
    } catch (err) {
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-support">
      <h2>24x7 Support</h2>
      <div className="chat-messages">
        {messages.length === 0 && <p className="no-messages">No messages yet. Start a conversation!</p>}
        {messages.map((msg) => (
          <div key={msg.id} className="message-thread">
            <div className="message user-message">
              <strong>You:</strong> {msg.message}
              <span className="message-time">{new Date(msg.created_at).toLocaleString()}</span>
            </div>
            {msg.admin_response && (
              <div className="message admin-message">
                <strong>Support:</strong> {msg.admin_response}
                <span className="message-time">{msg.resolved_at ? new Date(msg.resolved_at).toLocaleString() : ''}</span>
              </div>
            )}
            {!msg.admin_response && <span className="status-pending">Pending response...</span>}
          </div>
        ))}
      </div>
      <form className="chat-input" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !newMessage.trim()}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatSupport;
