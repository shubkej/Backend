import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.models";

export const verifyJWT = asyncHandler(async (req, res, next) => {

  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", ""); //req.header("Authorization")?.replace("Bearer ", ""): This part attempts to get the value of the "Authorization" header from the request using req.header("Authorization"). The ?. again prevents an error if req.header("Authorization") is null or undefined. If the header exists, .replace("Bearer ", "") is called on it, which removes the "Bearer " prefix if it exists. The resulting string (without the "Bearer " prefix) is then assigned to token.

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "invalid access token");
    }

    req.user = user;
    next();
    
  } catch (error) {
      throw new ApiError(401,error?.message || "Invalid access token")
  }
});
