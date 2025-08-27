import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import z from "zod";
import { UserObject } from "../../../../../Zod/user.zod";
import { User } from "@/models/users.model";
import bcrypt from "bcrypt";

export const POST = async (req: Request) => {
  const data = await req.json();
  try {
    await dbConnect();
    const body = await z.parseAsync(UserObject, data);

    const existingUser = await User.findOne({ username: body.username });

    if (existingUser)
      return NextResponse.json({ error: "Username is taken" }, { status: 409 });

    body.password = await bcrypt.hash(body.password, 10);
    const newUser = new User(body);
    await newUser.save();

    return NextResponse.json(
      {
        message: "Account created successfully",
        newUser,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }
  }
};
