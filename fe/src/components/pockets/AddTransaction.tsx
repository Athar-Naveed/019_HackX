"use client";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useTransition, useState } from "react";
import toast from "react-hot-toast";
import { createTransaction } from "@/handlers/transactions/transactionHandler";
import CreatableSelectField from "../ui/dropdown/Selectable";
import { motion } from "framer-motion";

const TransactionSchema = Yup.object().shape({
  to: Yup.string().required("Recipient is required"),
  from: Yup.string(),
  purpose: Yup.string().required("Purpose is required"),
  expenseType: Yup.string().oneOf(["Earning", "Spending"]).required(),
  txnAmount: Yup.number()
    .positive("Must be positive")
    .required("Amount is required"),
  category: Yup.string().required("Category is required"),
  status: Yup.string().oneOf(["Pending", "Completed"]).required(),
  pocketId: Yup.string().required("Pocket is required"),
});

const AddTransaction = ({
  pockets,
}: {
  pockets: Array<{ _id: string; pocketName: string }>;
}) => {
  const [isPending, startTransition] = useTransition();
  const [customPockets, setCustomPockets] = useState<
    Array<{ label: string; value: string }>
  >([]);

  const allPocketOptions = [
    ...pockets.map((p) => ({ label: p.pocketName, value: p._id })),
    ...customPockets,
  ];

  const initialValues = {
    to: "",
    from: "",
    purpose: "",
    expenseType: "Spending",
    txnAmount: 0,
    category: "",
    status: "Pending",
    pocketId: "",
  };

  const handleSubmit = (values: any, { resetForm }: any) => {
    startTransition(async () => {
      try {
        const resp = await createTransaction(values);
        if (resp.status === 201) {
          toast.success("Transaction created successfully!");
          resetForm();
        } else {
          toast.error(resp.message || "Failed to create transaction");
        }
      } catch (error) {
        console.error("Error creating transaction:", error);
        toast.error("Something went wrong!");
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={TransactionSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="bg-[#101828] border border-[#465fff]/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                Add Transaction
              </h2>
              <p className="text-white/60 text-sm sm:text-base">
                Record your income or expense transaction
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {/* To Field */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium mb-2 text-white/90">
                  To <span className="text-[#465fff]">*</span>
                </label>
                <Field
                  name="to"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#465fff] focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder="Recipient name"
                />
                {errors.to && touched.to && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs sm:text-sm mt-1.5 flex items-center gap-1"
                  >
                    <span>⚠</span> {errors.to}
                  </motion.div>
                )}
              </div>

              {/* From Field */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium mb-2 text-white/90">
                  From <span className="text-white/40 text-xs">(Optional)</span>
                </label>
                <Field
                  name="from"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#465fff] focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder="Sender name"
                />
              </div>

              {/* Purpose Field */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium mb-2 text-white/90">
                  Purpose <span className="text-[#465fff]">*</span>
                </label>
                <Field
                  name="purpose"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#465fff] focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder="Transaction purpose"
                />
                {errors.purpose && touched.purpose && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs sm:text-sm mt-1.5 flex items-center gap-1"
                  >
                    <span>⚠</span> {errors.purpose}
                  </motion.div>
                )}
              </div>

              {/* Expense Type */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white/90">
                  Type <span className="text-[#465fff]">*</span>
                </label>
                <Field
                  as="select"
                  name="expenseType"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#465fff] focus:border-transparent transition-all duration-200 text-sm sm:text-base cursor-pointer"
                >
                  <option value="Spending" className="bg-[#101828]">
                    Spending
                  </option>
                  <option value="Earning" className="bg-[#101828]">
                    Earning
                  </option>
                </Field>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white/90">
                  Amount <span className="text-[#465fff]">*</span>
                </label>
                <Field
                  type="number"
                  name="txnAmount"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#465fff] focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder="0.00"
                />
                {errors.txnAmount && touched.txnAmount && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs sm:text-sm mt-1.5 flex items-center gap-1"
                  >
                    <span>⚠</span> {errors.txnAmount}
                  </motion.div>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white/90">
                  Category <span className="text-[#465fff]">*</span>
                </label>
                <Field
                  name="category"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#465fff] focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder="e.g., Business, Personal"
                />
                {errors.category && touched.category && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs sm:text-sm mt-1.5 flex items-center gap-1"
                  >
                    <span>⚠</span> {errors.category}
                  </motion.div>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white/90">
                  Status <span className="text-[#465fff]">*</span>
                </label>
                <Field
                  as="select"
                  name="status"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#465fff] focus:border-transparent transition-all duration-200 text-sm sm:text-base cursor-pointer"
                >
                  <option value="Pending" className="bg-[#101828]">
                    Pending
                  </option>
                  <option value="Completed" className="bg-[#101828]">
                    Completed
                  </option>
                </Field>
              </div>

              {/* Pocket Selection - Full width on all screens */}
              <div className="mt-2">
                <CreatableSelectField
                  label="Pocket"
                  name="pocketId"
                  options={allPocketOptions}
                  onCreateOption={(newPocket) =>
                    setCustomPockets((prev) => [
                      ...prev,
                      { label: newPocket, value: newPocket },
                    ])
                  }
                />
                {errors.pocketId && touched.pocketId && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs sm:text-sm mt-1.5 flex items-center gap-1"
                  >
                    <span>⚠</span> {errors.pocketId}
                  </motion.div>
                )}
              </div>
            </div>

            <div className="mt-8 sm:mt-10 flex justify-end">
              <motion.button
                type="submit"
                disabled={isPending}
                whileHover={{ scale: isPending ? 1 : 1.02 }}
                whileTap={{ scale: isPending ? 1 : 0.98 }}
                className={`px-6 sm:px-8 lg:px-10 py-3 sm:py-3.5 rounded-lg text-white font-semibold text-sm sm:text-base transition-all duration-200 ${
                  isPending
                    ? "bg-white/10 cursor-not-allowed"
                    : "bg-[#465fff] hover:bg-[#465fff]/90 shadow-lg shadow-[#465fff]/20"
                }`}
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Adding...
                  </span>
                ) : (
                  "Add Transaction"
                )}
              </motion.button>
            </div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

export default AddTransaction;
