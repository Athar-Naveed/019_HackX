"use client";

import { Formik, Form, FieldArray, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { createInventory } from "@/handlers/inventoryHandler";
import CreatableSelectField from "../ui/dropdown/Selectable";
import OrderTemplate from "./OrderTemplate";

import { placeOrder } from "@/handlers/orderHandler";
import { Organization } from "@/types";
import { orderStatusOptions, unitOptions } from "@/data/constants";

const validationSchema = Yup.object().shape({
  organizationId: Yup.string().required("Organization ID is required"),
  orderStatus: Yup.string()
    .required("Order status is required")
    .default("Pending"),
  personName: Yup.string().nullable(),
  personNumber: Yup.string()
    .matches(
      /^(?:\d{3}-\d{7,8}|(?:\+\d{1,4}[ ]?)?(?:\(\d{1,3}\)[ ]?)?\d{3,14}(?:[ -]?\d{2,13})?)$/,
      "Invalid phone number format"
    )
    .nullable(),
  products: Yup.array()
    .of(
      Yup.object().shape({
        productName: Yup.string().required("Product name is required"),
        productPrice: Yup.number()
          .required("Price is required")
          .min(1, "Price must be a positive number"),
        productQuantity: Yup.number()
          .required("Quantity is required")
          .min(1, "Quantity must be a positive number"),
        productUnit: Yup.string()
          .matches(/^[A-Za-z\s]+$/, "Only letters and spaces allowed")
          .trim(),
      })
    )
    .min(1, "At least one product is required"),
});

const CreateOrder = ({
  organizationData,
  orgId,
  unit,
  setOrgId,
}: {
  organizationData: Organization[] | null;
  orgId: string;
  unit: string;
  setOrgId: any;
}) => {
  const [customUnits, setCustomUnits] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [preview, setPreview] = useState<boolean>(false);
  const [orderDetails, setOrderDetails] = useState<{
    organizationId: string;
    products: any[];
    orderStatus: string;
  }>({ organizationId: "", products: [], orderStatus: "Pending" });
  const [message, setMessage] = useState<string | null>(null);

  const handlePreview = (data: any) => {
    setPreview(true);
    setOrderDetails(data);
  };

  const allUnitOptions = [
    ...unitOptions,
    ...customUnits.map((unit) => ({ label: unit.value, value: unit.value })),
  ];

  const orgName = organizationData?.find(
    (value: any) => value._id === orgId
  )?.orgName;

  return (
    <div className="sm:px-4 py-8 w-full">
      <Formik
        initialValues={{
          organizationId: orgId,
          personName: "",
          personNumber: "",
          orderStatus: "Pending",
          products: [
            {
              productName: "",
              productPrice: 1,
              priceUnit: unit,
              productQuantity: 1,
              productUnit: "kg",
            },
          ],
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          console.log("Form submitted with values:", values);
          setMessage(null); // Clear previous messages
          setSubmitting(true); // Ensure isSubmitting is true

          try {
            // Create a new object to avoid mutating form values
            const payload = {
              ...values,
              organizationId: orgId, // Ensure orgId is set
            };
            console.log("Sending payload to placeOrder:", payload);

            const resp = await placeOrder(payload);
            console.log("placeOrder response:", resp);

            if (resp.status === 200) {
              setMessage("Order created successfully!");
            } else {
              setMessage(resp.message || "Failed to create order");
            }
          } catch (error: any) {
            console.error("Error in placeOrder:", error);
            setMessage(
              error.message || "An error occurred while creating the order"
            );
          } finally {
            setSubmitting(false); // Always reset isSubmitting
          }
        }}
      >
        {({ values, isSubmitting, setFieldValue }) => (
          <Form className="space-y-8">
            {/* Organization Selection */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 border-b pb-2">
                Choose Organization
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {organizationData && organizationData.length > 0 ? (
                  <div>
                    <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1">
                      Organization
                    </label>
                    <select
                      name="organizationId"
                      value={orgId}
                      onChange={(e) => {
                        const newOrgId = e.target.value;
                        setOrgId(newOrgId);
                        setFieldValue("organizationId", newOrgId); // Update Formik's value
                      }}
                      className="inputFields"
                    >
                      {organizationData.map((org: any, index: number) => (
                        <option key={index} value={org._id}>
                          {org.orgName}
                        </option>
                      ))}
                    </select>
                    <ErrorMessage
                      name="organizationId"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1">
                      Organization ID
                    </label>
                    <Field
                      name="organizationId"
                      type="text"
                      value={orgId}
                      readOnly
                      className="inputFields"
                    />
                    <ErrorMessage
                      name="organizationId"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Inventory Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 border-b pb-2">
                Create Order
              </h2>
              <FieldArray name="products">
                {({ remove, push }) => (
                  <div className="space-y-6">
                    {values.products.map((_, index) => (
                      <div key={index} className="md:p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1">
                              Product Name
                            </label>
                            <Field
                              name={`products.${index}.productName`}
                              placeholder="Product Name"
                              className="inputFields"
                            />
                            <ErrorMessage
                              name={`products.${index}.productName`}
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1">
                              Product Price
                            </label>
                            <Field
                              name={`products.${index}.productPrice`}
                              type="number"
                              placeholder="Price"
                              className="inputFields"
                            />
                            <ErrorMessage
                              name={`products.${index}.productPrice`}
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1">
                              Product Quantity
                            </label>
                            <Field
                              name={`products.${index}.productQuantity`}
                              type="number"
                              placeholder="Quantity"
                              className="inputFields"
                            />
                            <ErrorMessage
                              name={`products.${index}.productQuantity`}
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                          <CreatableSelectField
                            label="Product Unit (Optional)"
                            name={`products.${index}.productUnit`}
                            options={allUnitOptions}
                            onCreateOption={(newUnit) => {
                              setCustomUnits((prev) => [
                                ...prev,
                                { label: newUnit, value: newUnit },
                              ]);
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="bg-red-500 rounded-xl text-white px-6 py-2"
                        >
                          - Remove Product
                        </button>
                      </div>
                    ))}

                    <CreatableSelectField
                      label="Order Status (Optional)"
                      name="orderStatus"
                      options={orderStatusOptions}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        push({
                          productName: "",
                          productPrice: 0,
                          priceUnit: unit,
                          productQuantity: 0,
                          productUnit: "kg",
                        })
                      }
                      className="bg-green-500 text-white px-4 py-2 rounded-md"
                    >
                      + Add Product
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            {/* Customer Details Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 border-b pb-2">
                Customer Details (Optional)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1">
                    Customer Name
                  </label>
                  <Field
                    name="personName"
                    type="text"
                    placeholder="e.g., Arif Lohaar..."
                    className="inputFields"
                  />
                  <ErrorMessage
                    name="personName"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1">
                    Customer Number
                  </label>
                  <Field
                    name="personNumber"
                    type="string"
                    placeholder="e.g., 0300-1234567..."
                    className="inputFields"
                  />
                  <ErrorMessage
                    name="personNumber"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Total Price and Submit Button */}
            <div className="flex flex-col space-y-6">
              <div className="flex items-center gap-4">
                <label className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
                  Total Price:
                </label>
                <span className="text-gray-dark dark:text-white">
                  {unit}{" "}
                  {values.products.reduce(
                    (sum, p) => sum + p.productPrice * p.productQuantity,
                    0
                  )}
                </span>
              </div>
              <div className="grid md:flex gap-5 mb-5">
                <button
                  type="button"
                  onClick={() => handlePreview(values)}
                  className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200"
                >
                  Preview/Download Invoice
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full md:w-auto bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200 ${
                    isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Create an order"}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      {/* Message Display */}
      {message && (
        <div
          className={`mt-4 p-4 rounded-md ${
            message.toLowerCase().includes("success")
              ? "bg-green-100 text-green-800"
              : "bg-red-500 text-white"
          }`}
        >
          {message}
        </div>
      )}
      {preview && (
        <OrderTemplate
          orderDetail={orderDetails}
          orgName={orgName}
          setPreview={setPreview}
        />
      )}
    </div>
  );
};

export default CreateOrder;
