import Recipe from '../models/recipeModel.js';

export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data resep' });
  }
};