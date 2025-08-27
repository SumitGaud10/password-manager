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
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/ui/password-input";

const formSchema = z.object({
  name_2689049137: z.string().min(1, "Username is required"),
  name_7467271343: z
    .string()
    .min(8, "Password should be atleast 8 characters long"),
});

const backendURL = process.env.NEXT_PUBLIC_API_URL || "";

export default function MyForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axios.post(`${backendURL}/auth/register`, {
        username: values.name_2689049137,
        password: values.name_7467271343,
      });
      toast("Account created successfully, redirecting you to the login page");
      router.push("/login");
    } catch (error) {
      console.error("Form submission error", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField
          control={form.control}
          name="name_2689049137"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="" type="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name_7467271343"
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
