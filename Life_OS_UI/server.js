import express from "express";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
const PORT = 4001; // diffrent port from UI's dev server

//tests
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/api/todos", async (req, res) => {
  try {
    const todoFilePath = path.resolve(
      __dirname,
      "../Personal_Goals/pgoals_todo.json"
    );
    const data = await fs.readFile(todoFilePath, "utf8");
    const jsonData = JSON.parse(data);
    res.json(jsonData);
  } catch (error) {
    console.error("Error reading or parsing todo file:", error);
    res.status(500).json({ error: "Failed to fetch todos." });
  }
});

app.get("/api/accounts", (req, res) => {
  const pythonScriptPath = path.resolve(
    __dirname,
    "../Software_Projects/plaid-assistant/ai-fin-tracker/fetch_accounts.py"
  );
  const pythonScriptDir = path.dirname(pythonScriptPath);
  // Use spawn to run the python script
  // We set the 'cwd' (current working directoyy) to the script directory
  // to ensure it can find its .env file.
  const pythonProcess = spawn("python3", [pythonScriptPath], {
    cwd: pythonScriptDir,
  });

  let dataString = "";
  //Listen for data coming from the python script's output
  pythonProcess.stdout.on("data", (data) => {
    dataString += data.toString();
  });

  // Listen for any errors from the python script
  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python script error: ${data}`);
  });

  // When the script finishes, process its output
  pythonProcess.on("close", (code) => {
    if (code === 0) {
      // If success retrieval
      try {
        const jsonData = JSON.parse(dataString); // ...try to parse the output as JSON...
        res.json(jsonData); // ...and send it to the fronend.
      } catch (error) {
        res
          .status(500)
          .json({ error: "Failed to parse Python script output." });
      }
    } else {
      // if the script failed...
      res.status(500).json({ error: "Python script failed to execute." });
    }
  });
});

app.get("/api/workout-templates", async (req, res) => {
  try {
    const workoutDataFilePath = path.resolve(
      __dirname,
      "../Personal_Goals/workout_data.json"
    );
    const data = await fs.readFile(workoutDataFilePath, "utf8");
    const jsonData = JSON.parse(data);
    res.json(jsonData.workout_templates);
  } catch (error) {
    console.error("Error reading or parsing workout data file:", error);
    res.status(500).json({ error: "Failed to fetch workout templates." });
  }
});

app.get("/api/workout-logs", async (req, res) => {
  try {
    const workoutDataFilePath = path.resolve(
      __dirname,
      "../Personal_Goals/workout_data.json"
    );
    const data = await fs.readFile(workoutDataFilePath, "utf8");
    const jsonData = JSON.parse(data);
    res.json(jsonData.workout_logs);
  } catch (error) {
    console.error("Error reading or parsing workout data file:", error);
    res.status(500).json({ error: "Failed to fetch workout logs." });
  }
});

app.post("/api/workout-logs", async (req, res) => {
  try {
    const newLog = req.body;
    
    // Basic validation
    if (!newLog || !newLog.template_name || !newLog.date) {
      return res.status(400).json({ error: "Invalid workout log data." });
    }

    const workoutDataFilePath = path.resolve(
      __dirname,
      "../Personal_Goals/workout_data.json"
    );
    const data = await fs.readFile(workoutDataFilePath, "utf8");
    const jsonData = JSON.parse(data);

    // Add a unique ID to the new log
    newLog.id = `log_${Date.now()}`;
    jsonData.workout_logs.push(newLog);

    await fs.writeFile(
      workoutDataFilePath,
      JSON.stringify(jsonData, null, 2),
      "utf8"
    );

    res.status(201).json({ message: "Workout logged successfully.", log: newLog });
  } catch (error) {
    console.error("Error logging workout:", error);
    res.status(500).json({ error: "Failed to log workout." });
  }
});

app.get("/api/recipes", async (req, res) => {
  try {
    const mealDataFilePath = path.resolve(
      __dirname,
      "../Personal_Goals/meal_data.json"
    );
    const data = await fs.readFile(mealDataFilePath, "utf8");
    const jsonData = JSON.parse(data);
    res.json(jsonData.recipes);
  } catch (error) {
    console.error("Error reading or parsing meal data file:", error);
    res.status(500).json({ error: "Failed to fetch recipes." });
  }
});

app.post("/api/recipes", async (req, res) => {
  try {
    const { name, ingredients } = req.body;

    // Basic validation
    if (!name || !ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ error: "Invalid recipe data." });
    }

    const mealDataFilePath = path.resolve(
      __dirname,
      "../Personal_Goals/meal_data.json"
    );
    const data = await fs.readFile(mealDataFilePath, "utf8");
    const jsonData = JSON.parse(data);

    const newRecipe = {
      id: `recipe_${Date.now()}`,
      name,
      ingredients,
    };

    jsonData.recipes.push(newRecipe);

    await fs.writeFile(
      mealDataFilePath,
      JSON.stringify(jsonData, null, 2),
      "utf8"
    );

    res.status(201).json({ message: "Recipe added successfully.", recipe: newRecipe });
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).json({ error: "Failed to add recipe." });
  }
});

app.get("/api/meal-plan", async (req, res) => {
  try {
    const mealDataFilePath = path.resolve(
      __dirname,
      "../Personal_Goals/meal_data.json"
    );
    const data = await fs.readFile(mealDataFilePath, "utf8");
    const jsonData = JSON.parse(data);
    res.json(jsonData.meal_plan);
  } catch (error) {
    console.error("Error reading or parsing meal data file:", error);
    res.status(500).json({ error: "Failed to fetch meal plan." });
  }
});

app.put("/api/meal-plan", async (req, res) => {
  try {
    const mealDataFilePath = path.resolve(
      __dirname,
      "../Personal_Goals/meal_data.json"
    );
    const data = await fs.readFile(mealDataFilePath, "utf8");
    const jsonData = JSON.parse(data);

    if (!jsonData.recipes || jsonData.recipes.length === 0) {
      return res.status(400).json({ error: "No recipes available to generate a plan." });
    }

    const today = new Date();
    const newPlan = {
      start_date: today.toISOString().split('T')[0],
      end_date: new Date(today.setDate(today.getDate() + 6)).toISOString().split('T')[0],
      days: []
    };
    
    today.setDate(today.getDate() - 6); // Reset date to start of week

    for (let i = 0; i < 7; i++) {
        const meal = jsonData.recipes[Math.floor(Math.random() * jsonData.recipes.length)];
        const dayDate = new Date(today);
        dayDate.setDate(today.getDate() + i);
        newPlan.days.push({
            date: dayDate.toISOString().split('T')[0],
            meal_id: meal.id
        });
    }

    jsonData.meal_plan = newPlan;

    await fs.writeFile(
      mealDataFilePath,
      JSON.stringify(jsonData, null, 2),
      "utf8"
    );

    res.json({ message: "Meal plan regenerated successfully.", meal_plan: newPlan });
  } catch (error) {
    console.error("Error regenerating meal plan:", error);
    res.status(500).json({ error: "Failed to regenerate meal plan." });
  }
});

app.get("/api/transactions", async (req, res) => {
  // This endpoint returns mock transaction data.
  const mockTransactions = {
    transactions: [
      { transaction_id: "1", date: "2025-12-15", name: "Coffee Shop", amount: 4.50, category: ["Food and Drink", "Restaurants"] },
      { transaction_id: "2", date: "2025-12-14", name: "Spotify", amount: 9.99, category: ["Shops", "Digital Music"] },
      { transaction_id: "3", date: "2025-12-13", name: "Gas Station", amount: 55.20, category: ["Transfer", "Credit"] },
      { transaction_id: "4", date: "2025-12-12", name: "Grocery Store", amount: 123.45, category: ["Food and Drink", "Groceries"] },
    ]
  };
  res.json(mockTransactions);
});

//This starts the server and tells it to listen for request on our chosen port
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
