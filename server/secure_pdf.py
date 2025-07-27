# server/secure_pdf.py
import sys
import os
from pypdf import PdfReader, PdfWriter

def add_password_to_pdf(input_path, output_path, password):
    """
    Reads a PDF, encrypts it with a password, and saves it.
    """
    try:
        reader = PdfReader(input_path)
        writer = PdfWriter()

        # Add all pages from the original PDF to the new one
        for page in reader.pages:
            writer.add_page(page)

        # Encrypt the new PDF with the provided password
        writer.encrypt(password)

        # Save the new, password-protected PDF
        with open(output_path, "wb") as f:
            writer.write(f)

        print(f"Successfully secured {input_path}")
        return True
    except Exception as e:
        print(f"An error occurred while securing the PDF: {e}")
        return False

if __name__ == "__main__":
    # Expects three command-line arguments: input_path, output_path, password
    if len(sys.argv) != 4:
        print("Usage: python secure_pdf.py <input_pdf_path> <output_docx_path> <password>")
        sys.exit(1)

    input_pdf = sys.argv[1]
    output_pdf = sys.argv[2]
    password = sys.argv[3]

    if not os.path.exists(input_pdf):
        print(f"Error: The file '{input_pdf}' was not found.")
        sys.exit(1)

    add_password_to_pdf(input_pdf, output_pdf, password)