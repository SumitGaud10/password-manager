import { z } from "zod";
import { NextResponse } from "next/server";
import { Records } from "@/models/records.model";
import dbConnect from "@/lib/dbConnect";
import { auth } from "../../../../auth";

const recordType = z.object({
  website: z.string().min(1, "Please enter the name of website"),
  username: z.string().min(1, "Please enter the username"),
  password: z.string().min(8, "Please enter the password"),
  createdBy: z.string(),
});

export const POST = auth(async function POST(req) {
  const body = await req.json();
  if (!req.auth)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  try {
    await dbConnect();
    body.createdBy = req.auth.user?.id;
    const validatedData = recordType.parse(body);
    const newRecord = new Records(validatedData);
    await newRecord.save();
    return NextResponse.json(
      {
        message: "Password entry created successfully",
        data: validatedData,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError)
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

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
});

export const GET = auth(async function GET(req) {
  if (!req.auth)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  try {
    await dbConnect();
    const data = await Records.find({ createdBy: req.auth.user?.id });
    return NextResponse.json({
      message: "Got all the records successfully",
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Internal Server Error ${error}`,
      },
      { status: 500 }
    );
  }
});
