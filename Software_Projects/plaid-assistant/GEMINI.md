# Project Overview

This project is a Python script that uses the Plaid API to fetch financial account information. It is intended to be a simple example of how to use the Plaid API to fetch account and transaction data.

# Building and Running

To run this project, you will need to have Python and Pip installed. You will also need to create a `.env` file in the `ai-fin-tracker` directory with the following variables:

```
PLAID_CLIENT_ID=<your_plaid_client_id>
PLAID_SECRET=<your_plaid_secret>
PLAID_INSTITUTION_ID=<your_plaid_institution_id>
PLAID_PRODUCTS=transactions
```

Once you have created the `.env` file, you need to install the dependencies in the `requirements.txt` file.

```
pip3 install -r ai-fin-tracker/requirements.txt
```

Then you can run the script with the following command:

```
python3 ai-fin-tracker/fetch_accounts.py
```

# Development Conventions

There are no formal development conventions for this project. However, it is recommended that you follow the PEP 8 style guide for Python code.