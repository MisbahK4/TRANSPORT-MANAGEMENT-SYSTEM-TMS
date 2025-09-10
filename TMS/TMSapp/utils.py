# TMSapp/utils.py
import io
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from django.core.mail import EmailMessage
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import inch

def generate_invoice_pdf(invoice):
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    # ---------- Header ----------
    p.setFont("Helvetica-Bold", 24)
    p.drawString(50, height - 50, invoice.package.user.company_name or invoice.package.user.username)

    p.setFont("Helvetica", 12)
    p.drawString(50, height - 80, f"Owner: {invoice.package.user.username}")
    p.drawString(50, height - 100, f"Email: {invoice.package.user.email}")
    p.drawString(50, height - 120, f"Phone: {invoice.package.user.phone_no or 'N/A'}")

    # ---------- Invoice Title ----------
    p.setFont("Helvetica-Bold", 22)
    p.drawString(400, height - 50, "INVOICE")

    # ---------- Invoice Info ----------
    p.setFont("Helvetica", 12)
    p.drawString(400, height - 80, f"Invoice #: {invoice.invoice_number}")
    p.drawString(400, height - 100, f"Issue Date: {invoice.issue_at.strftime('%Y-%m-%d')}")
    p.drawString(400, height - 120, f"Status: {'Paid' if invoice.paid else 'Unpaid'}")

    # ---------- Receiver Info ----------
    p.setFont("Helvetica-Bold", 14)
    p.drawString(50, height - 170, "Bill To:")
    p.setFont("Helvetica", 12)
    p.drawString(50, height - 190, f"Name: {invoice.transporter.username}")
    p.drawString(50, height - 210, f"Email: {invoice.transporter.email}")
    p.drawString(50, height - 230, f"Phone: {invoice.transporter.phone_no or 'N/A'}")

    # ---------- Package Details Table ----------
    p.setFont("Helvetica-Bold", 14)
    p.drawString(50, height - 270, "Package Details:")

    # Table headers
    y = height - 290
    p.setFont("Helvetica-Bold", 12)
    p.drawString(50, y, "Title")
    p.drawString(200, y, "Pickup")
    p.drawString(350, y, "Drop")
    p.drawString(450, y, "Weight")
    p.drawString(520, y, "Price")

    # Table content
    y -= 20
    p.setFont("Helvetica", 12)
    p.drawString(50, y, invoice.package.title or "Untitled")
    p.drawString(200, y, invoice.package.pickup_location or "N/A")
    p.drawString(350, y, invoice.package.drop_location or "N/A")
    p.drawString(450, y, f"{invoice.package.weight} kg" if invoice.package.weight else "N/A")
    p.drawString(520, y, f"₹{invoice.amount}")

    # ---------- Footer ----------
    p.setFont("Helvetica-Oblique", 10)
    p.setFillColor(colors.grey)
    p.drawString(50, 50, "Thank you for using TMSapp. We appreciate your business!")

    p.showPage()
    p.save()
    buffer.seek(0)
    return buffer

def send_invoice_email(invoice, pdf_buffer, owner_email):
    """
    Sends invoice PDF to transporter via email.
    Email is sent from your system Gmail account,
    but reply-to goes directly to the Owner.
    """
    email = EmailMessage(
        subject=f"Invoice #{invoice.invoice_number}",
        body=f"Dear {invoice.transporter.username},\n\nPlease find attached your invoice for package '{invoice.package.title}'.",
        from_email="yourappsender@gmail.com",  # system sender email
        to=[invoice.transporter.email],  # transporter email
        reply_to=[owner_email],  # replies go to the Owner directly
    )
    email.attach(
        filename=f"invoice_{invoice.invoice_number}.pdf",
        content=pdf_buffer.getvalue(),
        mimetype="application/pdf",
    )
    email.send()