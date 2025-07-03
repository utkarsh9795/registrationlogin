import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setMessage('Please login to view profile.');
      return;
    }

    axios.get(`${process.env.REACT_APP_API_BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setMessage(res.data.message))
    .catch(() => setMessage('Session expired or unauthorized.'));
  }, []);

  return (
    <div>
      <h2>Profile</h2>
      <p>{message}</p>
    </div>
  );
}

export default Profile;
