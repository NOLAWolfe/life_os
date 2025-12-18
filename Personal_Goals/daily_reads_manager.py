import json
import os
from datetime import datetime

DATA_FILE = os.path.join(os.path.dirname(__file__), 'daily_reads.json') # Changed to daily_reads.json

def load_data():
    if not os.path.exists(DATA_FILE) or os.stat(DATA_FILE).st_size == 0:
        return {"reading_items": []} # Simplified initial structure
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def add_reading_item(item_type, title, **kwargs):
    data = load_data()
    
    new_id = 1
    if data["reading_items"]:
        new_id = max(item.get("id", 0) for item in data["reading_items"]) + 1

    new_item = {
        "id": new_id,
        "type": item_type,
        "title": title, # Title is always required unless it's a quote
        "status": kwargs.get("status", "not started"),
        "last_updated": datetime.now().strftime("%Y-%m-%d")
    }
    
    if item_type == "book":
        new_item.update({
            "author": kwargs.get("author"),
            "link": kwargs.get("link"),
            "progress_unit": "Chapter",
            "current_progress": kwargs.get("current_progress", 0),
            "total_progress": kwargs.get("total_progress"),
            "tags": kwargs.get("tags", ["book"])
        })
    elif item_type == "certification":
        new_item.update({
            "source": kwargs.get("source"),
            "link": kwargs.get("link"),
            "progress_unit": "Module",
            "current_progress": kwargs.get("current_progress", 0),
            "total_progress": kwargs.get("total_progress"),
            "tags": kwargs.get("tags", ["certification"]),
            "target_completion_date": kwargs.get("target_completion_date")
        })
    elif item_type == "article":
        new_item.update({
            "source": kwargs.get("source"),
            "link": kwargs.get("link"),
            "progress_unit": "article",
            "current_progress": kwargs.get("current_progress", 0),
            "total_progress": kwargs.get("total_progress", 1),
            "tags": kwargs.get("tags", ["article"])
        })
    elif item_type == "quote": # For quotes, title is optional, content is primary
        new_item["title"] = title if title else "Quote" # Use content as title if title not provided
        new_item.update({
            "content": kwargs.get("content"),
            "author": kwargs.get("author"),
            "tags": kwargs.get("tags", ["motivation"])
        })
        new_item.pop("title", None) # Remove title if quote specific content is used for display
    
    data["reading_items"].append(new_item)
    save_data(data)
    print(f"Added new {item_type}: '{new_item.get('title', new_item.get('content'))}' with ID {new_id}")
    return new_item

def update_reading_item(item_id, **kwargs):
    data = load_data()
    found = False
    for item in data["reading_items"]:
        if item.get("id") == item_id:
            for key, value in kwargs.items():
                if key in item: # Only update existing keys for safety
                    item[key] = value
            item["last_updated"] = datetime.now().strftime("%Y-%m-%d")
            found = True
            break
    if found:
        save_data(data)
        print(f"Updated item ID {item_id}.")
    else:
        print(f"Item with ID {item_id} not found.")

def delete_reading_item(item_id):
    data = load_data()
    initial_count = len(data["reading_items"])
    data["reading_items"] = [item for item in data["reading_items"] if item.get("id") != item_id]
    if len(data["reading_items"]) < initial_count:
        save_data(data)
        print(f"Deleted item ID {item_id}.")
    else:
        print(f"Item with ID {item_id} not found.")

def list_reading_items(item_type=None, status=None, tag=None):
    data = load_data()
    items = data["reading_items"]
    
    if item_type:
        items = [item for item in items if item.get("type") == item_type]
    if status:
        items = [item for item in items if item.get("status") == status]
    if tag:
        items = [item for item in items if tag in item.get("tags", [])]

    if not items:
        print("\nNo reading items found matching criteria.")
        return items

    print("\n--- Daily Reads ---")
    for item in items:
        print(f"ID: {item.get('id')}")
        print(f"Type: {item.get('type')}")
        # Display title for most, content for quotes
        display_title = item.get('title')
        if item.get('type') == 'quote' and item.get('content'):
            display_title = item['content']
        print(f"Title/Content: {display_title}")

        if item.get('author'):
            print(f"Author: {item['author']}")
        if item.get('source'):
            print(f"Source: {item['source']}")
        
        if item.get('progress_unit'):
            current = item.get('current_progress', 0)
            total = item.get('total_progress', 'N/A')
            print(f"Progress: {current} {item['progress_unit']}(s) / {total} {item['progress_unit']}(s)")
        
        print(f"Status: {item.get('status')}")
        if item.get('tags'):
            print(f"Tags: {', '.join(item['tags'])}")
        if item.get('link'):
            print(f"Link: {item['link']}")
        if item.get('target_completion_date'):
            print(f"Target Completion: {item['target_completion_date']}")
        print(f"Last Updated: {item.get('last_updated')}")
        print("-" * 20)
    return items

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Manage daily reading and learning items for Life.io dashboard.")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Add item
    add_parser = subparsers.add_parser("add", help="Add a new reading item.")
    add_parser.add_argument("type", choices=["book", "certification", "article", "quote"], help="Type of reading item.")
    add_parser.add_argument("--title", help="Title of the item (for books, certifications, articles). For quotes, this can be empty or a short identifier, content should be used for the quote itself.")
    add_parser.add_argument("--content", help="Content for quotes.")
    add_parser.add_argument("--author", help="Author of the book/quote.")
    add_parser.add_argument("--source", help="Source of the article/certification.")
    add_parser.add_argument("--link", help="URL link to the item.")
    add_parser.add_argument("--current_progress", type=int, default=0, help="Current progress (e.g., chapter number, module number).")
    add_parser.add_argument("--total_progress", type=int, help="Total progress units.")
    add_parser.add_argument("--status", default="not started", help="Status of the item (e.g., 'not started', 'in progress', 'completed').")
    add_parser.add_argument("--tags", nargs='*', help="Space-separated tags.")
    add_parser.add_argument("--target_completion_date", help="Target completion date (YYYY-MM-DD).")

    # Update item
    update_parser = subparsers.add_parser("update", help="Update an existing reading item.")
    update_parser.add_argument("id", type=int, help="ID of the item to update.")
    update_parser.add_argument("--title", help="New title.")
    update_parser.add_argument("--content", help="New content for quotes.")
    update_parser.add_argument("--author", help="New author.")
    update_parser.add_argument("--source", help="New source.")
    update_parser.add_argument("--link", help="New URL link.")
    update_parser.add_argument("--current_progress", type=int, help="New current progress.")
    update_parser.add_argument("--total_progress", type=int, help="New total progress units.")
    update_parser.add_argument("--status", help="New status.")
    update_parser.add_argument("--tags", nargs='*', help="New space-separated tags.")
    update_parser.add_argument("--target_completion_date", help="New target completion date (YYYY-MM-DD).")

    # Delete item
    delete_parser = subparsers.add_parser("delete", help="Delete a reading item.")
    delete_parser.add_argument("id", type=int, help="ID of the item to delete.")

    # List items
    list_parser = subparsers.add_parser("list", help="List reading items.")
    list_parser.add_argument("--type", choices=["book", "certification", "article", "quote"], help="Filter by item type.")
    list_parser.add_argument("--status", help="Filter by item status.")
    list_parser.add_argument("--tag", help="Filter by tag.")

    args = parser.parse_args()
    
    # Dynamically extract non-None arguments for add/update
    # For 'add' command, 'type' is positional and required, handle separately
    if args.command == "add":
        kwargs = {k: v for k, v in vars(args).items() if v is not None and k not in ["command", "type"]}
        # Special handling for quotes where 'content' is primary and 'title' can be absent
        if args.type == "quote":
            add_reading_item(args.type, title=args.title, **kwargs)
        elif args.title: # Title is required for other types
            add_reading_item(args.type, args.title, **kwargs)
        else:
            print(f"Error: Title is required for item type '{args.type}' unless it's a quote (use --content).")
    elif args.command == "update":
        update_kwargs = {k: v for k, v in vars(args).items() if v is not None and k not in ["command", "id"]}
        update_reading_item(args.id, **update_kwargs)
    elif args.command == "delete":
        delete_reading_item(args.id)
    elif args.command == "list":
        list_reading_items(args.type, args.status, args.tag)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
