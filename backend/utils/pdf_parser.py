import re
from io import BytesIO

from PyPDF2 import PdfReader


def extract_text_from_pdf(file_stream) -> str:
    reader = PdfReader(file_stream)
    pages = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            pages.append(text)
    return "\n".join(pages).strip()


def extract_contact_info(text: str) -> dict:
    email_match = re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", text)
    name = None
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    if lines:
        first_line = lines[0]
        if len(first_line.split()) <= 5 and "@" not in first_line:
            name = first_line

    return {
        "email": email_match.group(0) if email_match else None,
        "candidate_name": name,
    }
