import { createJwtToken, verifyToken } from "../utils/jwt.js";
import Otp from "../models/otp.js";
import User from "../models/user.js";
import { comparePassword } from "../utils/auth.js";
import { EPOCH, ROLE } from "../constants/common.js";
import axios from 'axios';
import { otpMessage } from "../utils/sms.js";

const AuthController = {
  makeOtp: async (number) => {
    try {
      let otp = await Otp.findOne({ number });
      if (otp) await Otp.findByIdAndDelete(otp._id);

      otp = Math.floor(100000 + Math.random() * 900000);
      await Otp.create([{ number, otp, createdAt: new Date().getTime() }]);

      await User.findOneAndUpdate({ number }, [
        {
          $set: {
            otpCount: {
              $cond: {
                if: { $gte: ["$otpCount", 5] },
                then: 1,
                else: { $add: ["$otpCount", 1] },
              },
            },
            otpCountUpdatedAt: new Date().getTime(),
          },
        },
      ]);

      await axios.get(`${process.env.SMS_API_URL}?username=${process.env.SMS_USER_NAME}&msg_token=${process.env.SMS_MESSAGE_TOKEN}&sender_id=${process.env.SMS_SENDER_ID}&message=${otpMessage(otp, number)}`)
      return otp;
    } catch (err) {
      console.log(err)
      throw err;
    }
  },
  login: async (req, res) => {
    try {
      let user = await User.findOne({
        number: req.body.number,
        role: ROLE.USER,
      })

      if (
        user?.otpCount >= 5 &&
        new Date().getTime() - user.otpCountUpdatedAt < 5 * EPOCH.ONE_HOUR_MS
      )
        throw new Error("Try Again after some time !");

      if (!user) {
        user = await User.create([{
          number: req.body.number,
          role: ROLE.USER,
          isActive: true,
          ...(req.body.email ? { email: req.body.email } : {}),
          ...(req.body.name ? { name: req.body.name } : {}),
        }]);  
      }
      let otp = await AuthController.makeOtp(req.body.number);
      return res.status(201).json({ message: "Your Verification OTP is "  + otp});

      // return res.status(201).json({ message: "OTP Sent !" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },

  adminLogin: async (req, res) => {
    try {
      let user = await User.findOne({
        email: req.body.email,
        role: ROLE.ADMIN,
      });
      if (!user) throw new Error("Admin Not Found !");

      const isPasswordCorrect = await comparePassword(
        req.body.password,
        user.password
      );
      if (!isPasswordCorrect) throw new Error("Invalid Credentials!");

      let accessToken = createJwtToken(
        {
          id: user._id,
          role: user.role,
          tokenVersion: user.tokenVersion,
          number: user.number,
          email: user.email,
        },
        "365d"
      );

      return res.status(201).json({ message: accessToken });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },

  verifyOtp: async (req, res) => {
    try {
      const { number, otp } = req.body;

      const dbOtp = await Otp.findOne({
        number,
        otp,
      })

      if (!dbOtp) throw new Error("OTP Expired !");
      if (dbOtp.otp !== otp) throw new Error("Wrong OTP !");
      if (dbOtp) {
        await Otp.findByIdAndDelete(dbOtp._id);
      }

      const user = await User.findOneAndUpdate(
        { number },
        { otpCount: 0, otpCountUpdatedAt: new Date().getTime() },
        { new: true }
      );

      let accessToken = createJwtToken(
        {
          id: user._id,
          role: user.role,
          tokenVersion: user.tokenVersion,
          number,
        },
        "365d"
      );
      return res.status(201).json({
        message: accessToken,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },

  resendOtp: async (req, res) => {
    try {
      const { number } = req.body;
      let user = await User.findOne({ number })

      if (
        user?.otpCount >= 5 &&
        new Date().getTime() - user.otpCountUpdatedAt < 5 * EPOCH.ONE_HOUR_MS
      )
        throw new Error("Try Again after some time !");

      await AuthController.makeOtp(user.number);
      return res.status(201).json({ message: "OTP Sent !" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },

  logout: async (req, res) => {
    try {
      const { accessToken } = req.body;
      if (!accessToken) throw new Error("Unauthorised");

      const tokenDetails = await verifyToken(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );
      if (!tokenDetails) throw new Error("Unauthorised");

      await User.findByIdAndUpdate(tokenDetails._id, {
        tokenVersion: tokenDetails.tokenVersion + 1,
      });

      return res.status(200).json({ message: "logout success" });
    } catch (err) {
      console.log(err.message);
      res.status(400).json({ message: err.message });
    }
  },
};

export default AuthController;
