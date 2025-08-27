"use server";

import { loginFormType } from "@/app/login/Form";
import { signIn } from "../../auth";
import { AuthError } from "next-auth";

export const onSubmit = async (data: loginFormType) => {
  try {
    const result = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false, // Important: prevent automatic redirect
    });

    console.log("Sign in result:", result);

    // Check if sign in was successful
    if (result?.error) {
      return { error: "Invalid credentials" };
    }

    // If successful, return success and let client handle redirect
    return { success: true };
  } catch (error) {
    console.error("Login error:", error);

    // Handle different types of auth errors
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }

    return { error: "Something went wrong" };
  }
};
