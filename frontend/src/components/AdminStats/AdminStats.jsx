import { useState, useEffect } from 'react';
import './AdminStats.css';
import { getAdminStats, getSupportMessages } from '../../services/api';

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, messagesData] = await Promise.all([
          getAdminStats(),
          getSupportMessages()
        ]);
        setStats(statsData);
        setMessages(messagesData);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  return (
    <div className="admin-stats">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats?.total_users || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Support Requests</h3>
          <p className="stat-number">{messages.length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Sessions</h3>
          <p className="stat-number">{stats?.active_sessions || 0}</p>
        </div>
      </div>

      <div className="messages-section">
        <h3>Recent Support Messages</h3>
        {messages.map((msg) => (
          <div key={msg.id} className="message-card">
            <p><strong>{msg.user_email}</strong></p>
            <p>{msg.message}</p>
            <span className="message-time">{new Date(msg.created_at).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminStats;
