import json
import argparse
import os
import random

DATA_FILE = os.path.join(os.path.dirname(__file__), 'content_data.json')

# Templates for idea generation
IDEA_TEMPLATES = [
    "Tutorial: How to {verb} with {noun}",
    "A review of {noun}",
    "My top 5 tips for {gerund}",
    "A day in the life of a {role}",
    "Behind the scenes of {activity}",
    "A common mistake to avoid when {gerund}",
    "My workflow for {activity}",
    "Deep Dive: The art of {gerund}",
    "Q&A session about {topic}",
    "Comparing {noun} vs. {noun}"
]

# Example placeholders for each topic
TOPIC_KEYWORDS = {
    "DJing": {
        "verb": ["mix", "scratch", "beatmatch"],
        "noun": ["a new controller", "Serato", "a classic track"],
        "gerund": ["mixing", "beatmatching", "preparing a set"],
        "role": ["DJ", "turntablist"],
        "activity": ["a DJ set", "organizing my library"],
        "topic": "DJing"
    },
    "Music Production": {
        "verb": ["produce", "master", "mix"],
        "noun": ["a new plugin", "Ableton Live", "a synth"],
        "gerund": ["producing", "mastering", "sound design"],
        "role": ["music producer", "sound engineer"],
        "activity": ["a new track", "a mastering session"],
        "topic": "Music Production"
    },
    "Quality Automation": {
        "verb": ["automate", "test", "debug"],
        "noun": ["a new framework", "Selenium", "a test suite"],
        "gerund": ["automating", "testing", "debugging"],
        "role": ["QA analyst", "automation engineer"],
        "activity": ["a test run", "a bug hunt"],
        "topic": "Quality Automation"
    },
    "Fatherhood": {
        "verb": ["manage", "balance", "prepare for"],
        "noun": ["a newborn", "a toddler", "family life"],
        "gerund": ["parenting", "balancing work and family"],
        "role": ["dad", "father"],
        "activity": ["a family outing", "a bedtime routine"],
        "topic": "Fatherhood"
    },
     "Cooking": {
        "verb": ["cook", "prepare", "grill"],
        "noun": ["a new recipe", "a steak", "a cast iron pan"],
        "gerund": ["cooking", "meal prepping", "grilling"],
        "role": ["home cook", "chef"],
        "activity": ["a dinner party", "a weekly meal prep"],
        "topic": "Cooking"
    }
}


def load_data():
    if not os.path.exists(DATA_FILE):
        return {"topics": [], "saved_ideas": []}
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

def add_topic(topic):
    data = load_data()
    if topic not in data["topics"]:
        data["topics"].append(topic)
        save_data(data)
        print(f"Topic '{topic}' added.")
    else:
        print(f"Topic '{topic}' already exists.")

def list_topics():
    data = load_data()
    if not data["topics"]:
        print("No topics added yet.")
        return
    print("\n--- Topics ---")
    for topic in data["topics"]:
        print(f"- {topic}")
    print("----------------")

def generate_ideas(topic, number=5):
    if topic not in TOPIC_KEYWORDS:
        print(f"I don't have specific idea templates for '{topic}' yet, but you can still add it as a topic.")
        return

    keywords = TOPIC_KEYWORDS[topic]
    generated_ideas = set() # Use a set to avoid duplicate ideas

    while len(generated_ideas) < number:
        template = random.choice(IDEA_TEMPLATES)
        idea = template.format(
            verb=random.choice(keywords.get("verb", [""])),
            noun=random.choice(keywords.get("noun", [""])),
            gerund=random.choice(keywords.get("gerund", [""])),
            role=random.choice(keywords.get("role", [""])),
            activity=random.choice(keywords.get("activity", [""])),
            topic=keywords.get("topic", "")
        )
        generated_ideas.add(idea)

    print(f"\n--- Ideas for {topic} ---")
    for idea in generated_ideas:
        print(f"- {idea}")
    print("--------------------------")

def save_idea(idea_text):
    data = load_data()
    # Simple check to avoid duplicates
    for idea in data["saved_ideas"]:
        if idea["idea"] == idea_text:
            print("This idea is already saved.")
            return

    new_id = max([idea.get("id", 0) for idea in data["saved_ideas"]] + [0]) + 1
    data["saved_ideas"].append({"id": new_id, "idea": idea_text, "status": "saved"})
    save_data(data)
    print(f"Saved idea: '{idea_text}'")

def list_ideas():
    data = load_data()
    if not data["saved_ideas"]:
        print("No ideas saved yet.")
        return

    print("\n--- Saved Ideas ---")
    for idea in data["saved_ideas"]:
        print(f"[{idea['id']}] {idea['idea']} (Status: {idea['status']})")
    print("---------------------")


def main():
    parser = argparse.ArgumentParser(description="A content idea generator.")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Add Topic command
    add_topic_parser = subparsers.add_parser("add-topic", help="Add a new topic for content creation.")
    add_topic_parser.add_argument("topic", type=str, help="The name of the topic (e.g., DJing, Fatherhood).")

    # List Topics command
    list_topics_parser = subparsers.add_parser("list-topics", help="List all topics.")

    # Generate Ideas command
    generate_ideas_parser = subparsers.add_parser("generate-ideas", help="Generate content ideas for a topic.")
    generate_ideas_parser.add_argument("topic", type=str, help="The topic to generate ideas for.")

    # Save Idea command
    save_idea_parser = subparsers.add_parser("save-idea", help="Save a generated idea.")
    save_idea_parser.add_argument("idea_text", type=str, help="The full text of the idea to save.")

    # List Ideas command
    list_ideas_parser = subparsers.add_parser("list-ideas", help="List all saved ideas.")

    args = parser.parse_args()

    if args.command == "add-topic":
        add_topic(args.topic)
    elif args.command == "list-topics":
        list_topics()
    elif args.command == "generate-ideas":
        generate_ideas(args.topic)
    elif args.command == "save-idea":
        save_idea(args.idea_text)
    elif args.command == "list-ideas":
        list_ideas()
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
