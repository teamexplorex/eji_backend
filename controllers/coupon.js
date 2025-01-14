import Coupon from "../models/coupon.js";

const CouponController = {
  getCoupons: async (req, res) => {
    try {
      const { page, limit, isPercentage, isActive } = req.query;
      if (!page || !limit) throw new Error("Page or Limit is required!");

      const skipUsers = (page) * limit;
      const ITEM_PER_PAGE = page * limit;

      let queryParams = {
        ...(isPercentage ? { isPercentage } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
      };

      const coupons = await Coupon.find(queryParams)
        .sort({ createdAt: -1 })
        .skip(skipUsers)
        .limit(parseInt(limit));

      const totalCoupons = await Coupon.countDocuments(queryParams);

      res.status(200).json({
        success: true,
        message: coupons,
        totalCoupons,
        hasNextPage: ITEM_PER_PAGE < totalCoupons,
        hasPreviousPage: page > 1,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getCoupon: async (req, res) => {
    try {
      const coupon = await Coupon.findById(req.params.id);
      if (!coupon) throw new Error("Coupon not found");

      return res.status(200).json({ message: coupon });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  addCoupon: async (req, res) => {
    try {
      const coupon = await Coupon.create(req.body);
      return res.status(201).json({ message: coupon });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  updateCoupon: async (req, res) => {
    try {
      const updatedCoupon = await Coupon.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!updatedCoupon) throw new Error("Coupon Not Found");
      return res.status(200).json({ message: updatedCoupon });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  deleteCoupon: async (req, res) => {
    try {
      const coupon = await Coupon.findByIdAndDelete(req.params.id);
      if (!coupon) throw new Error("Coupon Not Found");
      return res.status(200).json({ message: "Deleted Successfully" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getLatestCoupon: async (req, res) => {
    try {
      const coupon = await Coupon.findOne({ isActive: true });

      if (
        coupon &&
        (!coupon?.usersAppliedCoupons?.[req.authUser._id.toString()] ||
          coupon?.usersAppliedCoupons?.[req.authUser._id.toString()] <
            coupon?.maxEntryPerUser) &&
        coupon.couponAppliedCount < coupon?.maxEntry
      )
        return res.status(200).json({ message: coupon });

      throw new Error("Coupon Not Found");
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  validateCoupon: async (req, res) => {
    try {
      const coupon = await Coupon.findOne({
        name: req.query.coupon,
        isActive: true,
      }).select(
        "name amount isPercentage usersAppliedCoupons maxEntryPerUser maxEntry"
      );

      if (
        !coupon ||
        coupon?.usersAppliedCoupons?.[req.authUser._id] >=
          coupon?.maxEntryPerUser ||
        coupon.couponAppliedCount >= coupon?.maxEntry
      )
        throw new Error("Invalid Coupon!");

      coupon.usersAppliedCoupons = undefined;
      coupon.maxEntryPerUser = undefined;
      coupon.maxEntry = undefined;

      return res.status(200).json({ message: coupon });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};

export default CouponController;
