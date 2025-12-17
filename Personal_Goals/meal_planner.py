import json
import argparse
from datetime import datetime
import os
import random

DATA_FILE = os.path.join(os.path.dirname(__file__), 'meal_data.json')

def load_data():
    if not os.path.exists(DATA_FILE):
        return {"recipes": {}, "current_plan": []}
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

def add_recipe(recipe_name, ingredients):
    data = load_data()
    if recipe_name in data["recipes"]:
        print(f"Recipe '{recipe_name}' already exists.")
    else:
        data["recipes"][recipe_name] = {"ingredients": ingredients}
        save_data(data)
        print(f"Recipe '{recipe_name}' added with ingredients: {', '.join(ingredients)}")

def list_recipes():
    data = load_data()
    if not data["recipes"]:
        print("No recipes added yet.")
        return

    print("\n--- Available Recipes ---")
    for name, details in data["recipes"].items():
        print(f"- {name}: {', '.join(details['ingredients'])}")
    print("-------------------------")

def generate_plan(days):
    data = load_data()
    if not data["recipes"]:
        print("No recipes available to generate a plan. Please add some recipes first.")
        return

    available_recipes = list(data["recipes"].keys())
    if len(available_recipes) < days:
        print(f"Warning: Only {len(available_recipes)} recipes available, but requested a {days}-day plan. Some meals might repeat.")

    plan = []
    for i in range(days):
        meal = random.choice(available_recipes)
        plan.append({"day": i + 1, "meal": meal})

    data["current_plan"] = plan
    save_data(data)
    print(f"Generated a {days}-day meal plan.")

def show_plan():
    data = load_data()
    if not data["current_plan"]:
        print("No meal plan generated yet. Use 'generate-plan' to create one.")
        return

    print("\n--- Current Meal Plan ---")
    for entry in data["current_plan"]:
        print(f"Day {entry['day']}: {entry['meal']}")
    print("-------------------------")

def generate_shopping_list():
    data = load_data()
    if not data["current_plan"]:
        print("No meal plan generated yet. Use 'generate-plan' to create one before generating a shopping list.")
        return

    shopping_list_items = {}
    for entry in data["current_plan"]:
        recipe_name = entry['meal']
        if recipe_name in data["recipes"]:
            for ingredient in data["recipes"][recipe_name]["ingredients"]:
                # For now, just add the ingredient. Quantity can be an enhancement.
                shopping_list_items[ingredient.lower()] = True # Use a set-like behavior with dictionary keys

    if not shopping_list_items:
        print("No ingredients found for the current meal plan.")
        return

    print("\n--- Shopping List ---")
    for item in sorted(shopping_list_items.keys()):
        print(f"- {item.capitalize()}")
    print("---------------------")

def main():
    parser = argparse.ArgumentParser(description="A simple meal planner.")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Add Recipe command
    add_recipe_parser = subparsers.add_parser("add-recipe", help="Add a new recipe.")
    add_recipe_parser.add_argument("recipe_name", type=str, help="The name of the recipe.")
    add_recipe_parser.add_argument("--ingredients", type=str, required=True, help="Comma-separated list of ingredients.")

    # List Recipes command
    list_recipes_parser = subparsers.add_parser("list-recipes", help="List all available recipes.")

    # Generate Plan command
    generate_plan_parser = subparsers.add_parser("generate-plan", help="Generate a meal plan.")
    generate_plan_parser.add_argument("--days", type=int, default=7, help="Number of days for the meal plan (default: 7).")

    # Show Plan command
    show_plan_parser = subparsers.add_parser("show-plan", help="Show the current meal plan.")

    # Shopping List command
    shopping_list_parser = subparsers.add_parser("shopping-list", help="Generate a shopping list for the current meal plan.")

    args = parser.parse_args()

    if args.command == "add-recipe":
        ingredients = [i.strip() for i in args.ingredients.split(',')]
        add_recipe(args.recipe_name, ingredients)
    elif args.command == "list-recipes":
        list_recipes()
    elif args.command == "generate-plan":
        generate_plan(args.days)
    elif args.command == "show-plan":
        show_plan()
    elif args.command == "shopping-list":
        generate_shopping_list()
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
