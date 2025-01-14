import bcrypt from "bcryptjs";
import AWS from "aws-sdk";

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const sns = new AWS.SNS();

export const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};

export const comparePassword = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export const sendMessageWithAWS = async (message, number) => {
  try {
    var params = {
      Message: message,
      PhoneNumber: number,
    };

    sns.publish(params, (err, data) => {
      if (err) {
        console.error("Error sending SMS:", err);
      } else {
        console.log("SMS sent successfully:", data);
      }
    });
  } catch (err) {
    console.log(err);
  }
};