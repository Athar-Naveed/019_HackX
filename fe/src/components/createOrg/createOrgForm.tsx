"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  Building,
  Globe2Icon,
  Loader2,
  MailIcon,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";
import * as Yup from "yup";
import DefaultModal from "../example/ModalExample/DefaultModal";
import { createOrgHandler } from "@/handlers/orgHandler";
import { orgTypes } from "@/data/constants";

const CreateOrgForm = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validationSchema = Yup.object({
    orgName: Yup.string()
      .required("Organization name is required")
      .min(3, "Organization name must contain 3 or more than 3 chars."),
    orgType: Yup.string().required("Organization type is required"),
    orgCity: Yup.string().required("Organization city is required"),
    orgCountry: Yup.string().required("Organization country is required"),
    orgEmail: Yup.string()
      .email("Invalid Email!")
      .matches(
        /^[^+@\s]+@[^@\s]+\.[^@\s]+$/,
        "Invalid email format (no '+' allowed and must include '@')"
      ),
    anotherOwner: Yup.string()
      .email("Invalid email address")
      .matches(/^[^+]*$/, "Email must not contain '+'"),
    noOfEmployees: Yup.number()
      .typeError("Must be a number")
      .min(0, "Number of employees cannot be negative"),
    orgDescription: Yup.string(),
  });

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const resp = await createOrgHandler(values);

      if (resp.status == 403) {
        setErrorMessage(resp.message);
      } else {
        setSuccessMessage(resp.message.message);
      }
    } catch (error: any) {
      setErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          orgName: "",
          orgType: "",
          orgDescription: "",
          orgCity: "",
          orgCountry: "",
          anotherOwner: "",
          orgEmail: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form className="space-y-6">
            <div className="space-y-5">
              {/* Organization Name */}
              <div className="space-y-2">
                <label
                  htmlFor="orgName"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Dukaan Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-brand-500" />
                  </div>
                  <Field
                    id="orgName"
                    name="orgName"
                    type="text"
                    placeholder="NavTech."
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-xs focus:ring-2 focus:ring-brand-300 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <ErrorMessage
                  name="orgName"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              {/* Organization Email */}
              <div className="space-y-2">
                <label
                  htmlFor="orgEmail"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Dukaan Email (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className="h-5 w-5 text-brand-500" />
                  </div>
                  <Field
                    id="orgEmail"
                    name="orgEmail"
                    type="text"
                    placeholder="one.navtech.solutions@gmail.com"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-xs focus:ring-2 focus:ring-brand-300 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <ErrorMessage
                  name="orgEmail"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              {/* Another Owner */}
              <div className="space-y-2">
                <label
                  htmlFor="anotherOwner"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Another Owner Email (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className="h-5 w-5 text-brand-500" />
                  </div>
                  <Field
                    id="anotherOwner"
                    name="anotherOwner"
                    type="text"
                    placeholder="one.navtech.solutions@gmail.com"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-xs focus:ring-2 focus:ring-brand-300 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <ErrorMessage
                  name="anotherOwner"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Organization Type (Select) */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label
                    htmlFor="orgType"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Dukaan Type
                  </label>

                  <DefaultModal
                    data={orgTypes}
                    icon={"/images/icons/info.svg"}
                    title={"Organization Types with Details"}
                  />
                </div>
                <Field
                  as="select"
                  id="orgType"
                  name="orgType"
                  className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">Choose an organization type</option>
                  <option value="Sole Proprietorship">
                    Sole Proprietorship
                  </option>
                  <option value="Partnership">Partnership</option>
                  <option value="Private Limited Company">
                    Private Limited Company
                  </option>
                  <option value="Public Limited Company">
                    Public Limited Company
                  </option>
                  <option value="Non-Profit / NGO">Non-Profit / NGO</option>
                  <option value="Trust">Trust</option>
                  <option value="Society">Society</option>
                  <option value="Cooperative Society">
                    Cooperative Society
                  </option>
                  <option value="Government / Semi-Government Organization">
                    Government / Semi-Government Organization
                  </option>
                </Field>
                <ErrorMessage
                  name="orgType"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              {/* Organization Location */}
              <div className="grid md:flex gap-3">
                <div className="space-y-2">
                  <label
                    htmlFor="orgCity"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Dukaan City
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe2Icon className="h-5 w-5 text-brand-500" />
                    </div>
                    <Field
                      id="orgCity"
                      name="orgCity"
                      type="text"
                      placeholder="Lahore"
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-xs focus:ring-2 focus:ring-brand-300 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <ErrorMessage
                    name="orgCity"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="orgCountry"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Dukan Country
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe2Icon className="h-5 w-5 text-brand-500" />
                    </div>
                    <Field
                      id="orgCountry"
                      name="orgCountry"
                      type="text"
                      placeholder="Pakistan"
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-xs focus:ring-2 focus:ring-brand-300 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <ErrorMessage
                    name="orgCountry"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>
              {/* Number of Employees */}
              <div className="space-y-2">
                <label
                  htmlFor="noOfEmployees"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  No. of Employees (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UsersIcon className="h-5 w-5 text-brand-500" />
                  </div>
                  <Field
                    id="noOfEmployees"
                    name="noOfEmployees"
                    type="number"
                    min={0}
                    placeholder="5"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-xs focus:ring-2 focus:ring-brand-300 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
      [&::-webkit-inner-spin-button]:appearance-none 
      [&::-webkit-outer-spin-button]:appearance-none 
      [appearance:textfield]" // Firefox fix
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "-" || e.key === "e") {
                        e.preventDefault();
                      }
                    }}
                  />
                  <ErrorMessage
                    name="noOfEmployees"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>

              {/* Organization Description */}
              <div className="space-y-2">
                <label
                  htmlFor="orgDescription"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description (Optional)
                </label>
                <Field
                  as="textarea"
                  id="orgDescription"
                  name="orgDescription"
                  rows={3}
                  placeholder="Tell us about your organization..."
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-xs focus:ring-2 focus:ring-brand-300 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <ErrorMessage
                  name="orgDescription"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || !values.orgName}
                className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 border border-transparent rounded-lg shadow-xs text-sm font-medium text-white bg-linear-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Creating...
                  </>
                ) : (
                  "Create Organization"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
      {successMessage && (
        <div className="error p-4 text-center rounded-xl my-5 bg-green-500 text-white">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="error p-4 text-center rounded-xl my-5 bg-violet-500 text-white">
          {errorMessage}
        </div>
      )}
    </>
  );
};

export default CreateOrgForm;
