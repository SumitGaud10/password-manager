"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Loader2Icon,
  Pencil,
  Plus,
  Settings,
  Trash,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import handleSignOut from "@/actions/signout";

// Validation schema for the new password entry
const passwordSchema = z.object({
  _id: z.string().optional(),
  website: z.string().min(1, "Website name is required"),
  username: z.string().min(1, "Username is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be less than 50 characters"),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function PasswordManager() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passwords, setPasswords] = useState<PasswordFormValues[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSumitting, setIsSubmitting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState<
    PasswordFormValues | undefined
  >();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/records`
      );
      setPasswords(response.data.data);
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      toast(`Problem Detected!\n ${err.response?.data.error || err.message}`);
    }
    setIsLoading(false);
  };

  // Form setup with react-hook-form and Zod
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      website: "",
      username: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: PasswordFormValues) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/records`,
        data
      );
      setPasswords([...passwords, response.data.data]);
      console.log(response);
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/records/${deletingRecord?._id}`
      );
      setPasswords((prev) =>
        prev.filter((entry) => entry._id !== deletingRecord?._id)
      );
      toast.success("Record deleted successfully");
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      toast(`Problem Detected! ${err.response?.data.error || err.message}`);
    } finally {
      setIsDeleting(false);
      setDeleteDialog(false);
    }
  };
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="flex-1 flex flex-col p-8 container mx-auto">
        <div className="flex justify-between sm:items-center sm:flex-row flex-col gap-4 mb-6">
          <h2 className="text-3xl font-semibold">Welcome, User</h2>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"outline"}>
                  <Settings /> Settings
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={getData}>Refresh</DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="w-fit">
                  <Plus /> Add Password
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Password</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new password entry.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., user@example.com"
                              {...field}
                            />
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
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={isSumitting}>
                        {isSumitting ? (
                          <>
                            <Loader2Icon className="animate-spin" />
                            Please wait
                          </>
                        ) : (
                          "Save Password"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoading ? (
          <>
            <div className="flex flex-1 justify-center items-center">
              <Loader2Icon className="animate-spin" size={50} />
            </div>
          </>
        ) : (
          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
            {passwords.length === 0 ? (
              <p className="text-gray-500">No passwords saved yet.</p>
            ) : (
              passwords.map((entry, index) => (
                <Card key={index} className="wrap-anywhere">
                  <CardHeader>
                    <CardTitle>{entry.website}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>Username:</strong> {entry.username}
                    </p>
                    <p>
                      <strong>Password:</strong> {entry.password}
                    </p>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button size={"sm"} variant={"secondary"}>
                      <Pencil /> Edit
                    </Button>
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      onClick={() => {
                        setDeleteDialog(true);
                        setDeletingRecord(entry);
                      }}
                    >
                      <Trash /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        )}
      </main>
      <AlertDialog open={deleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              onClick={() => setDeleteDialog(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDelete();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Please wait
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
