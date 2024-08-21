const otpTemplate = (otp) => {
	return `<!DOCTYPE html>
	<html>
	<head>
		<meta charset="UTF-8">
		<title>OTP Verification Email</title>
	</head>
	
	<body>
		<div class="container">
			${otp}
		</div>
	</body>
	
	</html>`;
};
module.exports = otpTemplate;