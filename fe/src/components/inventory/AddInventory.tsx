"use client";

import {
  Formik,
  Form,
  useField,
  Field,
  ErrorMessage,
  FieldArray,
} from "formik";
import CreatableSelect from "react-select/creatable";
import * as Yup from "yup";
import { useState } from "react";
import { createInventory } from "@/handlers/inventoryHandler";
import CreatableSelectField from "../ui/dropdown/Selectable";

const productSchema = Yup.object().shape({
  productImage: Yup.string().url("Must be a valid URL").nullable(),
  productName: Yup.string().required("Product name is required"),
  productPrice: Yup.number()
    .required("Price is required")
    .min(0, "Price must be a positive number"),
  productQuantity: Yup.number()
    .required("Quantity is required")
    .min(0, "Quantity must be a positive number"),
  productUnit: Yup.string()
    .matches(
      /^[A-Za-z\s]+$/,
      "Only letters and spaces allowed (no numbers/symbols)"
    )
    .trim(), // Removes extra whitespace
  productSeller: Yup.string(),
  productSellerNumber: Yup.string()
    .matches(
      /^(?:\d{3}-\d{7,8}|(?:\+\d{1,4}[ ]?)?(?:\(\d{1,3}\)[ ]?)?\d{3,14}(?:[ -]?\d{2,13})?)$/,
      "Invalid phone number format"
    )
    .nullable(),
});

const validationSchema = Yup.object().shape({
  organizationId: Yup.string().required("Organization is required"),
  products: Yup.array()
    .of(productSchema)
    .min(1, "At least one product is required"),
});

const unitOptions = [
  { label: "kg", value: "kg" },
  { label: "g", value: "g" },
  { label: "liters", value: "liters" },
  { label: "pieces", value: "pieces" },
];

const AddInventory = ({
  organizationData,
  orgId,
  unit,
  setOrgId,
}: {
  organizationData: any[] | null;
  orgId: string;
  unit: string;
  setOrgId: any;
}) => {
  const [customUnits, setCustomUnits] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [sameSeller, setSameSeller] = useState(false);

  const allUnitOptions = [
    ...unitOptions,
    ...customUnits.map((unit) => ({ label: unit.value, value: unit.value })),
  ];
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="px-4 py-8 w-full">
      <Formik
        initialValues={{
          organizationId: orgId || "",
          products: [
            {
              productImage: "",
              productName: "",
              productPrice: 0,
              productQuantity: 0,
              productUnit: "kg",
              productSeller: "",
              productSellerNumber: "",
            },
          ],
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          values.organizationId = orgId;
          // If same seller, apply to all products
          if (sameSeller && values.products.length > 1) {
            const firstSeller = values.products[0].productSeller;
            const firstSellerNumber = values.products[0].productSellerNumber;
            values.products.forEach((product: any, index: number) => {
              if (index > 0) {
                product.productSeller = firstSeller;
                product.productSellerNumber = firstSellerNumber;
              }
            });
          }
          try {
            const results = await Promise.all(
              values.products.map(async (product: any) => {
                const productData = {
                  ...product,
                  organizationId: orgId,
                  priceUnit: unit,
                };
                return await createInventory(productData);
              })
            );
            const successes = results.filter((r) => r.status === 200);
            const failures = results.filter((r) => r.status !== 200);
            if (failures.length === 0) {
              setMessage(`Successfully added ${successes.length} product(s)`);
            } else {
              setMessage(
                `Added ${successes.length} product(s), failed ${failures.length}`
              );
            }
          } catch (error) {
            setMessage(`${error}`);
          } finally {
            setTimeout(() => {
              if (message?.includes("Successfully")) {
                resetForm();
                setSameSeller(false);
              }
            }, 5000);
          }
        }}
      >
        {({ values, isSubmitting }) => (
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
                        setOrgId(e.currentTarget.value);
                      }}
                      className="inputFields"
                    >
                      {organizationData.map((org: any, index: number) => (
                        <option key={index} value={org._id}>
                          {org.orgName}
                        </option>
                      ))}
                    </select>
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
                  </div>
                )}
              </div>
            </div>

            {/* Inventory Section */}
            <FieldArray name="products">
              {({ push, remove }) => (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 border-b pb-2">
                      Products
                    </h2>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
                        <input
                          type="checkbox"
                          checked={sameSeller}
                          onChange={(e) => setSameSeller(e.target.checked)}
                        />
                        Use same seller for all products
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          push({
                            productImage: "",
                            productName: "",
                            productPrice: 0,
                            productQuantity: 0,
                            productUnit: "kg",
                            productSeller: "",
                            productSellerNumber: "",
                          })
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                      >
                        Add Product
                      </button>
                    </div>
                  </div>
                  {values.products.map((product: any, index: number) => (
                    <div
                      key={index}
                      className="border border-gray-300 dark:border-gray-600 p-4 rounded-md space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
                          Product {index + 1}
                        </h3>
                        {values.products.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1">
                            Product Name
                          </label>
                          <Field
                            name={`products.${index}.productName`}
                            type="text"
                            placeholder="Rice, Oil, Soap..."
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
                            min={0}
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
                            min={0}
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
                      {(!sameSeller || index === 0) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1">
                              Seller Name
                            </label>
                            <Field
                              name={`products.${index}.productSeller`}
                              type="text"
                              placeholder="e.g., Arif Lohaar..."
                              className="inputFields"
                            />
                            <ErrorMessage
                              name={`products.${index}.productSeller`}
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1">
                              Seller Number
                            </label>
                            <Field
                              name={`products.${index}.productSellerNumber`}
                              type="string"
                              placeholder="e.g., 0300-1234567..."
                              className="inputFields"
                            />
                            <ErrorMessage
                              name={`products.${index}.productSellerNumber`}
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <label className="text-lg font-medium text-zinc-800 dark:text-zinc-200">
                          Total Price:
                        </label>
                        <span className="text-gray-dark dark:text-white">
                          {unit}{" "}
                          {product.productPrice * product.productQuantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </FieldArray>

            {/* Overall Total Price */}
            <div className="flex items-center gap-4 justify-center">
              <label className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
                Overall Total Price:
              </label>
              <span className="text-xl text-gray-dark dark:text-white">
                {unit}{" "}
                {values.products.reduce(
                  (sum: number, product: any) =>
                    sum + product.productPrice * product.productQuantity,
                  0
                )}
              </span>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200"
              >
                {isSubmitting ? "Submitting..." : "Add Inventory"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
      {/* Message Display */}
      {message && (
        <div
          className={`mt-4 p-4 ${
            message.toLowerCase().includes("success")
              ? "bg-green-100 text-green-800"
              : message.toLowerCase().includes("error")
              ? "bg-red-500 text-white"
              : "bg-blue-500 text-white"
          } rounded-md`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default AddInventory;
