"use client";

import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import CreatableSelectField from "../ui/dropdown/Selectable";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { pocketOptions } from "@/data/constants";
import { createPocket } from "@/handlers/pockets/pocketHandler";
import { IPocket } from "@/types";
import toast from "react-hot-toast";

// Validation Schema
const PocketSchema = Yup.object().shape({
  pocketName: Yup.string()
    .required("Pocket Name is required")
    .min(2, "Too short!")
    .max(50, "Too long!"),
  pocketBalance: Yup.number(),
  pocketType: Yup.string().required("Pocket Type is required"),
  organizationId: Yup.string().optional(), // optional
});

const NewPocket = ({
  isEditing,
  setIsEditing,
}: {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}) => {
  const [customType, setCustomType] = useState<
    Array<{ label: string; value: string }>
  >([]);

  // useTransition instead of loading state
  const [isPending, startTransition] = useTransition();

  const allUnitOptions = [
    ...pocketOptions,
    ...customType.map((pocketType) => ({
      label: pocketType.value,
      value: pocketType.value,
    })),
  ];

  const initialValues = {
    pocketName: "",
    pocketBalance: 0,
    pocketType: "",
    organizationId: "",
  };

  const handleSubmit = (values: {
    pocketName: string;
    pocketBalance: number;
    pocketType: string;
    organizationId: string;
  }) => {
    startTransition(async () => {
      try {
        const resp = await createPocket(values);
        console.log("Pocket creation response:", resp);
        if (resp.status === 201) {
          setIsEditing(false);
          toast.success(resp.message, {
            position: "top-right",
            duration: 3000,
          });
        }
      } catch (error) {
        console.error("Error creating pocket:", error);
      }
    });
  };

  return (
    <>
      {!isEditing ? (
        <button onClick={() => setIsEditing(true)}>
          <div className="pocket text-black bg-gray-800/60 dark:text-white border border-gray-800 rounded-md m-3">
            <div className="flex justify-center items-center gap-2 p-5">
              <div className="pocket-title text-slate-400 text-2xl">
                <h1>Create New Pocket</h1>
              </div>
              <div className="expense-type text-gray-400">
                <Plus />
              </div>
            </div>
          </div>
        </button>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={PocketSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="bg-gray-800/60 border border-gray-800 rounded-md m-3 p-5 space-y-4 text-white">
              <div>
                <label className="block text-sm mb-1">Pocket Name</label>
                <Field
                  name="pocketName"
                  className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white"
                  placeholder="Enter Pocket Name"
                />
                {errors.pocketName && touched.pocketName && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.pocketName}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm mb-1">
                  Pocket Balance (Optional)
                </label>
                <Field
                  name="pocketBalance"
                  className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white"
                  placeholder="Enter Pocket Balance"
                />
                {errors.pocketBalance && touched.pocketBalance && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.pocketBalance}
                  </div>
                )}
              </div>

              <div>
                <CreatableSelectField
                  label="Pocket Type"
                  name="pocketType"
                  options={allUnitOptions}
                  onCreateOption={(newType) =>
                    setCustomType((prev) => [
                      ...prev,
                      { label: newType, value: newType },
                    ])
                  }
                />
                {errors.pocketType && touched.pocketType && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.pocketType}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1">
                  Organization ID (optional)
                </label>
                <Field
                  name="organizationId"
                  className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white"
                  placeholder="Leave blank if not referencing"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isPending}
                  className={`px-4 py-2 rounded-md text-white ${
                    isPending
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isPending ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md text-white"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

export default NewPocket;
