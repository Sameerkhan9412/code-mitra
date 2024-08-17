const User = require ('../models/Users');
const mailSender = require ('../utils/mailSender');
const bcrypt = require ('bcrypt');

// reset password token
exports.resetPasswordToken = async (req, res) => {
  try {
    // get email
    const email = req.body;
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
      `Password reset link","Password Reset Link:${url}`
    );
    return res.status (200).json ({
      success: true,
      message: 'Email sent successfully , please check email and change password',
    });
  } catch (error) {
    return res.status (500).json ({
      success: false,
      message: 'something went wrong while sending reset password mail',
    });
  }
};

// reset password
exports.resetPassword = async (req, res) => {
  try {
    // data fetch
    //frontend ne token body me daal diya
    const {password, confirmPassword, body} = req.body;
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
    const hashedPassword = bcrypt.hash (password, 10);
    // update password
    await User.findByIdAndUpdate (
      {
        token: token,
      },
      {
        password: hashedPassword,
      },
      {new: true}
    );
    // return resp
    return res.status (200).json ({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    return res.status (500).json ({
      success: false,
      message: 'something went wrong , try again',
    });
  }
};
