import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../../services/api';

const Profile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!getAuthToken()) {
      navigate('/login');
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

  return null;
};

export default Profile;

