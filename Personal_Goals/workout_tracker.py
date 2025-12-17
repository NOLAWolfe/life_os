import json
import argparse
from datetime import datetime, timedelta
import os

DATA_FILE = os.path.join(os.path.dirname(__file__), 'workout_data.json')

def load_data():
    if not os.path.exists(DATA_FILE):
        return {"workouts": {}, "logs": []}
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

def define_workout(workout_name, exercises):
    data = load_data()
    if workout_name in data["workouts"]:
        print(f"Workout '{workout_name}' already exists. Use 'update' command to modify.")
    else:
        data["workouts"][workout_name] = exercises
        save_data(data)
        print(f"Workout '{workout_name}' defined with exercises: {', '.join(exercises)}")

def log_workout(workout_name):
    data = load_data()
    if workout_name not in data["workouts"]:
        print(f"Workout '{workout_name}' not found. Please define it first.")
        return

    log_entry = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "workout_name": workout_name
    }
    data["logs"].append(log_entry)
    save_data(data)
    print(f"Logged '{workout_name}' for today.")

def show_history():
    data = load_data()
    if not data["logs"]:
        print("No workouts logged yet.")
        return

    print("\n--- Workout History ---")
    # Sort logs by date descending
    sorted_logs = sorted(data["logs"], key=lambda x: x["date"], reverse=True)
    for log in sorted_logs:
        print(f"- {log['date']}: {log['workout_name']}")
    print("-----------------------")

def show_status():
    data = load_data()
    if not data["logs"]:
        print("No workouts logged yet.")
        return

    today = datetime.now().date()
    seven_days_ago = today - timedelta(days=7)
    thirty_days_ago = today - timedelta(days=30)

    recent_logs = [log for log in data["logs"] if datetime.strptime(log["date"], "%Y-%m-%d").date() > seven_days_ago]
    month_logs = [log for log in data["logs"] if datetime.strptime(log["date"], "%Y-%m-%d").date() > thirty_days_ago]

    print("\n--- Workout Status ---")
    print(f"Workouts in the last 7 days: {len(recent_logs)}")
    print(f"Workouts in the last 30 days: {len(month_logs)}")
    print("----------------------")


def list_workouts():
    data = load_data()
    if not data["workouts"]:
        print("No workouts defined yet.")
        return

    print("\n--- Defined Workouts ---")
    for name, exercises in data["workouts"].items():
        print(f"- {name}: {', '.join(exercises)}")
    print("------------------------")

def main():
    parser = argparse.ArgumentParser(description="A simple workout tracker.")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Define command
    define_parser = subparsers.add_parser("define", help="Define a new workout routine.")
    define_parser.add_argument("workout_name", type=str, help="The name of the workout.")
    define_parser.add_argument("--exercises", type=str, required=True, help="A comma-separated list of exercises.")

    # Log command
    log_parser = subparsers.add_parser("log", help="Log a completed workout.")
    log_parser.add_argument("workout_name", type=str, help="The name of the workout.")

    # History command
    history_parser = subparsers.add_parser("history", help="Show workout history.")

    # Status command
    status_parser = subparsers.add_parser("status", help="Show workout consistency status.")

    # List command
    list_parser = subparsers.add_parser("list", help="List all defined workout routines.")

    args = parser.parse_args()

    if args.command == "define":
        exercises = [e.strip() for e in args.exercises.split(',')]
        define_workout(args.workout_name, exercises)
    elif args.command == "log":
        log_workout(args.workout_name)
    elif args.command == "history":
        show_history()
    elif args.command == "status":
        show_status()
    elif args.command == "list":
        list_workouts()
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
