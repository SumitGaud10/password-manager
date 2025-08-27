"use server";
import { signOut } from "../../auth";

const handleSignOut = async () => {
  await signOut({ redirectTo: "/login" });
};

export default handleSignOut;
