import React, { useState, useEffect } from 'react';

const DebugInfo = () => {
  const [debugInfo, setDebugInfo] = useState({
    backendUrl: 'http://localhost:8000',
    backendStatus: 'checking...',
    localStorageToken: null,
    localStorageUser: null
  });

  useEffect(() => {
    // Check backend connection
    fetch('http://localhost:8000/trending?page=1')
      .then(res => setDebugInfo(prev => ({ ...prev, backendStatus: res.ok ? '✅ Connected' : '❌ Error' })))
      .catch(() => setDebugInfo(prev => ({ ...prev, backendStatus: '❌ Unreachable' })));

    // Get localStorage info
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setDebugInfo(prev => ({
      ...prev,
      localStorageToken: token ? `${token.slice(0, 20)}...` : 'None',
      localStorageUser: user ? JSON.parse(user).email : 'None'
    }));
  }, []);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🔧 Debug Info</h3>
      <div style={styles.info}>
        <p><strong>Backend URL:</strong> {debugInfo.backendUrl}</p>
        <p><strong>Backend Status:</strong> {debugInfo.backendStatus}</p>
        <p><strong>Token in Storage:</strong> {debugInfo.localStorageToken}</p>
        <p><strong>User Email in Storage:</strong> {debugInfo.localStorageUser}</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '12px',
    margin: '10px 0',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'monospace'
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '14px'
  },
  info: {
    margin: 0
  }
};

export default DebugInfo;
