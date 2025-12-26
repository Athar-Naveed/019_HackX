"use client";
import React from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

// Validation schema using Yup
const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^\+?[0-9\s]{6,15}$/, "Invalid phone number")
    .required("Phone number is required"),
  bio: Yup.string().max(100, "Bio must be 100 characters or less"),
  facebook: Yup.string().url("Invalid URL").nullable(),
  xcom: Yup.string().url("Invalid URL").nullable(),
  linkedin: Yup.string().url("Invalid URL").nullable(),
  instagram: Yup.string().url("Invalid URL").nullable(),
});

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();

  // Initial values for the form
  const initialValues = {
    firstName: "Musharof",
    lastName: "Chowdhury",
    email: "randomuser@pimjo.com",
    phone: "+09 363 398 46",
    bio: "Team Manager",
    facebook: "https://www.facebook.com/PimjoHQ",
    xcom: "https://x.com/PimjoHQ",
    linkedin: "https://www.linkedin.com/company/pimjo",
    instagram: "https://instagram.com/PimjoHQ",
  };

  // Handle form submission
  interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio: string;
    facebook: string | null;
    xcom: string | null;
    linkedin: string | null;
    instagram: string | null;
  }

  interface FormSubmitHelpers {
    setSubmitting: (isSubmitting: boolean) => void;
  }

  const handleSubmit = (
    values: FormValues,
    { setSubmitting }: FormSubmitHelpers
  ): void => {
    console.log("Saving changes:", values);
    setSubmitting(false);
    closeModal();
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                First Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {initialValues.firstName}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Last Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {initialValues.lastName}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {initialValues.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {initialValues.phone}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Bio
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {initialValues.bio}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Edit
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="flex flex-col">
                <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                  <div>
                    <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                      Social Links
                    </h5>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                      <div>
                        <label>Facebook</label>
                        <Field
                          name="facebook"
                          type="text"
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.facebook && touched.facebook
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors.facebook && touched.facebook && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.facebook}
                          </p>
                        )}
                      </div>

                      <div>
                        <label>X.com</label>
                        <Field
                          name="xcom"
                          type="text"
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.xcom && touched.xcom
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors.xcom && touched.xcom && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.xcom}
                          </p>
                        )}
                      </div>

                      <div>
                        <label>Linkedin</label>
                        <Field
                          name="linkedin"
                          type="text"
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.linkedin && touched.linkedin
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors.linkedin && touched.linkedin && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.linkedin}
                          </p>
                        )}
                      </div>

                      <div>
                        <label>Instagram</label>
                        <Field
                          name="instagram"
                          type="text"
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.instagram && touched.instagram
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors.instagram && touched.instagram && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.instagram}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-7">
                    <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                      Personal Information
                    </h5>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                      <div className="col-span-2 lg:col-span-1">
                        <label>First Name</label>
                        <Field
                          name="firstName"
                          type="text"
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.firstName && touched.firstName
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors.firstName && touched.firstName && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.firstName}
                          </p>
                        )}
                      </div>

                      <div className="col-span-2 lg:col-span-1">
                        <label>Last Name</label>
                        <Field
                          name="lastName"
                          type="text"
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.lastName && touched.lastName
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors.lastName && touched.lastName && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.lastName}
                          </p>
                        )}
                      </div>

                      <div className="col-span-2 lg:col-span-1">
                        <label>Email Address</label>
                        <Field
                          name="email"
                          type="text"
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.email && touched.email
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors.email && touched.email && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div className="col-span-2 lg:col-span-1">
                        <label>Phone</label>
                        <Field
                          name="phone"
                          type="text"
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.phone && touched.phone
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors.phone && touched.phone && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      <div className="col-span-2">
                        <label>Bio</label>
                        <Field
                          name="bio"
                          type="text"
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.bio && touched.bio
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors.bio && touched.bio && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    onClick={closeModal}
                  >
                    Close
                  </Button>
                  <Button size="sm" type="submit" disabled={isSubmitting}>
                    Save Changes
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </div>
  );
}
