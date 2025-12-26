#!/bin/bash

# MCP Health & Session Start Duties
# Ensures the Life_OS MCP stack is primed and ready.

echo "🔍 Auditing MCP Environment..."

# 1. SQLite Verification
DB_PATH="/Users/avenue17/Projects/Life_OS/Life_OS_UI/prisma/dev.db"
if [ -f "$DB_PATH" ]; then
    echo "✅ SQLite: Database found at $DB_PATH"
else
    echo "❌ SQLite: Database NOT found. Check your Prisma setup."
fi

# 2. Google Sheets Verification
GS_SERVICE="/Users/avenue17/Projects/Life_OS/.gemini/service.json"
GS_CREDS="/Users/avenue17/Projects/Life_OS/.gemini/credentials.json"
if [ -f "$GS_SERVICE" ] && [ -f "$GS_CREDS" ]; then
    echo "✅ Google Sheets: Auth files verified."
else
    echo "❌ Google Sheets: Missing service.json or credentials.json in .gemini/"
fi

# 3. Obsidian Verification
VAULT_PATH="/Users/avenue17/Projects/Life_OS/LifeVault"
if [ -d "$VAULT_PATH" ]; then
    echo "✅ Obsidian: Vault directory verified."
else
    echo "❌ Obsidian: Vault directory not found at $VAULT_PATH"
fi

# 4. Git Hygiene
echo "📈 Git Status:"
git status -s

echo "🚀 Environment primed. Ready for Session."
