import dbConnect from "@/lib/dbConnect";
import { Records } from "@/models/records.model";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "../../../../../auth";

export const DELETE = auth(async function DELETE(
  req,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!req.auth)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    await dbConnect();
    const deleteingRecord = await Records.findById(id);
    if (deleteingRecord.createdBy != req.auth.user?.id)
      return NextResponse.json(
        { message: "You're not allowed to delete this record" },
        { status: 401 }
      );
    const deletedRecord = await Records.findByIdAndDelete(id);
    if (!deletedRecord) {
      return NextResponse.json(
        { error: "Record doesn't exists" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Record deleted" }, { status: 200 });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
});
