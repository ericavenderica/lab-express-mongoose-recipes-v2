const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const RecipeModel = require("./models/Recipe.model");
const app = express();

// MIDDLEWARE
app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.json());


// Iteration 1 - Connect to MongoDB
// DATABASE CONNECTION


const MONGODB_URI = "mongodb://localhost:27017/express-mongoose-recipes-dev";

mongoose
  .connect(MONGODB_URI)
  .then((x) => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to mongo", err));

// ROUTES
//  GET  / route - This is just an example route
app.get('/', (req, res) => {
    res.send("<h1>LAB | Express Mongoose Recipes</h1>");
});


//  Iteration 3 - Create a Recipe route
//  POST  /recipes route
app.post("/create-a-recipe", (req, res) => {
  RecipeModel.create(req.body)
    .then((data) => {
      console.log("recipe added", data);
      res.status(201).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ errorMessage: "Failed to create recipe" });
    });
});

//  Iteration 4 - Get All Recipes
//  GET  /recipes route


app.get("/recipes", async (req, res) => {
  try {
    const data = await RecipeModel.find();
    console.log("recipes found", data);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: "Error to get recipes" });
  }
});

//  Iteration 5 - Get a Single Recipe
//  GET  /recipes/:id route

app.get("/one-recipe/:recipeId", async (req, res) => {
  try {
    const foundOneRecipe = await RecipeModel.findById(req.params.recipeId);
    console.log("recipe found", foundOneRecipe);
    res.status(200).json(foundOneRecipe);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: "Error to get one recipe" });
  }
});


//  Iteration 6 - Update a Single Recipe
//  PUT  /recipes/:id route

app.patch("/update-recipe/:recipeId", (req, res) => {
  const { recipeId } = req.params;
  RecipeModel.findByIdAndUpdate(recipeId, req.body, { new: true })
    .then((updatedRecipe) => {
      console.log("recipes updated", updatedRecipe);
      res.status(200).json(updatedRecipe);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ errorMessage: "Error updating recipe" });
    });
});


//  Iteration 7 - Delete a Single Recipe
//  DELETE  /recipes/:id route

app.delete("/delete-recipe/:recipeId", (req, res) => {
  RecipeModel.findByIdAndDelete(req.params.recipeId)
    .then((data) => {
      console.log("recipes deleted", data);
      res.status(204).send();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ errorMessage: "Error deleting recipe" });
    });
});


// Start the server
app.listen(3000, () => console.log('My first app listening on port 3000!'));



//❗️DO NOT REMOVE THE BELOW CODE
module.exports = app;
