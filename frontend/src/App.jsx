import React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/recipes";
const categories = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert"];
const emptyForm = {
  name: "",
  category: "Breakfast",
  ingredients: "",
  steps: "",
  cookingTime: ""
};

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadRecipes() {
    try {
      const response = await axios.get(API);
      setRecipes(response.data);
    } catch {
      setMessage("Cannot connect to the backend. Check that the server is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecipes();
  }, []);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const minutes = Number(form.cookingTime);

    if (!form.name.trim() || !form.ingredients.trim() || !form.steps.trim()) {
      setMessage("Please fill in all fields.");
      return;
    }
    if (!Number.isInteger(minutes) || minutes < 1) {
      setMessage("Cooking time must be a positive whole number.");
      return;
    }

    const payload = {
      ...form,
      name: form.name.trim(),
      ingredients: form.ingredients.trim(),
      steps: form.steps.trim(),
      cookingTime: minutes
    };

    try {
      if (editing) {
        await axios.put(`${API}/${editing}`, payload);
        setMessage("Recipe updated successfully!");
      } else {
        await axios.post(API, payload);
        setMessage("Recipe added successfully!");
      }
      setForm(emptyForm);
      setEditing(null);
      await loadRecipes();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not save the recipe.");
    }
  }

  function startEdit(recipe) {
    setEditing(recipe._id);
    setForm({
      name: recipe.name,
      category: recipe.category,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      cookingTime: String(recipe.cookingTime)
    });
    setSelected(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteRecipe(id) {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      setSelected(null);
      if (editing === id) {
        setEditing(null);
        setForm(emptyForm);
      }
      setMessage("Recipe deleted successfully!");
      await loadRecipes();
    } catch {
      setMessage("Could not delete the recipe.");
    }
  }

  function cancelEdit() {
    setEditing(null);
    setForm(emptyForm);
    setMessage("");
  }

  return (
    <main className="container">
      <header className="hero">
        <div className="hero-icon">✿</div>
        <p className="eyebrow">YOUR PERSONAL COOKBOOK</p>
        <h1>Recipe Book <span>♡</span></h1>
        <p className="hero-copy">Save your favourites. Cook something wonderful.</p>
      </header>

      <section className="form-card">
        <div className="section-kicker">{editing ? "MAKE IT BETTER" : "FROM YOUR KITCHEN"}</div>
        <h2>{editing ? "Edit Recipe" : "Add a Recipe"}</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Recipe Name</label>
          <input id="name" name="name" placeholder="e.g. Chocolate Cake" value={form.name} onChange={handleChange} required />

          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={form.category} onChange={handleChange}>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>

          <label htmlFor="ingredients">Ingredients</label>
          <textarea id="ingredients" name="ingredients" placeholder="List ingredients, one per line" value={form.ingredients} onChange={handleChange} required />

          <label htmlFor="steps">Preparation Steps</label>
          <textarea id="steps" name="steps" placeholder="Write the steps in order" value={form.steps} onChange={handleChange} required />

          <label htmlFor="cookingTime">Cooking Time (minutes)</label>
          <input id="cookingTime" name="cookingTime" type="number" min="1" step="1" placeholder="e.g. 30" value={form.cookingTime} onChange={handleChange} required />

          <button className="primary-button" type="submit">{editing ? "Save Changes" : "＋ Save Recipe"}</button>
          {editing && <button className="secondary-button" type="button" onClick={cancelEdit}>Cancel Edit</button>}
        </form>
        {message && <p className="message" role="status">{message}</p>}
      </section>

      <section className="recipes-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">MADE WITH LOVE</p>
            <h2>My Recipes</h2>
          </div>
          <span className="count-pill">{recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}</span>
        </div>

        {loading ? <p className="empty">Loading recipes…</p> :
          recipes.length === 0 ? <p className="empty">No recipes yet. Add your first recipe above!</p> :
          <div className="recipe-grid">
            {recipes.map((recipe) => (
              <article className="recipe-card" key={recipe._id}>
                <div className="food-icon">🍲</div>
                <span className="category-pill">{recipe.category}</span>
                <h3>{recipe.name}</h3>
                <p className="time">◷ &nbsp;{recipe.cookingTime} minutes</p>
                <button className="primary-button full-button" onClick={() => setSelected(recipe)}>View Details</button>
                <div className="actions">
                  <button className="secondary-button" onClick={() => startEdit(recipe)}>Edit</button>
                  <button className="danger-button" onClick={() => deleteRecipe(recipe._id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        }
      </section>

      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <section className="details" role="dialog" aria-modal="true" aria-label="Recipe details" onClick={(event) => event.stopPropagation()}>
            <button className="close-button" aria-label="Close details" onClick={() => setSelected(null)}>×</button>
            <p className="eyebrow">{selected.category}</p>
            <h2>{selected.name}</h2>
            <p className="time">◷ &nbsp;{selected.cookingTime} minutes</p>
            <h3>Ingredients</h3>
            <p className="preserve">{selected.ingredients}</p>
            <h3>Preparation Steps</h3>
            <p className="preserve">{selected.steps}</p>
            <button className="primary-button" onClick={() => startEdit(selected)}>Edit Recipe</button>
          </section>
        </div>
      )}
      <footer>Made with care · Your recipes, all in one place</footer>
    </main>
  );
}