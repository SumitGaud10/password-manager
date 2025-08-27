import z from "zod";
import { UserObject } from "../../Zod/user.zod";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import { User } from "@/models/users.model";
import bcrypt from "bcrypt";

export const autho = async (
  credentials: Partial<Record<"username" | "password", unknown>>
) => {
  try {
    const data = await z.parseAsync(UserObject, credentials);

    await dbConnect();
    const user = await User.findOne({ username: data.username });
    if (!user) {
      return null;
    }
    const isPasswordCorrect = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return null;
    }

    return {
      id: (user._id as mongoose.Types.ObjectId).toString(),
      name: user.username,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};
