import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const name = params.get('name');

    if (!token || !name) {
      console.error('Token or username not found in URL');
      return;
    }

    console.log('Token:', token);
    console.log('Name:', name);

    localStorage.setItem('github_token', token);
    localStorage.setItem('github_username', name);
    navigate('/list-files');
  }, []);

  return <div>Authenticating...</div>;
};

export default OAuthCallback;
