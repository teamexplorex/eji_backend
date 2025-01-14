import { verifyToken } from "../utils/jwt.js";

export const isAuthorised = async (req, res, next) => {
  try {
    if (!req.headers["authorization"]) throw new Error("Unauthorised");
    const token = req.headers["authorization"].replaceAll("Bearer ", "");

    const tokenDetails = await verifyToken(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    if (!tokenDetails) throw new Error("Unauthorised");
    req.authUser = tokenDetails;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: "Unauthorised" });
  }
};