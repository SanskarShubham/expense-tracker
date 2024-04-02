const User = require('../models/user');
const ForgotPassword = require('../models/forgotPassword');
const jwt = require('../utils/jwtToken');
const uuid = require('uuid')
var SibApiV3Sdk = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');

exports.postSignup = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  try {
    const isUserExist = await User.findOne({ where: { email: email } });

    if (isUserExist) {
      return res.status(403).json({
        status: false,
        error: 'This email id is already registered.',
      });
    }

    const hashPass = await bcrypt.hash(password, 10);

    // Store hash in your password DB.
    const userDetail = new User({ name: name, email: email, password: hashPass });
    userDetail.save();
    return res.status(200).json({ status: true, data: userDetail });
  } catch (error) {
    return res.status(500).json({ status: false, error: error });
  }

};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // console.log(req.body); 
  try {
    const user = await User.findOne({ email: email });

    console.log(user);
    if (!user) {
      return res.status(404).json({
        status: false,
        error: 'user does not exist.',
      });
    }
    // Load hash from your password DB.
    const result = await bcrypt.compare(password, user.password);
    // result == true
    if (!result) {
      return res.status(401).json({ status: false, error: 'wrong credential!' });
    }
    const token = jwt.generateToken(user.id, user.name, user.isPremium);


    return res.status(200).json({ status: true, data: token });

  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error,
    });
  }

};

exports.postForgotPassword = async (req, res, next) => {
  console.log(req.body);
  const email = req.body.email;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      status: false,
      error: 'user does not exist.',
    });
  }
  const id = uuid.v4();
  const forgotpasswordrequest = new ForgotPassword({
    id, active: true,
    expiresby: Date.now() + 3600000,
    userId: user._id
  });
  await forgotpasswordrequest.save()
  var defaultClient = SibApiV3Sdk.ApiClient.instance;

  // Configure API key authorization: api-key
  var apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.EMAIL_API_KEY;
  var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  // var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email


  const sender = { email: 'no-reply@expensetracker.com', name: "Expense Tracker" };
  const receivers = [{ email: email }];
  apiInstance.sendTransacEmail({
    sender,
    to: receivers,
    subject: "Forget Password",
    htmlContent: `To reset your password click on - <a href="http://localhost:3000/api/resetpassword/${id}">Reset password</a>`
  }).then(function (data) {
    return res.status(200).json({ message: 'Link to reset password sent to your mail ', success: true, emailData: data })
  }, function (error) {
    console.error(error);
  });
}

exports.postResetPassword = async (req, res, next) => {

  const id = req.params.id;
  const forgotpasswordrequest = await ForgotPassword.findOne({ id: id })
  if (!forgotpasswordrequest.active) {
    return res.status(404).json({ message: "this link is not active", success: false })
  }
  if (forgotpasswordrequest) {
    forgotpasswordrequest.active = false;//
    await forgotpasswordrequest.save();
    res.status(200).send(`<html>
                                  <script>
                                      function formsubmitted(e){
                                          e.preventDefault();
                                          console.log('called')
                                      }
                                  </script>

                                  <form action="/api/update-password/${id}" method="get">
                                      <label for="newpassword">Enter New password</label>
                                      <input name="newpassword" type="password" required></input>
                                      <button>reset password</button>
                                  </form>
                              </html>`
    )
    // res.end()

  }
}
exports.postUpdatePassword = async (req, res, next) => {
  try {
    const { newpassword } = req.query;
    const { id } = req.params;
    
    const resetpasswordrequest = await ForgotPassword.findOne({ id: id })
    console.log(resetpasswordrequest);
// i want to use mongoose id to find the user
    const user = await User.findOne({_id: resetpasswordrequest.userId})

    if (user) {
      //encrypt the password
      const hashPass = await bcrypt.hash(newpassword, 10);
       user.password = hashPass;
      await user.save();
      res.status(201).json({ message: 'Password reset successfully' })
    } else {
      return res.status(404).json({ error: 'No user Exists', success: false })
    }
  } catch (error) {
    return res.status(403).json({ error, success: false })
  }

}
// $2b$10$VzywqwRcU8DVfUpRJeJlTOISiyTk74M970.rk4PIHFYuNjvcsszGW