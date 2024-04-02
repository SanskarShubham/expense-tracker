const User = require('../models/user'); // Assuming your user model file is user.model.js
const Expense = require('../models/expense');// Assuming your expense model file is expense.model.js
const sequelize = require('../utils/database');
const fs =  require('fs');
const AWS =  require('aws-sdk');

exports.getLeaderboard = async (req, res, next) => {
  try {
    // Aggregate pipeline to get the total expense for each user along with their names
    const leaderboard = await User.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          totalExpense: 1
        }
      },
      {
        $sort: { totalExpense: -1 } // Sort by totalExpense in descending order
      }
    ]);

    // Send the leaderboard data as response
    res.json(leaderboard);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: false,
      error: 'An error occurred while fetching the leaderboard data'
    });
  }
};


exports.getDownloadReport = async (req,res,next)=>{
// Replace with your AWS credentials and bucket details
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.BUCKET_NAME;


const s3 = new AWS.S3({
  accessKeyId,
  secretAccessKey
  // region
});

// const fileContent = fs.readFileSync('./controllers/myfile.txt');
const expenses =  await Expense.find({userId:req.user.id});
const expenseString =  JSON.stringify(expenses)
  
const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `expense${req.user.id}/${new Date()}.txt`, // filename in S3 bucket
    Body: expenseString,
    ACL:'public-read'
};

s3.upload(params, (err, data) => {
    if (err) {
        console.error('Error uploading file:', err);
    } else {

            //  console.log('File uploaded successfully:', data.Location);
             res.status(201).json({fileUrl:data.Location});
    }
});
//  // Example usage
//  uploadFile('myfile.txt', './controllers/myfile.txt');
 
  //  console.log(expenses);

}