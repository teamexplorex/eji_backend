import { ROLE } from "../constants/common.js";
import User from "../models/user.js";
import { hashPassword } from "../utils/auth.js"

const UserController = {
  updateUser: async (req, res) => {
    try {
      if (req.authUser.role !== ROLE.ADMIN) {
        delete req.body.isActive;
        delete req.body.isBlock;
      }
      const user = await User.findOneAndUpdate(
        {
          _id:
            req.authUser.role === ROLE.USER ? req.authUser._id : req.params.id,
        },
        req.body,
        {
          new: true,
        }
      ).select("-password");
      if (!user) throw new Error("User not found !");

      return res.status(200).json({ message: user });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  createUser: async (req, res) => {
    try {
      const { email, number } = req.body;
      let user = await User.findOne({
        role: ROLE.ADMIN,
        $or: [
          { email },
          { number },
        ],
      })
  
      if (user) {
        throw new Error("User Already exists!");
      }
  
      req.body.password = await hashPassword(req.body.password);
      user = await User.create([{
        ...req.body,
        isActive: true,
        role: ROLE.ADMIN,
      }]);
  
      return res.status(200).json({ message: user });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) throw new Error("User not found !");

      return res.status(200).json({ message: "Delete User Successfully !" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  getUsers: async (req, res) => {
    try {
      let { page, limit, number, email, role } = req.query;
      if (!page || !limit) throw new Error("Page or Limit is required !");

      const skipUsers = page * limit;
      const ITEM_PER_PAGE = page * limit;

      let queryParam = {
        ...(number ? { number } : {}),
        ...(email ? { email } : {}),
        ...(role ? { role } : {}),
      };

      const users = await User.find(queryParam)
        .sort({ createdAt: -1 })
        .skip(skipUsers)
        .limit(limit)
        .select("name number role email isBlock isActive adminAccess");

      const totalUsers = await User.find(queryParam).count();

      res.status(200).json({
        success: true,
        message: users,
        totalUsers,
        hasNextPage: ITEM_PER_PAGE < totalUsers,
        hasPreviousPage: page > 1,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.authUser._id);
      if (!user) throw new Error("User not found !");

      return res.status(200).json({ message: user });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  getUsersCount: async (req, res) => {
    try {
      const users = await User.find({
        role: ROLE.USER,
      }).count();

      return res.status(200).json({ message: users });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  }
};

export default UserController;
