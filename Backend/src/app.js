import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import multer from "multer";

dotenv.config();
const app = express();
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());
// app.use(express.static(path.join(__dirname, "../Frontend")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect(process.env.MONGO_URI || "mongodb://mongodb:27017/recipes")
  .then(() => console.log("MongoDB connected to database:", mongoose.connection.name))
  .catch((err) => console.error("MongoDB error:", err));

const recipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  ingredients: Array,
  steps: Array,
  time: String,
  difficulty: String,
  serving: String,
  author: String,
  rating: Number,
  image: String,
});

const Recipe = mongoose.model("Recipe", recipeSchema, "recipes");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../Frontend", "index.html"));
// });

app.get("/", (req, res) => {
  res.send("API aktif bang");
});

app.get("/api/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/recipes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid recipe ID" });
    }

    const recipe = await Recipe.findById(id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });

    res.json(recipe);
  } catch (err) {
    console.error("Error fetching recipe:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/recipes", upload.single("image"), async (req, res) => {
  try {
    const recipe = new Recipe({
      title: req.body.title,
      description: req.body.description,
      ingredients: req.body.ingredients.split(","),
      steps: req.body.steps.split(";"),
      rating: 0,
      time: req.body.time,
      difficulty: req.body.difficulty,
      serving: req.body.serving,
      author: req.body.author || "Anonim",
      image: req.file ? req.file.filename : null,
    });

    await recipe.save();
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Gagal menyimpan resep: " + err.message);
  }
});

app.put("/api/recipes/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid recipe ID" });
    }

    const updatedData = {
      title: req.body.title,
      description: req.body.description,
      ingredients: req.body.ingredients?.split(","),
      steps: req.body.steps?.split(";"),
      time: req.body.time,
      difficulty: req.body.difficulty,
      serving: req.body.serving,
      author: req.body.author,
    };

    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`;
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedRecipe) return res.status(404).json({ error: "Recipe not found" });

    res.json({ message: "Recipe updated successfully", recipe: updatedRecipe });
  } catch (err) {
    console.error("Error updating recipe:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/recipes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid recipe ID" });
    }

    const deletedRecipe = await Recipe.findByIdAndDelete(id);
    if (!deletedRecipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.error("Error deleting recipe:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
