"""Email service using Resend."""
import os
import logging

logger = logging.getLogger(__name__)


def _resend_configured() -> bool:
    return bool(os.environ.get("RESEND_API_KEY"))


async def send_admission_confirmation(
    to_email: str,
    student_name: str,
    application_number: str,
    class_applying: str,
):
    """Send admission application confirmation email."""
    if not _resend_configured():
        logger.warning("Resend not configured — skipping admission email to %s", to_email)
        return False

    try:
        import resend
        resend.api_key = os.environ["RESEND_API_KEY"]
        from_email = os.environ.get("RESEND_FROM_EMAIL", "The Foundation Academy <onboarding@resend.dev>")

        html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1E3A8A; color: white; padding: 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">The Foundation Academy</h1>
            <p style="margin: 8px 0 0; opacity: 0.9;">Admission Application Received</p>
          </div>
          <div style="padding: 32px 24px; background: #f8fafc;">
            <p>Dear Parent/Guardian,</p>
            <p>Thank you for applying to <strong>The Foundation Academy</strong>. We have received the admission application for:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr><td style="padding: 8px 0; color: #64748b;">Student Name</td><td style="padding: 8px 0; font-weight: bold;">{student_name}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Class Applying</td><td style="padding: 8px 0; font-weight: bold;">{class_applying}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Application Number</td><td style="padding: 8px 0; font-weight: bold; color: #1E3A8A;">{application_number}</td></tr>
            </table>
            <p>Please save your application number to track status online at our website.</p>
            <p>Our admissions team will review your application and contact you within 3–5 working days.</p>
            <p style="margin-top: 24px;">Warm regards,<br><strong>Admissions Team</strong><br>The Foundation Academy<br>Chandi Road, Harnaut, Nalanda, Bihar - 803110<br>📞 8986233963 | 9006876172</p>
          </div>
        </div>
        """

        resend.Emails.send({
            "from": from_email,
            "to": [to_email],
            "subject": f"Admission Application Received — {application_number}",
            "html": html,
        })
        return True
    except Exception as e:
        logger.error("Failed to send admission email: %s", e)
        return False


async def send_payment_confirmation(to_email: str, amount: float, description: str, receipt_id: str):
    """Send fee payment confirmation email."""
    if not _resend_configured():
        logger.warning("Resend not configured — skipping payment email to %s", to_email)
        return False

    try:
        import resend
        resend.api_key = os.environ["RESEND_API_KEY"]
        from_email = os.environ.get("RESEND_FROM_EMAIL", "The Foundation Academy <onboarding@resend.dev>")

        html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1E3A8A; color: white; padding: 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Payment Receipt</h1>
            <p style="margin: 8px 0 0; opacity: 0.9;">The Foundation Academy</p>
          </div>
          <div style="padding: 32px 24px; background: #f8fafc;">
            <p>Dear Parent/Guardian,</p>
            <p>Your fee payment has been successfully received. Details below:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr><td style="padding: 8px 0; color: #64748b;">Description</td><td style="padding: 8px 0; font-weight: bold;">{description}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Amount Paid</td><td style="padding: 8px 0; font-weight: bold; color: #16a34a;">₹{amount:,.2f}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Receipt ID</td><td style="padding: 8px 0; font-weight: bold;">{receipt_id}</td></tr>
            </table>
            <p>Thank you for your payment. For queries, contact us at 8986233963.</p>
          </div>
        </div>
        """

        resend.Emails.send({
            "from": from_email,
            "to": [to_email],
            "subject": f"Fee Payment Receipt — {receipt_id}",
            "html": html,
        })
        return True
    except Exception as e:
        logger.error("Failed to send payment email: %s", e)
        return False
