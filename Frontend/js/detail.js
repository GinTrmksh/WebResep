const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:5000"
  : "http://backend:5000";


document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#recipe-detail");

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    container.innerHTML = "<p>Resep tidak ditemukan.</p>";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/recipes/${id}`);
    const recipe = await res.json();
    const imageUrl = `${API_BASE}/uploads/${recipe.image}`;

    container.innerHTML = `
      <a href="/index.html" class="back-button"> Home
        <i class="fas fa-arrow-left"></i>
      </a>
      <div class="recipe-detail-card">
        <h1>${recipe.title}</h1>
        <img src="${imageUrl}" alt="${recipe.title}" class="detail-img">
        <p>${recipe.description}</p>
        <p>by <strong>${recipe.author}</strong></p>

        <h3>Bahan-bahan:</h3>
        <ul>${recipe.ingredients.map(item => `<li>${item}</li>`).join("")}</ul>

        <h3>Cara Membuat:</h3>
        <ol>${recipe.steps.map(step => `<li>${step}</li>`).join("")}</ol>

        <div class="actions">
          <button id="edit-btn">✏️ Edit</button>
          <button id="delete-btn">🗑️ Hapus</button>
        </div>

        <form id="edit-form" style="display:none; margin-top:20px;">
          <h3>Edit Resep</h3>
          <input type="text" id="title" value="${recipe.title}" placeholder="Judul"><br>
          <textarea id="description" placeholder="Deskripsi">${recipe.description}</textarea><br>
          <input type="text" id="ingredients" value="${recipe.ingredients.join(",")}" placeholder="Bahan (pisahkan dengan koma)"><br>
          <textarea id="steps" placeholder="Langkah (pisahkan dengan ;)">${recipe.steps.join(";")}</textarea><br>
          <input type="text" id="time" value="${recipe.time}" placeholder="Waktu"><br>
          <input type="text" id="difficulty" value="${recipe.difficulty}" placeholder="Kesulitan"><br>
          <input type="text" id="serving" value="${recipe.serving}" placeholder="Porsi"><br>
          <input type="text" id="author" value="${recipe.author}" placeholder="Penulis"><br>
          <button type="submit">💾 Simpan Perubahan</button>
          <button type="button" id="cancel-btn">❌ Batal</button>
        </form>
      </div>
    `;

    document.querySelector("#delete-btn").addEventListener("click", async () => {
      if (confirm("Yakin mau hapus resep ini?")) {
        const delRes = await fetch(`${API_BASE}/api/recipes/${id}`, { method: "DELETE" });
        if (delRes.ok) {
          alert("Resep berhasil dihapus!");
          window.location.href = "/index.html";
        } else {
          alert("Gagal menghapus resep.");
        }
      }
    });

    const editBtn = document.querySelector("#edit-btn");
    const form = document.querySelector("#edit-form");
    const cancelBtn = document.querySelector("#cancel-btn");

    editBtn.addEventListener("click", () => {
      form.style.display = "block";
      editBtn.style.display = "none";
    });

    cancelBtn.addEventListener("click", () => {
      form.style.display = "none";
      editBtn.style.display = "inline-block";
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const updatedData = {
        title: document.querySelector("#title").value,
        description: document.querySelector("#description").value,
        ingredients: document.querySelector("#ingredients").value,
        steps: document.querySelector("#steps").value,
        time: document.querySelector("#time").value,
        difficulty: document.querySelector("#difficulty").value,
        serving: document.querySelector("#serving").value,
        author: document.querySelector("#author").value
      };

      const updateRes = await fetch(`${API_BASE}/api/recipes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });

      if (updateRes.ok) {
        alert("Resep berhasil diperbarui!");
        location.reload();
      } else {
        alert("Gagal memperbarui resep.");
      }
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Gagal memuat detail resep.</p>";
  }
});
