import smtplib
from email.mime.text import MIMEText

def send_mail(username, password):
    # Podaci o korisniku
    email_sender = "dusantomicroki@gmail.com"
    email_password = "qwqluufqdfdzlrmx"  # Koristite generisanu App Password
    email_receiver = "t9userdrs@gmail.com" 

    """
        GOOGLE ACC za dedicated mail na koji stizu sve notifikacije:
        username: t9userdrs@gmail.com
        password: t9userdrs123
    """


    # Poruka
    msg = MIMEText(f"Hello new user! This is your username: {username} and password: {password}\nThank you for using our app")
    msg['Subject'] = "Account created"
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


