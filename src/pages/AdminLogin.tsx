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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAdminLogin } from "@/hooks/use-mutations";
import Throbber from "@/components/throbber";
import { useUser } from "@/zustand/store";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  otp: z.string().min(6, "Authenticator code must be 6 digits"),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      otp: "",
      email: "",
      password: "",
    },
  });
  const { mutate: login, isPending: isLoggingIn } = useAdminLogin({
    onSuccess: (data: any) => {
      if (data.userData.isAdmin) {
        navigate("/admin-dashboard");
      } else {
        toast.error("Access Denied, You are not admin");
        localStorage.removeItem("token");
        useUser.setState({ user: null });
      }
    },
  });
  const onSubmit = (data: { email: string; password: string; otp: string }) => {
    login({ ...data, otp: data.otp });
  };
  return (
    <div className="container mx-auto p-4">
      <div className="flex min-h-dvh">
        {/* <div className="fixed inset-y-0 left-0 hidden h-screen lg:block">
          <img
            src="/images/auth-img.webp"
            className="h-full w-auto"
            alt="Save money in fractional digital gold."
          />
          <img
            src="/images/auth-icons.svg"
            className="absolute bottom-10 left-8 z-10 w-40"
            alt=""
          />
        </div> */}

        <div className="fixed inset-y-0 left-0 hidden h-screen lg:block">
          <img
            src="/images/auth-image2.svg"
            className="h-full w-auto"
            alt="Save money in fractional digital gold."
          />
        </div>
        <div className="invisible hidden h-screen lg:block">
          <img
            src="/images/auth-img.webp"
            className="h-full w-auto"
            alt="Save money in fractional digital gold."
          />
        </div>
        <div className="flex grow items-center justify-center">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center"
          >
            <div className="flex items-center gap-2">
              <img
                src="/images/duozapay-logo.svg"
                className="h-auto w-28"
                alt="Duozapay Logo"
              />
            </div>

            <h1 className="mt-6 text-3xl font-bold">Login as Admin</h1>

            <Form {...form}>
              <div className="mt-6 flex w-full flex-col gap-2.5 lg:min-w-sm">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type={"email"}
                          {...field}
                          onChange={(e) => {
                            const cleaned = e.target.value
                              .replace(/\s+/g, "")
                              .toLowerCase();
                            field.onChange(cleaned);
                          }}
                          placeholder="name@sample.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-end gap-2.5">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="flex w-2/3 flex-col">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type={"password"}
                            {...field}
                            placeholder="************"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem className="flex w-1/3 flex-col">
                        <FormLabel>Authenticator Code</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter code" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  disabled={isLoggingIn}
                  className="mt-6 w-full"
                  type="submit"
                >
                  {isLoggingIn ? <Throbber /> : "Login"}
                </Button>
              </div>
            </Form>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
