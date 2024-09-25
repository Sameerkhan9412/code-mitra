const User = require ('../models/Users');
const mailSender = require ('../utils/mailSender');
const bcrypt = require ('bcrypt');

// reset password token
exports.resetPasswordToken = async (req, res) => {
  try {
    // get email
    const {email} = req.body;
    // check user for this email
    const user = await User.findOne ({email: email});
    if (!user) {
      return res.status (402).json ({
        success: false,
        message: 'Your email is not registered with us',
      });
    }

    // generate token
    const token = crypto.randomUUID ();
    // update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate (
      {email: email},
      {
        token: token,
        resetPasswordExpires: Date.now () + 5 * 60 * 1000,
      },
      {
        new: true, //return updated document
      }
    );
    // create url
    const url = `http://localhost:3000/update-password/${token}`; //differnt different users ke liye different url hoga thwrough the help of token
    // send mail containing the url
    await mailSender (
      email,
    "Password reset link",`Dear ${user.firstName},<br>
I hope this email finds you well. We have received a request to reset the password for your account associated with the email address ${email} . If you did not initiate this request, please disregard this email.
<br>If you did request a password reset, please follow the instructions below to reset your password:<br>
<ol>
<li>Click on the following link to navigate to the password reset page: ${url}</li>
<li>On the password reset page, you will be prompted to enter a new password for your account.</li>
<li>Enter your new password and confirm it by typing it again.</li>
<li>Once you have entered and confirmed your new password, click the "Reset Password" button.</li>
</ol>

<p>Please note the following security tips:</p>
<ul>
<li>Choose a strong password that includes a combination of uppercase and lowercase letters, numbers, and symbols.</li>
<li>Do not share your password with anyone.</li>
<li>Regularly update your password for added security.</li>
</ul>
<span>If you encounter any issues during the password reset process or if you did not initiate this request, please contact our support team immediately. We are here to assist you.</span><br><br><br>
<span>Thank you for using our services. We appreciate your trust in us.</span> <br><br>
<span classname="font-bold">
Best regards, <br>Sameer khan <br>Code Mitra
</span>
`
    );
    return res.status (200).json ({
      success: true,
      message: 'Email sent successfully , please check email and change password',
    });
  } catch (error) {
    return res.status (500).json ({
      success: false,
      message: 'something went wrong while sending reset password mail',
      error:error.message
    });
  }
};

// reset password
exports.resetPassword = async (req, res) => {
  try {
    // data fetch
    //frontend ne token body me daal diya
    const {password, confirmPassword, token} = req.body;
    // validation
    if (!password || !confirmPassword) {
      return res.status (400).json ({
        success: false,
        message: 'please fill all fields',
      });
    }
    if (password != confirmPassword) {
      return res.status (400).json ({
        success: false,
        message: "password doesn't matched",
      });
    }
    // get userdetails from db using token
    const userDetails = await User.findOne ({token: token});
    console.log(userDetails)
    console.log(token)
    // if no entry->invalid token
    if (!userDetails) {
      return res.status (400).json ({
        success: false,
        message: 'token is invalid',
      });
    }
    // token time check
    if (userDetails.resetPasswordExpires < Date.now ()) {
      return res.status (400).json ({
        success: false,
        message: 'Token is expired,please regenerate your token',
      });
    }
    // hash password
    const hashedPassword = await bcrypt.hash (password, 10);
    console.log(hashedPassword)
    // update password
    console.log(token)
    const result=await User.findOneAndUpdate (
      {
        token: token,
      },
      {
        password: hashedPassword,
      },
      {new: true}
    );
    console.log(result);
    // return resp
    return res.status (200).json ({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    return res.status (500).json ({
      success: false,
      message: 'something went wrong , try again',
      error:error.message
    });
  }
};
