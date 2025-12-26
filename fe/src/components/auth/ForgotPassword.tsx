"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {  useState } from "react";
import * as Yup from "yup";
import adminStore from "@/store/adminStore";
import Link from "next/link";
import { forgotPasswordHandler } from "@/handlers/loginHandler";
import Otp from "./OTPPage";
import NewPasswordForm from "./NewPassword";

const validationSchema = Yup.object().shape({
  email: Yup.string()
        .email("Invalid email address")
        .matches(/^[^+]*$/, "Email must not contain '+'")
        .required("Email is required"),
});

const Forgot = () => {
  const { email, setEmail } = adminStore();
  const [otp,showOTP] = useState(false);
  const [newPasswordForm,setNewPasswordForm] = useState(false);
  const [error, setError] = useState("");
  
  
  return (
    otp ? <Otp showOTP={showOTP} setNewPasswordForm={setNewPasswordForm} />: newPasswordForm ? <NewPasswordForm email={email} /> :

        <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-gray-800 p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-8 space-y-6">
        <div className="text-center text-gray-900 dark:text-white">
          <h1 className="text-3xl font-bold">Forgot Password</h1>
          <p className="mt-2 text-gray-600">
            Enter your email to receive a password reset OTP
          </p>
        </div>
        
        <Formik
          initialValues={{ email: email }}
          validationSchema={validationSchema}
          onSubmit={async(values) => {
            const resp = await forgotPasswordHandler(values);
          
            setEmail(values.email);
            if (resp.status === 200) {
                showOTP(true);
                }
            else if (resp.status === 404) {
                setError(resp.message.message);
            }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <Field
                  id="email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-hidden focus:ring-2 transition-all ${
                    errors.email && touched.email
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-hidden focus:ring-2 transition-all duration-200`}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send OTP'}
              </button>
            </Form>
          )}
        </Formik>
        
        <div className="text-center text-sm text-gray-500">
          Remember your password?{' '}
          <Link
            href={"/signin"}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
            Sign in
            </Link>
        </div>
        {error && (
            <div
              className={`px-8 py-4 text-sm bg-rose-50 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-t border-rose-200 dark:border-rose-800`}
            >
              <div className="flex items-center">
                 
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
                
                {error}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Forgot;