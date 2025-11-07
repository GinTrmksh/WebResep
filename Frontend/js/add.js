const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : `http://${window.location.hostname}:5000`;

document.getElementById("recipeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  try {
    const res = await fetch(`${API_BASE}/recipes`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("✅ Resep berhasil ditambahkan!");
      window.location.href = "/";
    } else {
      const errText = await res.text();
      alert(`❌ Gagal menambahkan resep: ${errText}`);
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Terjadi kesalahan saat menyimpan resep.");
  }
});
