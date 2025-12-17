import os
import json
import sys

from dotenv import load_dotenv
from plaid import ApiClient, Configuration, Environment
from plaid.api import plaid_api
# Import the explicit Model objects needed for Plaid's new SDK style
from plaid.model.sandbox_public_token_create_request import SandboxPublicTokenCreateRequest
from plaid.model.sandbox_public_token_create_request_options import SandboxPublicTokenCreateRequestOptions
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.products import Products
from plaid.model.country_code import CountryCode

# 1. Load Environment Variables
load_dotenv()

# --- Plaid Initialization ---
configuration=Configuration(
    host=Environment.Sandbox,
    api_key={
        'clientId': os.getenv('PLAID_CLIENT_ID'),
        'secret': os.getenv('PLAID_SECRET'),
        'plaidVersion':'2020-09-14'
    }
)

api_client = ApiClient(configuration)
client = plaid_api.PlaidApi(api_client)

# --- Define Constants ---
INSTITUTION_ID = os.getenv('PLAID_INSTITUTION_ID')
ACCESS_TOKEN = None
PRODUCTS = [p.strip() for p in os.getenv('PLAID_PRODUCTS').split(',')]
from plaid.model.accounts_get_request import AccountsGetRequest

# --- Core Functionality ---

def create_link_token():
  global ACCESS_TOKEN
  try:
    pt_request = SandboxPublicTokenCreateRequest(
      institution_id=INSTITUTION_ID,
      initial_products=[Products('transactions')]
    )
    pt_response = client.sandbox_public_token_create(pt_request)
    exchange_request = ItemPublicTokenExchangeRequest(
        public_token=pt_response['public_token'],
    )
    
    exchange_response = client.item_public_token_exchange(exchange_request)
    
    ACCESS_TOKEN = exchange_response['access_token']
    print(f"  -> Exchange Token Created: {ACCESS_TOKEN}", file=sys.stderr)
  except Exception as e:
    print(f"Error Generating token: {e}", file=sys.stderr)
    return None

def fetch_accounts_data(access_token):
    if not access_token:
        print("\nCannot fetch accounts: Access Token is missing.", file=sys.stderr)
        return None

    print("\n3. Fetching Accounts and Balances...", file=sys.stderr)
    
    accounts_request = AccountsGetRequest(access_token=access_token)
    
    try:
        accounts_response = client.accounts_get(accounts_request)
        accounts = accounts_response['accounts']

        print(f"\n✅ SUCCESS: Found {len(accounts)} accounts.", file=sys.stderr)
        
        accounts_data = []
        for account in accounts:
            balance = account['balances']['available'] if account['balances']['available'] is not None else account['balances']['current']
            account_info = {
                "name": account['name'],
                "subtype": account['subtype'].value,
                "balance": balance,
                "currency": account['balances']['iso_currency_code']
            }
            accounts_data.append(account_info)
        
        return accounts_data
            
    except Exception as e:
        print(f"Error fetching accounts: {e}", file=sys.stderr)
        return None


if __name__ == '__main__':
    create_link_token()
    accounts_json_data = fetch_accounts_data(ACCESS_TOKEN)
    if accounts_json_data is not None:
      # Print the final JSON data to stdout
      print(json.dumps(accounts_json_data, indent=2))
