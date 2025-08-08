const express = require('express');
const cors = require('cors');
// Using native fetch (Node.js 18+)

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Your AniList client secret - KEEP THIS SECURE!
const CLIENT_SECRET = '5iG558YU4aTAN7HQHcm0q7Xky29MKFfXM8jONh3m'; // Replace with your actual client secret

app.post('/api/token', async (req, res) => {
  try {
    const { grant_type, client_id, redirect_uri, code } = req.body;
    
    console.log('Proxy: Exchanging code for token');
    
    // Make the request to AniList with the client secret
    const response = await fetch('https://anilist.co/api/v2/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        grant_type,
        client_id,
        client_secret: CLIENT_SECRET,
        redirect_uri,
        code,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('AniList error:', data);
      return res.status(response.status).json(data);
    }
    
    console.log('Token exchange successful');
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`OAuth proxy server running at http://localhost:${port}`);
  console.log('Remember to replace YOUR_CLIENT_SECRET_HERE with your actual AniList client secret!');
});
