const Recipe = mongoose.model("Recipe", new mongoose.Schema({
  title: String,
  description: String,
  ingredients: Array,
  steps: Array,
  time: String,
  difficulty: String,
  serving: String,
  author: String,
  rating: Number,
  image: String
}), "recipes");
