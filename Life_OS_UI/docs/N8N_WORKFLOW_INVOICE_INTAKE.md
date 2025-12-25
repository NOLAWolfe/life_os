# n8n Workflow Blueprint: Invoice Intake

This document outlines the logic for the automated invoice intake pipeline for Life.io.

## 1. Trigger: Gmail (or IMAP)
*   **Node:** `Gmail Trigger`
*   **Filter:** `label:INBOX`, `has:attachment`
*   **Credentials:** OAuth2 (Scoped to Read/Write)
*   **Download Attachments:** `True`

## 2. Security Filter (Privacy Spike)
*   **Node:** `Filter`
*   **Conditions:**
    *   `Attachment MIME Type` contains `application/pdf`
    *   (Optional) `Sender` exists in `Life.io Database`
*   **Action on Fail:** Discard (or move to "Unknown" folder in Gmail).

## 3. Client Lookup (Database)
*   **Node:** `HTTP Request` (GET `/api/social/clients`)
*   **Logic:**
    *   Search for a client where `invoiceEmail` matches the incoming email `From` address.
    *   If no match found, create a "Ghost Client" or flag as `Unknown Source`.

## 4. OCR Extraction (Veryfi / Mindee)
*   **Node:** `Mindee` (or generic HTTP Request to OCR service)
*   **Inputs:** Binary PDF File.
*   **Outputs:** JSON (Total, Date, Vendor, Line Items).

## 5. Life.io Ingestion
*   **Node:** `HTTP Request` (POST `/api/social/invoices`)
*   **Payload:**
    ```json
    {
      "clientId": "LOOKUP_RESULT_ID",
      "number": "EXTRACTED_INV_NUMBER",
      "status": "Review",
      "source": "Email",
      "originId": "GMAIL_MESSAGE_ID",
      "totalAmount": "EXTRACTED_TOTAL",
      "items": "EXTRACTED_LINE_ITEMS_JSON",
      "notes": "Automated intake from: sender@email.com"
    }
    ```

## 6. Notification
*   **Node:** `Discord` or `PWA Push`
*   **Message:** "New invoice received from [Client Name]. Ready for review in Business Hub."
