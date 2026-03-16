import { useState, useEffect } from 'react';
import { getSupportMessages, sendSupportMessage } from '../../services/api';
import './ChatSupport.css';

const ChatSupport = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [allowNewChat, setAllowNewChat] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setError('');
      const data = await getSupportMessages();
      setMessages(data);
      setAllowNewChat(false);
    } catch (err) {
      console.error(err);
      setError('Please login to use support.');
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = newMessage.trim();
    if (loading) return;
    if (trimmed.length < 5) {
      setError('Message must be at least 5 characters.');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      await sendSupportMessage(trimmed, 'support');
      setNewMessage('');
      await loadMessages();
    } catch (err) {
      setError(err?.message || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  const latestMessage = messages[0];
  const isResolved = latestMessage?.status === 'resolved' || latestMessage?.status === 'dubbed';
  const isChatLocked = isResolved && !allowNewChat;

  return (
    <div className="chat-support">
      <h2>24x7 Support</h2>
      {error && <p className="support-error">{error}</p>}
      {isResolved && !allowNewChat && (
        <div className="support-status">
          <p>Your query is resolved. Start a new chat if you need more help.</p>
          <button type="button" onClick={() => setAllowNewChat(true)}>New Chat</button>
        </div>
      )}
      <div className="chat-messages">
        {messages.length === 0 && <p className="no-messages">No messages yet. Start a conversation!</p>}
        {messages.map((msg) => (
          <div key={msg.id} className="message-thread">
            <div className="message user-message">
              <strong>You:</strong> {msg.message}
              <span className="message-time">{new Date(msg.created_at).toLocaleString()}</span>
            </div>
            <span className={`status-pill status-${msg.status}`}>{msg.status.replace(/_/g, ' ')}</span>
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
          disabled={loading || isChatLocked}
        />
        <button type="submit" disabled={loading || isChatLocked || !newMessage.trim()}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatSupport;
