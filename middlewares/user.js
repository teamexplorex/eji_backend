import { ROLE } from "../constants/common.js";

export const isAdmin = async (req, res, next) => {
  try {
    if (req.authUser.role !== ROLE.ADMIN) throw new Error("Unauthorised")
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorised" });
  }
};