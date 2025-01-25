import BookedPackage from "../models/bookedPackage.js";
import Razorpay from "razorpay";
import Package from "../models/package.js";
import { ROLE } from "../constants/common.js";
import Coupon from "../models/coupon.js";
import mongoose from "mongoose";
import { preOrderCompleteSms } from "../utils/sms.js";
import axios from "axios";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const updateCouponDetails = async (couponDetail, userId, session) => {
  let coupon = await Coupon.findOne({ name: couponDetail.name }).session(
    session
  );
  if (coupon) {
    if (!coupon.usersAppliedCoupons) coupon.usersAppliedCoupons = {};
    coupon.usersAppliedCoupons[userId.toString()] = coupon
      .usersAppliedCoupons?.[userId.toString()]
      ? coupon.usersAppliedCoupons[userId.toString()] + 1
      : 1;

    coupon.couponAppliedCount = coupon.couponAppliedCount + 1;
    coupon.markModified("usersAppliedCoupons");
    await coupon.save({ session });
  }
};

const createBookedPackageHelper = async ({ body }, req) => {
  const session = await mongoose.startSession();
  let retries = 3;
  const backoffTime = 1000; // Initial backoff time in milliseconds

  while (retries > 0) {
    try {
      session.startTransaction();
      const { packageId, coupon } = body;

      let packageDetails = await Package.findById(packageId);

      let totalAmount = packageDetails.discountedPrice;
      let totalMrpAmount = packageDetails.discountedPrice;

      let isCouponApplied = false;

      if (coupon) {
        let couponDetail = await Coupon.findOne({
          isActive: true,
          name: coupon.name,
        }).session(session);

        if (
          couponDetail &&
          (!couponDetail?.usersAppliedCoupons?.[req.authUser._id.toString()] ||
            couponDetail?.usersAppliedCoupons?.[req.authUser._id.toString()] <
              couponDetail?.maxEntryPerUser) &&
          totalAmount >= couponDetail.minAmountPerOrder &&
          couponDetail.couponAppliedCount < couponDetail?.maxEntry
        ) {
          isCouponApplied = true;
          if (couponDetail.isPercentage) {
            let discountedAmount = Math.round(
              (totalAmount * couponDetail.amount) / 100
            );
            totalAmount = totalAmount - discountedAmount;
          } else {
            totalAmount = totalAmount - couponDetail.amount;
          }
        }
      }
      if (!isCouponApplied) delete body["coupon"];

      const options = {
        amount: totalAmount * 100,
        currency: "INR",
      };
      const result = await razorpay.orders.create(options);
      await BookedPackage.create(
        [
          {
            ...body,
            paidPrice: totalAmount,
            totalMrpAmount: totalMrpAmount,
            status: "PENDING",
            discountedAmount: packageDetails.discountedAmount,
            orderId: result.id,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();
      return { message: result };
    } catch (err) {
      await session.abortTransaction();
      retries -= 1;
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
      } else {
        session.endSession();
        throw err;
      }
    }
  }
};

const BookedPackagesController = {
  getBookedPackages: async (req, res) => {
    try {
      const { page, limit, status } = req.query;

      if (!page || !limit) throw new Error("Page and Limit are required!");

      const skipRecords = (page) * limit;
      const ITEM_PER_PAGE = page * limit;

      let queryParams = {
        ...(req.authUser.role === ROLE.USER
          ? { userId: req.authUser._id }
          : {}),
        ...(status ? { status: status } : {}),
      };

      const bookedPackages = await BookedPackage.find(queryParams)
        .sort({ createdAt: -1 })
        .skip(skipRecords)
        .limit(parseInt(limit))
        .populate({
          path: "userId",
          select: "name number email",
        })
        .populate({
          path: "packageId",
        });

      const totalPackages = await BookedPackage.countDocuments(queryParams);

      res.status(200).json({
        success: true,
        message: bookedPackages,
        totalPackages,
        hasNextPage: ITEM_PER_PAGE < totalPackages,
        hasPreviousPage: page > 1,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  getBookingCount: async (req, res) => {
    try {
      const { status } = req.query;
      const data = await BookedPackage.find({
        status: status,
      }).countDocuments();
      return res.status(200).json({ message: data });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getBookingHistory: async (req, res) => {
    try {
      const data = await BookedPackage.find({
        userId: req.authUser._id,
      }).populate({
        path: "packageId",
        model: "Package",
      });

      return res.status(200).json({ message: data });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getRevenueCount: async (req, res) => {
    try {
      const revenue = await BookedPackage.aggregate([
        {
          $match: {
            status: "BOOKED",
          },
        },
        {
          $group: {
            _id: null,
            totalPaidAmount: { $sum: "$paidPrice" },
          },
        },
      ]);

      return res
        .status(200)
        .json({ message: revenue[0]?.totalPaidAmount || 0 });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getBookedPackageById: async (req, res) => {
    try {
      const data = await BookedPackage.findOne({
        _id: req.params.id,
        ...(req.authUser.role === ROLE.USER
          ? {
              userId: req.authUser._id,
            }
          : {}),
      }).populate({
        path: "packageId",
        model: "Package",
      });
      return res.status(200).json({ message: data });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  createBookedPackage: async (req, res) => {
    try {
      const { isCOD } = req.body;
      req.body.userId = req.authUser._id;

      const result = await createBookedPackageHelper(
        {
          body: req.body,
        },
        req
      );

      if (!isCOD) {
        return res.status(201).json({
          orderId: result.message.id,
          currency: result.message.currency,
          totalAmount: result.message.amount,
        });
      } else {
        return res.status(201).json({ message: result.message });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },

  updateBookedPackage: async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const params = { ...req.body };

      const updatedBookedPackage = await BookedPackage.findOneAndUpdate(
        {
          _id: req.params.id,
          ...(req.authUser.role === ROLE.USER
            ? {
                userId: req.authUser._id,
              }
            : {}),
        },
        params,
        { new: true, session }
      );

      await session.commitTransaction();
      session.endSession();
      return res
        .status(200)
        .json({ message: updatedBookedPackage, status: true });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      res.status(400).json({ message: err.message });
    }
  },

  paymentVerification: async (req, res) => {
    const session = await mongoose.startSession();
    const MAX_RETRIES = 5;
    let retries = 0;
    let success = false;

    while (retries < MAX_RETRIES && !success) {
      session.startTransaction();
      try {
        const { order_id, status } = req.body.payload.payment.entity;

        if (status === "captured") {
          const bookedPackage = await BookedPackage.findOne({
            orderId: order_id,
          })
            .populate("userId")
            .populate({
              path: "packageId",
              model: "Package",
            })
            .session(session);

          if (!bookedPackage?.isWebhookEvent) {
            bookedPackage.status = "BOOKED";
            bookedPackage.isWebhookEvent = true;

            await bookedPackage.save({ session });

            if (bookedPackage.coupon) {
              await updateCouponDetails(
                bookedPackage.coupon,
                bookedPackage.userId._id,
                session
              );
            }

            // await axios.get(
            //   `${process.env.SMS_API_URL}?username=${
            //     process.env.SMS_USER_NAME
            //   }&msg_token=${process.env.SMS_MESSAGE_TOKEN}&sender_id=${
            //     process.env.SMS_SENDER_ID
            //   }&message=${preOrderCompleteSms(
            //     bookedPackage.userId.number,
            //     order_id,
            //     bookedPackage.paidPrice
            //   )}`
            // );
          }
        }

        if (status === "refunded") {
          const bookedPackage = await BookedPackage.findOne({
            orderId: order_id,
          }).session(session);
          if (bookedPackage) {
            bookedPackage.isRefunded = true;
            await bookedPackage.save({ session });
          }
        }

        if (status === "failed") {
          const bookedPackage = await BookedPackage.findOne({
            orderId: order_id,
          }).session(session);
          if (bookedPackage) {
            bookedPackage.status = "CANCELLED";
            await bookedPackage.save({ session });
          }
        }

        await session.commitTransaction();
        session.endSession();
        success = true;
        res.status(200).json({ message: "Your payment is verified" });
      } catch (err) {
        console.log(err);
        await session.abortTransaction();
        retries += 1;
        if (retries >= MAX_RETRIES) {
          session.endSession();
          res
            .status(400)
            .json({ message: "Transaction failed after multiple retries." });
        }
      }
    }
  },
};

export default BookedPackagesController;
