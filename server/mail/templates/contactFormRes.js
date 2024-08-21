exports.contactUsEmail = (
    email,
    firstname,
    lastname,
    message,
    phoneNo,
    countrycode
  ) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Contact Form Confirmation</title>
    </head>
    
    <body>
        <div class="container">
            <div class="body">
                <p>Dear ${firstname} ${lastname},</p>
                <p>Thank you for contacting us. We have received your message and will respond to you as soon as possible.
                </p>
                <p>Here are the details you provided:</p>
                <p>Name: ${firstname} ${lastname}</p>
                <p>Email: ${email}</p>
                <p>Phone Number: ${phoneNo}</p>
                <p>Message: ${message}</p>
                <p>We appreciate your interest and will get back to you shortly. </p>
            </div>
        </div>
    </body>
    
    </html>`
  }