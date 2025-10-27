You are an Invoice Data Extraction Expert. Please carefully analyze the provided **Lenovo invoice image** and extract all key information into the following structured format.

**Important Instructions:**
1. Extract information exactly as it appears on the invoice
2. If a field is explicitly present but its value is blank or "Not Provided", extract it as an empty string or "Not Provided"
3. If a field is not present on the invoice, mark it as "**Not Applicable**"
4. For addresses, extract the full multi-line address as a single string, preserving line breaks if possible, or separating with commas
5. For product details, extract all sub-details (Serial Number, SO Number, etc.) under the "Description" field
6. Currency is MYR (Malaysian Ringgit)

**Please output the extracted information in a clear Markdown table format:**

| Field Name | Extracted Value or Note |
| :--- | :--- |
| **Invoice Header** | |
| Company Logo | Lenovo |
| Document Title | |
| Registered Address | |
| Registered Phone | |
| Registered Fax | |
| Company Name (Seller) | |
| SST Registration No. (Seller) | |
| Invoice No | |
| Invoice Date | |
| Payment Term | |
| Due Date | |
| Billing Type | |
| Document Type Indicator | |
| **Sold To / Invoice To / Ship To** | |
| Sold To Company Name | |
| Sold To ATTN | |
| Sold To Address | |
| Invoice To Company Name | |
| Invoice To ATTN | |
| Invoice To Address | |
| Ship To Company Name | |
| Ship To ATTN | |
| Ship To Address | |
| **Other Details** | |
| Contact for Questions (Write) | |
| SAP Customer No. | |
| Customer SST# | |
| Lenovo Order No. | |
| PO No | |
| Shipping Condition | |
| Financing/Leasing Approval No. | |
| Remark | |
| **Product Details** | |
| Product Table Headers | Product, Description, Qty, Unit Price, SST Tax Value, SST Rate, Amount |
| Product Line Item 1 - Product | |
| Product Line Item 1 - Description | |
| Product Line Item 1 - Serial Number | |
| Product Line Item 1 - PO number | |
| Product Line Item 1 - SO Number | |
| Product Line Item 1 - L-Number-Date | |
| Product Line Item 1 - UPS-Number | |
| Product Line Item 1 - Qty | |
| Product Line Item 1 - Unit Price | |
| Product Line Item 1 - SST Tax Value | |
| Product Line Item 1 - SST Rate | |
| Product Line Item 1 - Amount | |
| **Summary of Charges** | |
| Subtotal of Products | |
| Value Added Services | |
| Shipping and Handling Services | |
| Total of Products and All Services | |
| Total Services Tax (SST Rate: 8.00%) | |
| Total Including Taxes | |
| Rewards Applied | |
| Amount Payable | |
| **Payment Instructions** | |
| Invoice Basis | |
| Payment by Wire - Beneficiary Name | |
| Payment by Wire - Bank Name | |
| Payment by Wire - Bank Account No. | |
| Payment by Wire - SWIFT Code | |
| Payment by Check/Post To - Attention | |
| Payment by Check/Post To - Company Name | |
| Payment by Check/Post To - Address | |
| **Footer** | |
| Legal Disclaimer | |
| Document Purpose | |
| Page Number | |
| Automation Note | |

---

**Invoice Image Analysis**: Please refer to the attached Lenovo invoice image for detailed analysis and data extraction.