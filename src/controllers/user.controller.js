import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { json } from "express";

const registerUser = asyncHandler(async (req, res) => {
  // getuser details from frontend
  //validation not empty
  //check if user already exist:username , email
  //check image,checkfor avatar
  //upload them to cloudinary, avatar,
  //create user object -create entryin db
  // remove password and refresh token field from response
  //check for user creation
  // return response

  const { fullname, email, password, username } = req.body;
  console.log("emal", email);

  if (
    [fullname, email, password, username].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All field is required");
  }

  const existedUser = User.findOne({ $or: [{ email }, { username }] });
  if (existedUser) {
    throw new ApiError(
      409,
      "user  with this email or username already exists!"
    );
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImagePath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");

  //upload file avatar using uploadOnCloudinary

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImagePath);

  if (!avatar) throw new ApiError(400, "Avatar file is required");

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createUser = await User.findById(user._id).select(
    "-password -refreshToken "
  );

  if (!createUser)
    throw new ApiError(500, "something went wrong while registering the user ");

  return res.status(
    201,
    json(new ApiResponse(200, "user registered successfully", createUser))
  );
});

export { registerUser };

// multer gives you a req.files access
