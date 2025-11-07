const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:5000"
  : "http://backend:5000";

console.log("Hostname saat ini:", window.location.hostname);
console.log("API_BASE terdeteksi:", API_BASE);

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#recipe-container");

  try {
    const res = await fetch(`${API_BASE}/api/recipes`);
    const data = await res.json();

    data.forEach(recipe => {
      const imageUrl = `${API_BASE}/uploads/${recipe.image}`;
      console.log("Image URL:", imageUrl);

      const card = document.createElement("div");
      card.classList.add("col-lg-4", "col-md-6");
      card.innerHTML = `
        <a href="/detail.html?id=${recipe._id}" class="recipe-card-link">
          <div class="recipe-card">
            <div class="recipe-img-container">
              <img src="${imageUrl}" alt="${recipe.title}" class="recipe-img">
              <span class="recipe-badge">🍽️ ${recipe.difficulty}</span>
            </div>
            <div class="recipe-body">
              <h3 class="recipe-title">${recipe.title}</h3>
              <p class="recipe-desc">${recipe.description}</p>
              <div class="recipe-meta">
                <span><i class="fas fa-clock"></i> ${recipe.time}</span>
                <span><i class="fas fa-user-friends"></i> ${recipe.serving}</span>
              </div>
            </div>
            <div class="recipe-footer">
              <div class="recipe-author">
                <span class="author-name">${recipe.author}</span>
              </div>
              <div class="recipe-rating">
                <i class="fas fa-star"></i> ${recipe.rating > 0 ? recipe.rating : 'Belum ada rating'}
              </div>
            </div>
          </div>
        </a>
      `;
      container.appendChild(card);
    });

  } catch (err) {
    console.error("Gagal memuat data:", err);
  }
});

// Tombol tambah resep
document.getElementById("addRecipeBtn").addEventListener("click", () => {
  window.location.href = "/add.html";
});
