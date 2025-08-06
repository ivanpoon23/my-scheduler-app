const CANVAS_CLIENT_ID = "your-client-id";
const REDIRECT_URI = "http://localhost:5173/oauth/callback";

const handleLogin = () => {
  const url = `https://canvas.instructure.com/login/oauth2/auth?client_id=${CANVAS_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  window.location.href = url;
};
