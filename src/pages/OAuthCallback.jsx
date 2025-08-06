import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) return;

    // Exchange code for token via backend
    fetch(`http://localhost:8000/api/auth/oauth/callback?code=${code}`)
      .then(res => res.json())
      .then(data => {
        const token = data.access_token;
        localStorage.setItem("canvas_token", token);
        navigate("/todo");
      });
  }, [navigate]);

  return <p>Authorizing with Canvas…</p>;
}
