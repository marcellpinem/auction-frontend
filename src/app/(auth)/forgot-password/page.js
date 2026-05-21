"use client";

import { useState } from "react";

import Link from "next/link";

import { ArrowLeft, Loader2, LockKeyhole, MailCheck } from "lucide-react";

import api from "@/lib/axios";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email format"),
});

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ email }) => {
    try {
      await api.post("/auth/forgot-password", {
        email,
      });

      setSubmittedEmail(email);

      setSubmitted(true);
    } catch (err) {
      setError("root", {
        message:
          err.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  if (submitted) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#f7f7f7]
          px-4
          py-10
        "
      >
        <div
          className="
            w-full
            max-w-[460px]
            overflow-hidden
            rounded-[28px]
            border
            border-[#e8e8e8]
            bg-white
            shadow-[0_20px_60px_rgba(0,0,0,0.06)]
          "
        >
          {/* TOP */}
          <div
            className="
              border-b
              border-[#e8e8e8]
              bg-[radial-gradient(circle_at_top_right,rgba(2,74,216,0.06),transparent_45%)]
              px-8
              py-8
            "
          >
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-[#edf3ff]
              "
            >
              <MailCheck className="h-6 w-6 text-[#024ad8]" />
            </div>

            <h1
              className="
                mt-6
                text-[32px]
                font-semibold
                tracking-[-1px]
                text-[#1a1a1a]
              "
            >
              Check Your Email
            </h1>

            <p
              className="
                mt-3
                text-[15px]
                leading-7
                text-[#636363]
              "
            >
              We sent a password reset link to:
            </p>

            <p
              className="
                mt-2
                break-all
                text-[15px]
                font-semibold
                text-[#1a1a1a]
              "
            >
              {submittedEmail}
            </p>
          </div>

          {/* CONTENT */}
          <div className="px-8 py-8">
            <div
              className="
                rounded-2xl
                border
                border-[#e8e8e8]
                bg-[#fafafa]
                p-5
              "
            >
              <p
                className="
                  text-[14px]
                  leading-7
                  text-[#636363]
                "
              >
                The reset link will expire in 1 hour. If you don’t see the
                email, check your spam or junk folder.
              </p>
            </div>

            <Link
              href="/login"
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                text-[14px]
                font-medium
                text-[#024ad8]
              "
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-[#f7f7f7]
        px-4
        py-10
      "
    >
      <div
        className="
          w-full
          max-w-[460px]
          overflow-hidden
          rounded-[28px]
          border
          border-[#e8e8e8]
          bg-white
          shadow-[0_20px_60px_rgba(0,0,0,0.06)]
        "
      >
        {/* HEADER */}
        <div
          className="
            border-b
            border-[#e8e8e8]
            bg-[radial-gradient(circle_at_top_right,rgba(2,74,216,0.06),transparent_45%)]
            px-8
            py-8
          "
        >
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-[#edf3ff]
            "
          >
            <LockKeyhole className="h-6 w-6 text-[#024ad8]" />
          </div>

          <h1
            className="
              mt-6
              text-[32px]
              font-semibold
              tracking-[-1px]
              text-[#1a1a1a]
            "
          >
            Forgot Password
          </h1>

          <p
            className="
              mt-3
              max-w-md
              text-[15px]
              leading-7
              text-[#636363]
            "
          >
            Enter your account email and we’ll send a secure password reset
            link.
          </p>
        </div>

        {/* FORM */}
        <div className="px-8 py-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* EMAIL */}
            <div>
              <label
                className="
                  mb-2
                  block
                  text-[13px]
                  font-semibold
                  uppercase
                  tracking-[0.5px]
                  text-[#4a4a4a]
                "
              >
                Email Address
              </label>

              <input
                type="email"
                placeholder="email@example.com"
                {...register("email")}
                className="
                  h-12
                  w-full
                  rounded-[4px]
                  border
                  border-[#cfcfcf]
                  bg-white
                  px-4
                  text-[15px]
                  text-[#1a1a1a]
                  outline-none
                  transition-colors

                  placeholder:text-[#8a8a8a]

                  focus:border-[#1a1a1a]
                "
              />

              {errors.email && (
                <p
                  className="
                    mt-2
                    text-[13px]
                    text-[#dc2626]
                  "
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* ERROR */}
            {errors.root && (
              <div
                className="
                  rounded-2xl
                  border
                  border-[#fecaca]
                  bg-[#fff5f5]
                  px-4
                  py-3
                "
              >
                <p
                  className="
                    text-[13px]
                    leading-6
                    text-[#b42318]
                  "
                >
                  {errors.root.message}
                </p>
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-[4px]
                bg-[#024ad8]
                text-[14px]
                font-semibold
                uppercase
                tracking-[0.7px]
                text-white
                transition-opacity

                hover:opacity-90

                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}

              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-8">
            <Link
              href="/login"
              className="
                inline-flex
                items-center
                gap-2
                text-[14px]
                font-medium
                text-[#636363]
                transition-colors

                hover:text-[#1a1a1a]
              "
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
