import json
import argparse
from datetime import datetime
import os

DATA_FILE = os.path.join(os.path.dirname(__file__), 'skill_tracker.json')

def load_data():
    if not os.path.exists(DATA_FILE):
        return {}
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

def add_skill(skill_name):
    data = load_data()
    if skill_name in data:
        print(f"Skill '{skill_name}' already exists.")
    else:
        data[skill_name] = {"total_time": 0.0, "logs": []}
        save_data(data)
        print(f"Skill '{skill_name}' added.")

def log_time(skill_name, time_spent, note):
    data = load_data()
    if skill_name not in data:
        print(f"Skill '{skill_name}' not found. Please add it first.")
        return

    data[skill_name]["total_time"] += time_spent
    data[skill_name]["logs"].append({
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "time_spent": time_spent,
        "note": note
    })
    save_data(data)
    print(f"Logged {time_spent} hours for '{skill_name}'. Total: {data[skill_name]['total_time']} hours.")

def show_skill(skill_name):
    data = load_data()
    if skill_name not in data:
        print(f"Skill '{skill_name}' not found.")
        return

    skill_data = data[skill_name]
    print(f"\n--- Skill: {skill_name} ---")
    print(f"Total Time: {skill_data['total_time']:.2f} hours")
    print("Logs:")
    if not skill_data["logs"]:
        print("  No logs yet.")
    else:
        for log in skill_data["logs"]:
            print(f"  [{log['date']}] {log['time_spent']:.2f} hours: {log['note']}")
    print("-------------------------")

def list_skills():
    data = load_data()
    if not data:
        print("No skills tracked yet.")
        return

    print("\n--- Tracked Skills ---")
    for skill_name, skill_data in data.items():
        print(f"- {skill_name} (Total: {skill_data['total_time']:.2f} hours)")
    print("----------------------")

def main():
    parser = argparse.ArgumentParser(description="A simple skill tracker.")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Add command
    add_parser = subparsers.add_parser("add", help="Add a new skill to track.")
    add_parser.add_argument("skill_name", type=str, help="The name of the skill to add.")

    # Log command
    log_parser = subparsers.add_parser("log", help="Log time spent on a skill.")
    log_parser.add_argument("skill_name", type=str, help="The name of the skill.")
    log_parser.add_argument("--time", type=float, required=True, help="Time spent in hours (e.g., 1.5).")
    log_parser.add_argument("--note", type=str, default="", help="A note about the session.")

    # Show command
    show_parser = subparsers.add_parser("show", help="Show details for a specific skill.")
    show_parser.add_argument("skill_name", type=str, help="The name of the skill.")

    # List command
    list_parser = subparsers.add_parser("list", help="List all tracked skills.")

    args = parser.parse_args()

    if args.command == "add":
        add_skill(args.skill_name)
    elif args.command == "log":
        log_time(args.skill_name, args.time, args.note)
    elif args.command == "show":
        show_skill(args.skill_name)
    elif args.command == "list":
        list_skills()
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
