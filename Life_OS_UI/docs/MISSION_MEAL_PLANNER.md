# Mission: The Intelligent Kitchen (Meal Planner 2.0)

**Goal:** Transform the "Household Commander" into a data-driven nutrition engine that rivals specialized apps like Yazio, but integrated with your financial and life context.

## 🚀 Active Roadmap

### 1. Ingredient Intelligence 🧠
*   **Problem:** Manual typing of ingredients ("Chicken", "Chicken Breast", "Grilled Chicken") leads to messy shopping lists.
*   **Solution:** 
    *   **Common Ingredient Database:** A persistent JSON/DB table of standard ingredients.
    *   **Auto-Complete:** Type "Chi..." -> Select "Chicken Breast (Boneless)".
    *   **Pantry Tracker:** Mark ingredients as "In Stock" to remove them from the generated shopping list.

### 2. External Recipe API 🌍
*   **Problem:** Manual data entry is high friction.
*   **Solution:** Integrate a recipe API (e.g., Spoonacular or Edamam - *Free Tiers Available*).
    *   **Search:** "High protein dinner under 500 cals".
    *   **Import:** One-click save to local `Recipe` database with ingredients parsed.

### 3. The "Yazio-Killer" (Macros & TDEE) 📊
*   **Problem:** Meal planning is currently blind to nutritional impact.
*   **Solution:**
    *   **TDEE Calculator:** Simple input (Weight, Height, Age, Activity) -> Daily Calorie Target.
    *   **Macro Banking:** 
        *   User A (Perf): 40% Protein / 30% Carb / 30% Fat.
        *   User B (Med): Low Glycemic Index focus.
    *   **Daily Score:** Visual progress bar showing consumed vs. target calories.

### 4. Integration Points 🔗
*   **Finance:** "Cost per Meal" estimation based on ingredient prices.
*   **Health:** Sync weight logs to adjust TDEE dynamically.

## 🛠️ Next Technical Steps
1.  Add `calories`, `protein`, `carbs`, `fat` columns to `Recipe` model.
2.  Create `Ingredient` model for standardized data.
3.  Build the TDEE Calculator widget (Pure math, low complexity).
