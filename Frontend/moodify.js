async function loadPlaylists(mood) {
  document.getElementById("playlist-title").innerText = `Playlists for ${mood}`;

  try {
    const res = await fetch(`http://localhost:5000/api/playlists/${mood}`);
    const playlists = await res.json();

    const container = document.getElementById("playlist-container");
    container.innerHTML = playlists
      .map(
        (p) => `
        <div class="playlist">
          <img src="${p.image}" alt="${p.name}">
          <h3>${p.name}</h3>
          <a href="${p.url}" target="_blank">▶ Open in Spotify</a>
        </div>
      `
      )
      .join("");
  } catch (error) {
    console.error("Error loading playlists:", error);
    document.getElementById("playlist-container").innerHTML =
      "<p>⚠️ Failed to load playlists. Try again.</p>";
  }
}

