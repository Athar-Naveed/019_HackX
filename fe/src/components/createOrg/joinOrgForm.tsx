"use client"
import { verifyOrgHandler } from "@/handlers/orgHandler"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { Key, Loader2, CheckCircle2, AlertCircle, Building, Users } from "lucide-react"
import { useState } from "react"
import * as Yup from "yup"

const validationSchema = Yup.object().shape({
  inviteCode: Yup.string()
    .required("Invitation code is required")
    .min(8, "Invalid invitation code")
})

const JoinOrgForm = () => {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<null | "success" | "error">(null)
  const [orgDetails, setOrgDetails] = useState<{ name: string; members: number; type: string,owner:string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async (values: { inviteCode: string }) => {
    setLoading(true)
    try {
      const resp = await verifyOrgHandler(values);
      
      if (resp.status === 200) {
        setStatus("success")
        setOrgDetails(resp.message)
      } else {
        setStatus("error")
        setError(resp.message)
      }
    } catch (error:any) {
      setStatus(error.message)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <>
    <Formik
      initialValues={{ inviteCode: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({  errors, touched }) => (
        <Form className="space-y-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700">
                Invitation Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-brand-500" />
                </div>
                <Field
                autoComplete="off"
                  name="inviteCode"
                  type="text"
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg shadow-xs focus:ring-2 focus:ring-brand-300 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    status === "success"
                      ? "border-success-500"
                      : status === "error"
                        ? "border-error-500"
                        : touched.inviteCode && errors.inviteCode
                          ? "border-error-500"
                          : "border-gray-300"
                  }`}
                  placeholder="Enter your invitation code"
                />
                {(status || (touched.inviteCode && errors.inviteCode)) && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {status === "success" ? (
                      <CheckCircle2 className="h-5 w-5 text-success-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-error-500" />
                    )}
                  </div>
                )}
              </div>

              <ErrorMessage name="inviteCode" component="div" className="mt-2 text-sm text-error-600" />

              
                <p className="mt-2 text-sm text-gray-500">
                  The invitation code should have been shared with you by your organization admin.
                </p>
              
{status === "error" && error && (
                <div className="mt-2 text-sm text-error-600 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>{error}</span>
                </div>
              )}
              
            </div>

            {status === "success" && orgDetails && (
  <div className="rounded-lg overflow-hidden">
    {/* Header - stays the same in both themes */}
    <div className="bg-linear-to-r from-brand-600 to-brand-700 px-4 py-3">
      <h3 className="text-sm font-medium text-white flex items-center">
        <CheckCircle2 className="h-4 w-4 mr-2" />
        Valid invitation code
      </h3>
    </div>

    {/* Body - theme-aware */}
    <div className="bg-brand-50 dark:bg-gray-700 border border-brand-200 dark:border-gray-600 border-t-0 rounded-b-lg p-4">
      <div className="flex items-center mb-3">
        <div className="shrink-0 h-10 w-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400">
          <Building className="h-5 w-5" />
        </div>
        <div className="ml-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            {orgDetails.name}
          </h4>
          <div className="flex items-center mt-1 text-xs">
            <span className="bg-brand-100 dark:bg-brand-900/20 text-brand-800 dark:text-brand-200 text-xs px-2 py-0.5 rounded-full">
              {orgDetails.type}
            </span>
          </div>
        </div>
      </div>

       {/* Add owner info if available  */}
      {orgDetails.owner && (
        <div className="flex items-center mt-3 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Owner:</span> {orgDetails.owner}
          </span>
        </div>
      )}
      <div className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <Users className="h-4 w-4 text-gray-400 mr-2" />
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {orgDetails.members} members
        </span>
      </div>

    </div>
  </div>
)}
          </div>
        
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 border border-transparent rounded-lg shadow-xs text-sm font-medium text-white bg-linear-to-r from-brand-600 to-theme-purple-500 hover:from-brand-700 hover:to-theme-purple-500 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Joining...
                </>
              ) : (
                "Join Organization"
              )}
            </button>
          </div>
        
        </Form>
      )}
    </Formik>
    {status === "success" && orgDetails && (
      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center">
          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-sm text-green-700">
            You have successfully joined the organization: <strong>{orgDetails.name}</strong>
          </span>
        </div>
      </div>
    )}
</>
)}

export default JoinOrgForm