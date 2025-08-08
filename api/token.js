// Vercel serverless function for AniList OAuth
// Deploy this to Vercel for free production use

module.exports = async (req, res) => {
  // Enable CORS for your mobile app
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { grant_type, client_id, redirect_uri, code } = req.body;
    
    // Your AniList client secret (set as environment variable in Vercel)
    const CLIENT_SECRET = process.env.ANILIST_CLIENT_SECRET;
    
    if (!CLIENT_SECRET) {
      console.error('CLIENT_SECRET not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
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
}
