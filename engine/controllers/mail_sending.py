import smtplib
from email.mime.text import MIMEText
from .logging import create_log

from dotenv import load_dotenv
import os
load_dotenv()

# Main email sender credentials
email_sender = os.getenv("MAIL_SENDER")
email_password = os.getenv("MAIL_SENDER_KEY")

admin_mail = os.getenv("ADMIN_MAIL")

def send_mail(subject, body, receiver_email):
    """
    Sends an email with the specified subject and body to the receiver_email.
    """
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = email_sender
    msg['To'] = receiver_email

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(email_sender, email_password)
            server.sendmail(email_sender, receiver_email, msg.as_string())
            print(f"Email sent successfully to {receiver_email}!")
            create_log(f"Email sent to {receiver_email}", "EMAIL_SENT")
    except Exception as e:
        print(f"Failed to send email to {receiver_email}: {e}")

# Specific use cases
def send_mail_when_first_login(username, userID):
    subject = f"[FIRST LOGIN] - {username} - ID:{userID}"
    body = (f"Hello dear admin!\n"
            f"User with username: {username} and ID: {userID}  has logged in for the first time.\n")
    send_mail(subject, body, admin_mail)

def send_mail_when_registered(username, password, receiver_email):
    subject = f"[ACC CREATED] - {username}"
    body = (f"Hello new user!\n"
            f"This is your username: {username} and password: {password}\n"
            f"Thank you for using our app.")
    send_mail(subject, body, receiver_email)

def send_mail_when_new_post(username, userID):
    subject = f"[PENDING POST] - {username} - ID:{userID}"
    body = (f"Hello dear admin!\n"
            f"User with username: {username} and ID: {userID} has created a new post.")
    send_mail(subject, body, admin_mail)

def send_mail_when_post_approved(username, post_content, receiver_email):
    subject = f"[POST APPROVED] - {username}"
    body = (f"Hello dear {username}!\n"
            f"Your post with content: {post_content} has been approved.\n"
            f"Thank you for using our app.")
    send_mail(subject, body, receiver_email)

def send_mail_when_post_rejected(username, post_content, receiver_email):
    subject = f"[POST REJECTED] - {username}"
    body = (f"Hello dear {username}!\n"
            f"Your post with content: {post_content} has been rejected.\n"
            f"Thank you for using our app.")
    send_mail(subject, body, receiver_email)

def send_mail_when_blocked(username, receiver_email):
    subject = f"[BLOCKED] - {username}"
    body = (f"Hello dear {username}!\n"
            f"You have been blocked by administration because of three rejected posts.\n"
            f"Administration will contact you again once the unblocking procedure is complete.\n"
            f"Thank you for using our app.")
    send_mail(subject, body, receiver_email)

def send_mail_when_unblocked(username, receiver_email):
    subject = f"[UNBLOCKED] - {username}"
    body = (f"Hello dear {username}!\n"
            f"You have been unblocked by the administration.\n"
            f"Feel free to make posts and new friendships again.\n"
            f"Thank you for using our app.")
    send_mail(subject, body, receiver_email)