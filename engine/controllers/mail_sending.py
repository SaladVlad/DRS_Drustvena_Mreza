import smtplib
from email.mime.text import MIMEText

"""
    email_sender = "dusantomicroki@gmail.com"
    email_password = "qwqluufqdfdzlrmx"  # Koristite generisanu App Password
    email_receiver = "t9userdrs@gmail.com"
    """ 

"""
        GOOGLE ACC za dedicated user mail na koji stizu sve  notifikacije:
        username: t9userdrs@gmail.com
        password: t9userdrs123
        app password key: vugdwgfptdcsfdtb

        GOOGLE ACC za dedicated admin mail na koji stizu sve  notifikacije:
        username: t9adrs@gmail.com
        password: t9admindrs123
        app password key: vbnrhybdmzozrcxe

"""

def send_mail_when_registered(username, password):
    email_sender = "t9adrs@gmail.com"
    email_password = "vbnrhybdmzozrcxe"  # Koristite generisanu App Password
    email_receiver = "t9userdrs@gmail.com"
    
    # Poruka
    msg = MIMEText(f"Hello new user!\nThis is your username: {username} and password: {password}\nThank you for using our app")
    msg['Subject'] = f"[ACC CREATED] - {username}"
    msg['From'] = email_sender
    msg['To'] = email_receiver

    # Slanje emaila
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(email_sender, email_password)
            server.sendmail(email_sender, email_receiver, msg.as_string())
            print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")

def send_mail_when_new_post(username):
    email_sender = "t9userdrs@gmail.com"
    email_password = "vugdwgfptdcsfdtb"  # Koristite generisanu App Password
    email_receiver = "t9adrs@gmail.com" 


    # Poruka
    msg = MIMEText(f"Hello dear admin!\nUser with username {username} has created a new post.")
    msg['Subject'] = f"[PENDING POST] - {username}"
    msg['From'] = email_sender
    msg['To'] = email_receiver

    # Slanje emaila
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(email_sender, email_password)
            server.sendmail(email_sender, email_receiver, msg.as_string())
            print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")


def send_mail_when_post_approved(username, post_content):
    email_sender = "t9adrs@gmail.com"
    email_password = "vbnrhybdmzozrcxe"  # Koristite generisanu App Password
    email_receiver = "t9userdrs@gmail.com"

    # Poruka
    msg = MIMEText(f"Hello dear {username}!\nYour post with content: {post_content} has been approved.\nThank you for using our app.")
    msg['Subject'] = f"[POST APPROVED] - {username}"
    msg['From'] = email_sender
    msg['To'] = email_receiver

    # Slanje emaila
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(email_sender, email_password)
            server.sendmail(email_sender, email_receiver, msg.as_string())
            print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")


def send_mail_when_post_rejected(username, post_content):
    email_sender = "t9adrs@gmail.com"
    email_password = "vbnrhybdmzozrcxe"  # Koristite generisanu App Password
    email_receiver = "t9userdrs@gmail.com"

    # Poruka
    msg = MIMEText(f"Hello dear {username}!\nYour post with content: {post_content} has been rejected.\nThank you for using our app.")
    msg['Subject'] = f"[POST REJECTED] - {username}"
    msg['From'] = email_sender
    msg['To'] = email_receiver

    # Slanje emaila
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(email_sender, email_password)
            server.sendmail(email_sender, email_receiver, msg.as_string())
            print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")


def send_mail_when_blocked(username):
    email_sender = "t9adrs@gmail.com"
    email_password = "vbnrhybdmzozrcxe"  # Koristite generisanu App Password
    email_receiver = "t9userdrs@gmail.com"

    # Poruka
    msg = MIMEText(f"Hello dear {username}!\nYou have been blocked by administration, beacuse of the three rejected posts.\nAdministration will contanct you again when they complete the unblocking procedure.\nThank you for using our app.")
    msg['Subject'] = f"[BLOCKED] - {username}"
    msg['From'] = email_sender
    msg['To'] = email_receiver

    # Slanje emaila
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(email_sender, email_password)
            server.sendmail(email_sender, email_receiver, msg.as_string())
            print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")


def send_mail_when_unblocked(username):
    email_sender = "t9adrs@gmail.com"
    email_password = "vbnrhybdmzozrcxe"  # Koristite generisanu App Password
    email_receiver = "t9userdrs@gmail.com"

    # Poruka
    msg = MIMEText(f"Hello dear {username}!\nYou have been unblocked by administration\nFeel free to make posts and new friendships again.\nThank you for using our app.")
    msg['Subject'] = f"Unblocked {username}"
    msg['From'] = email_sender
    msg['To'] = email_receiver

    # Slanje emaila
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(email_sender, email_password)
            server.sendmail(email_sender, email_receiver, msg.as_string())
            print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")
    
