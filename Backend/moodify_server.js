const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());

// Access Token
async function getAccessToken() {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization":
            "Basic " +
            Buffer.from(
              process.env.SPOTIFY_CLIENT_ID +
                ":" +
                process.env.SPOTIFY_CLIENT_SECRET
            ).toString("base64"),
        },
      }
    );
    return response.data.access_token;
  } catch (err) {
    console.error("Error fetching token:", err.response?.data || err.message);
    throw err;
  }
}

// Playlist route
app.get("/api/playlists/:mood", async (req, res) => {
  try {
    const mood = req.params.mood;
    const token = await getAccessToken();

    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        mood
      )}&type=playlist&limit=5`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const playlists =
      response.data.playlists?.items?.map((p) => ({
        name: p?.name || "Unknown",
        url: p?.external_urls?.spotify || "#",
        image: p?.images?.[0]?.url || "",
      })) || [];

    res.json(playlists);
  } catch (error) {
    console.error("Error in /api/playlists:", error.message);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
});

// Serve Frontend
app.use(express.static(path.join(__dirname, 'Frontend')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'moodify_index.html'));
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🎶 Server running on port ${PORT}`));

