

exports.courseEnrollmentEmail = (courseName, name) => {
    const frontendUrl=process.env.REACT_APP_FRONTEND_URL;
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Course Registration Confirmation</title>
    </head>
    
    <body>
        <div class="container">
            <h1>Course enrolled</h1>
    </body>
    
    </html>`;
  };