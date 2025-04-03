import userRepository from "../repositories/user.repository.js";
import { statusCode } from "../utils/statusCode.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendMail, getEmailTemplate } from "../utils/mail.js";

const otpStore = new Map();
class UserService {
  async save(data) {
    try {
      const exist = await userRepository.findByEmail(data.email);
      if (exist)
        return {
          status: statusCode.CONFLICT,
          message: "Email Already Exists!",
        };
      const user = await userRepository.save(data);
      return {
        status: statusCode.CREATED,
        message: "User Created",
        data: user,
      };
    } catch (error) {
      throw { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }

  async login(data) {
    try {
      const user = await userRepository.findByEmail(data.email);
      if (!user)
        return { status: statusCode.NOT_FOUND, message: "User Not Found" };
      const ispassCorrect = await bcrypt.compare(data.password, user.password);
      if (!ispassCorrect)
        return { status: statusCode.BAD_REQUEST, message: "Invalid Password" };
      const token = jwt.sign(
        { id: user.id, name: `${user.name}`, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "4h" }
      );
      return {
        status: statusCode.OK,
        message: "Login Success",
        data: {
          token: token,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      };
    } catch (error) {
      return { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }

  async verifyPassword(payload) {
    try {
      const user = await userRepository.findByEmail(payload.email);
      if (!user)
        return { status: statusCode.NOT_FOUND, message: "User Not Found" };
      const ispassCorrect = await bcrypt.compare(payload.password, user.password);
      if (!ispassCorrect)
        return { status: statusCode.BAD_REQUEST, message: "Invalid Password" };
      return { status: statusCode.OK, message: "Password Verified" };
    } catch (error) {
      return { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  } 
  
  async update(id, data) {
    try {
      const user = await userRepository.getById(id);
      if (!user) {
        return { status: statusCode.NOT_FOUND, message: "User Not Found" };
      }
      const updatedUser = await userRepository.update(id, data);
      return {
        status: statusCode.OK,
        message: "User Updated.",
        data: updatedUser,
      };
    } catch (error) {
      return { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }

  async remove(id) {
    try {
      const user = await userRepository.getById(id);
      if (!user)
        return { status: statusCode.NOT_FOUND, message: "User Not Found" };
      await userRepository.remove(id);
      return { status: statusCode.OK, message: "User Removed!" };
    } catch (error) {
      return { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }

  async getAllUsers() {
    try {
      const user = await userRepository.getAllUsers();
      return {
        status: statusCode.OK,
        message: "All Users Shows Succesfully",
        data: user,
      };
    } catch (error) {
      throw { status: statusCode.BAD_GATEWAY, message: error.message };
    }
  }

  async sendOtpToEmail(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return { status: statusCode.NOT_FOUND, message: "User Not Found" };
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    // console.log("otp: ",otp);
    otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });
    const htmlTemplate = getEmailTemplate("otp-email-template.html", { otp });

    const mailOptions = {
      to: email,
      subject: "Your OTP Code for SaraFoods",
      html: htmlTemplate,
    };

    try {
      await sendMail(mailOptions);
      return { status: statusCode.OK, message: "OTP sent successfully" };
    } catch (error) {
      console.error("Error sending OTP:", error);
      return { status: statusCode.BAD_GATEWAY, message: "Failed to send OTP" };
    }
  }

  async verifyOtp(email, otp) {
    const otpEntry = otpStore.get(email);
    if (!otpEntry) {
      return { status: statusCode.NOT_FOUND, message: "Incorrect OTP" };
    }

    if (Date.now() > otpEntry.expires) {
      otpStore.delete(email);
      return { status: statusCode.NOT_FOUND, message: "OTP has expired" };
    }

    if (otpEntry.otp !== otp) {
      return { status: statusCode.FORBIDDEN, message: "Invalid OTP" };
    }

    otpStore.delete(email);
    return { status: statusCode.OK, message: "OTP verified successfully" };
  }

  async resetPassword(email, password) {
    //   console.log("email :",email);
    const user = await userRepository.findByEmail(email);
    if (user) {
      await userRepository.resetPassword(email, password);
      return {
        status: statusCode.OK,
        message: "Password updated successfully",
      };
    }
    return { status: statusCode.NOT_FOUND, message: "User not Found" };
  }

  async getUserById(id) {
    const user = await userRepository.getById(id);
    if (!user) {
      return { status: statusCode.NOT_FOUND, message: "User not Found" };
    }
    return { status: statusCode.OK, message: "User Found", data: user };
  }
}

export default new UserService();
