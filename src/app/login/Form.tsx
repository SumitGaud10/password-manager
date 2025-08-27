"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { onSubmit } from "@/actions/login";
import { useRouter } from "next/navigation";

const loginFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be 8 characters long"),
});

export type loginFormType = z.infer<typeof loginFormSchema>;

export default function MyForm() {
  const router = useRouter();

  const form = useForm<loginFormType>({
    resolver: zodResolver(loginFormSchema),
  });

  const login = async (data: loginFormType) => {
    try {
      const result = await onSubmit(data);
      if (result?.error) {
        toast.error(result.error);
        return;
      }

      if (result?.success) {
        toast.success(
          "Logged in successfully, Redirecting you to the home page!"
        );
        router.push("/");
        return;
      }
    } catch (err) {
      console.log("Couldn't submit form: ", err);
      toast.error("Something went wrong");
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(login)} className="space-y-8 w-full">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="" type="text" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
