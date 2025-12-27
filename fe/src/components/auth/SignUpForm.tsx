"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { adminRegisterHandler } from "@/handlers/loginHandler";
import adminStore from "@/store/adminStore";
import { publicIpv4 } from "public-ip";
import Image from "next/image";

export default function SignInForm() {
  const { setEmail } = adminStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>("");
  const router = useRouter();

  const validationSchema = Yup.object({
    fullName: Yup.string()
      .required("Full Name is required")
      .min(3, "Full Name must be at least 3 characters")
      .max(50, "Full Name must be at most 50 characters"),
    gender: Yup.string().required("Gender is required"),
    cnic: Yup.string()
      .required("CNIC is required")
      .test(
        "cnic-format",
        "CNIC must be 13 digits (hyphens optional)",
        (value) => {
          if (!value) return false;
          const digits = value.replace(/-/g, "");
          return /^\d{13}$/.test(digits);
        }
      )
      .test(
        "cnic-gender",
        "CNIC gender does not match selected gender",
        function (value) {
          const { gender } = this.parent;
          if (!value || !gender) return true;

          const lastDigit = parseInt(value.replace(/-/g, "").slice(-1), 10);
          if (gender === "male") return lastDigit % 2 === 1;
          if (gender === "female") return lastDigit % 2 === 0;
          return true;
        }
      ),

    email: Yup.string()
      .email("Invalid email address")
      .matches(/^[^+]*$/, "Email must not contain '+'"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&.]{8,}$/,
        "Must include uppercase, lowercase, number, and special character"
      )
      .required("Password is required"),
    ipAddress: Yup.string(),
  });
  const handleRegister = async () => {};
  return (
    <div className="flex flex-col flex-1 w-full items-center h-screen justify-center">
      <div className="flex flex-col justify-center flex-1 w-full max-w-xl mx-auto px-4 sm:px-6">
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
                Register Here
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Let&apos;s keep your Hisaab Kitaab in place
              </p>
            </div>
            <div onClick={handleRegister} className="google cursor-pointer">
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
                fullName: "",
                gender: "",
                cnic: "",
                email: "",
                password: "",
                ipAddress: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setLoading(true);
                setMessage("");
                try {
                  const ipAddress = await publicIpv4();
                  values.ipAddress = ipAddress;
                  values.cnic = values.cnic.replace(/-/g, "");

                  const resp = await adminRegisterHandler(values);

                  if (resp.status === 201 && resp.message.email.length > 0) {
                    setEmail(resp.message.email);
                    router.push("otp");
                    setMessage("Redirecting you to the OTP page!");
                  } else if (resp.status == 201 && values.cnic.length > 0) {
                    router.push("signin");
                    setMessage("Please login!");
                  } else {
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
                  {/* Full Name Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Field
                        id="fullName"
                        name="fullName"
                        type="fullName"
                        placeholder="Your name here..."
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.fullName && touched.fullName
                            ? "border-rose-500 focus:ring-rose-500 focus:border-rose-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-hidden focus:ring-2 transition-all duration-200`}
                      />
                      {errors.fullName && touched.fullName && (
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
                      name="fullName"
                      component="p"
                      className="mt-1 text-sm text-rose-500"
                    />
                  </div>
                  {/* Gender Field */}
                  <div className="space-y-2">
                    <div className="relative">
                      <Field
                        as="select"
                        id="gender"
                        name="gender"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.gender && touched.gender
                            ? "border-rose-500 focus:ring-rose-500 focus:border-rose-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-hidden focus:ring-2 transition-all duration-200`}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </Field>
                      {errors.gender && touched.gender && (
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
                      name="gender"
                      component="p"
                      className="mt-1 text-sm text-rose-500"
                    />
                  </div>
                  {/* CNIC Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="cnic"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      CNIC <span className="text-rose-500">*</span>
                    </label>

                    <div className="relative">
                      <Field
                        id="cnic"
                        name="cnic"
                        type="text"
                        placeholder="35202-5502239-3"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.cnic && touched.cnic
                            ? "border-rose-500 focus:ring-rose-500 focus:border-rose-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-hidden focus:ring-2 transition-all duration-200`}
                      />

                      {errors.cnic && touched.cnic && (
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
                      name="cnic"
                      component="p"
                      className="mt-1 text-sm text-rose-500"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email (Optional) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your_email@gmail.com"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.email && touched.email
                            ? "border-rose-500 focus:ring-rose-500 focus:border-rose-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-hidden focus:ring-2 transition-all duration-200`}
                      />
                      {errors.email && touched.email && (
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
                      name="email"
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
                        Signing up...
                      </div>
                    ) : (
                      "Sign up"
                    )}
                  </button>
                </Form>
              )}
            </Formik>
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Already a user?
              </span>{" "}
              <Link
                href="/signin"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline transition-colors"
              >
                Login
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
