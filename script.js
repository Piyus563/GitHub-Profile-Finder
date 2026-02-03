function getProfile() {
  const username = document.getElementById("username").value.trim();
  const profile = document.getElementById("profile");
  const searchBtn = document.getElementById("searchBtn");
  const btnText = searchBtn.querySelector('.btn-text');
  const loader = searchBtn.querySelector('.loader');

  if (!username) {
    showError("Please enter a username");
    return;
  }

  // Show loading state
  btnText.classList.add('hidden');
  loader.classList.remove('hidden');
  searchBtn.disabled = true;

  fetch(`https://api.github.com/users/${username}`)
    .then(res => {
      if (!res.ok) throw new Error("User not found");
      return res.json();
    })
    .then(data => {
      profile.classList.remove("hidden");
      profile.innerHTML = `
        <img src="${data.avatar_url}" alt="${data.name || data.login}'s avatar">
        <h2>${data.name || data.login}</h2>
        <p>${data.bio || "No bio available"}</p>
        ${data.location ? `<p><i class="fas fa-map-marker-alt"></i> ${data.location}</p>` : ''}
        ${data.company ? `<p><i class="fas fa-building"></i> ${data.company}</p>` : ''}

        <div class="stats">
          <div class="stat-item">
            <strong>${formatNumber(data.followers)}</strong>
            <p>Followers</p>
          </div>
          <div class="stat-item">
            <strong>${formatNumber(data.following)}</strong>
            <p>Following</p>
          </div>
          <div class="stat-item">
            <strong>${formatNumber(data.public_repos)}</strong>
            <p>Repos</p>
          </div>
        </div>
        
        <div class="profile-link">
          <button onclick="window.open('${data.html_url}', '_blank')">
            <i class="fab fa-github"></i>
            View GitHub Profile
          </button>
        </div>
      `;
    })
    .catch(() => {
      showError("❌ User not found. Please check the username and try again.");
    })
    .finally(() => {
      // Reset button state
      btnText.classList.remove('hidden');
      loader.classList.add('hidden');
      searchBtn.disabled = false;
    });
}

function showError(message) {
  const profile = document.getElementById("profile");
  profile.classList.remove("hidden");
  profile.innerHTML = `<div class="error-message">${message}</div>`;
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Add Enter key support
document.getElementById('username').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    getProfile();
  }
});
