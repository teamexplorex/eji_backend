import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const createJwtToken = (fields, time) => {
  const accesstoken = jwt.sign(fields, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: time ? time : "2h",
  });

  return accesstoken;
};

const isTokenExpired = (exp) => Date.now() >= exp * 1000;

export const verifyToken = async (token, secret) => {
  try {
    var decoded = jwt.verify(token, secret);
    let user = await User.findById(decoded.id);

    if (
      user &&
      isTokenExpired(decoded.exp) === false &&
      user.tokenVersion === decoded.tokenVersion &&
      user.isActive &&
      !user.isBlock
    )
      return user;

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const verifyTokenForRefreshToken = async (token, secret, userId) => {
  try {
    var decoded = jwt.verify(token, secret);
    let user = await User.findById(userId || decoded.users[0]._id);

    if (
      user &&
      isTokenExpired(decoded.exp) === false &&
      user.tokenVersion === decoded.tokenVersion &&
      user.isActive
    )
      return decoded;

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};
