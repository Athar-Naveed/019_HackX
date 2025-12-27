"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { adminLoginHandler, resendOTP } from "@/handlers/loginHandler";
import adminStore from "@/store/adminStore";
import { publicIpv4 } from "public-ip";
import Image from "next/image";
export default function SignInForm() {
  const { setUser, setEmail } = adminStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>("");
  const router = useRouter();
  const validationSchema = Yup.object({
    identifier: Yup.string()
      .required("Email or CNIC is required")
      .test("email-or-cnic", "Enter a valid email or CNIC", (value) => {
        if (!value) return false;

        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

        const isCNIC = /^\d{5}-?\d{7}-?\d$/.test(value);

        return isEmail || isCNIC;
      }),
    password: Yup.string().required("Password is required"),
    ipAddress: Yup.string(),
  });
  const handleLogin = async () => {};
  return (
    <div className="flex items-center h-screen justify-center flex-col flex-1 w-full ">
      <div className="flex flex-col justify-center flex-1 w-full max-w-xl mx-auto sm:px-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-8">
            <Link href={"/"}>
              <div className="logo mx-auto">
                <Image
                  src={"/Logo/hisaab.png"}
                  width={50}
                  height={50}
                  className="mx-auto"
                  alt={"Hisaabi keera Logo"}
                />
              </div>
            </Link>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Enter your credentials to access your account
              </p>
            </div>
            <div onClick={handleLogin} className="google cursor-pointer">
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 my-5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors items-center justify-center">
                <Image
                  src={"/images/icons/google.png"}
                  width={20}
                  height={20}
                  alt={"Google Icon"}
                />
                <span className="cursor-pointer ml-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Sign in with Google
                </span>
              </div>
            </div>
            <p className="my-5 text-white text-center font-semibold">OR</p>

            <Formik
              initialValues={{
                identifier: "",
                password: "",
                ipAddress: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setLoading(true);
                setMessage("");
                const ipAddress = await publicIpv4();
                values.ipAddress = ipAddress;
                try {
                  const resp = await adminLoginHandler(values);

                  if (resp.status === 200) {
                    setMessage("Login successful!");
                    setUser(resp.data.fullName);
                    router.push("/admin/dashboard");
                  }
                  // else if (resp.status === 401) {
                  //   setMessage(resp.message);
                  // } else if (resp.status === 403) {
                  //   setEmail(values.email);
                  //   await resendOTP(values.email);
                  //   router.push("otp");
                  //   setMessage("Redirecting you to the OTP page!");
                  // }
                  else {
                    setMessage(resp.message);
                  }
                } catch (error: any) {
                  setMessage(error.message || "Error! An error occurred");
                } finally {
                  setLoading(false);
                  setSubmitting(false);
                }
              }}
            >
              {({ errors, touched }) => (
                <Form className="space-y-6">
                  {/* Email / CNIC Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="identifier"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email or CNIC <span className="text-rose-500">*</span>
                    </label>

                    <div className="relative">
                      <Field
                        id="identifier"
                        name="identifier"
                        type="text"
                        placeholder="Email or CNIC"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.identifier && touched.identifier
                            ? "border-rose-500 focus:ring-rose-500 focus:border-rose-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-hidden focus:ring-2 transition-all duration-200`}
                      />

                      {errors.identifier && touched.identifier && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg
                            className="h-5 w-5 text-rose-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                          </svg>
                        </div>
                      )}
                    </div>

                    <ErrorMessage
                      name="identifier"
                      component="p"
                      className="mt-1 text-sm text-rose-500"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Password <span className="text-rose-500">*</span>
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Field
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.password && touched.password
                            ? "border-rose-500 focus:ring-rose-500 focus:border-rose-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-hidden focus:ring-2 transition-all duration-200 pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-hidden transition-colors"
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                      {errors.password && touched.password && (
                        <div className="absolute inset-y-0 right-10 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-rose-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                          </svg>
                        </div>
                      )}
                    </div>
                    <ErrorMessage
                      name="password"
                      component="p"
                      className="mt-1 text-sm text-rose-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 transform hover:-translate-y-px ${
                      loading
                        ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md hover:shadow-lg"
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing in...
                      </div>
                    ) : (
                      "Sign in"
                    )}
                  </button>
                </Form>
              )}
            </Formik>
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Not a user?
              </span>{" "}
              <Link
                href="/signup"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline transition-colors"
              >
                Create an account
              </Link>
            </div>
          </div>

          {message && (
            <div
              className={`px-8 py-4 text-sm ${
                message.includes("successful")
                  ? "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-t border-green-200 dark:border-green-800"
                  : "bg-rose-50 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-t border-rose-200 dark:border-rose-800"
              }`}
            >
              <div className="flex items-center">
                {message.includes("successful") ? (
                  <svg
                    className="h-5 w-5 mr-2 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 mr-2 text-rose-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                )}
                {message}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
