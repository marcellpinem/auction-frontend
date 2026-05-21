"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!token) {
      router.replace("/forgot-password");
    }
  }, [token, router]);

  const onSubmit = async ({ password, confirmPassword }) => {
    try {
      await api.post("/auth/reset-password", {
        token,
        password,
        confirmPassword,
      });

      setSuccess(true);

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      setError("root", {
        message:
          err.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  if (!token) return null;

  if (success) {
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
              bg-[radial-gradient(circle_at_top_right,rgba(22,163,74,0.08),transparent_45%)]
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
                bg-[#ecfdf3]
              "
            >
              <Check className="h-6 w-6 text-[#16a34a]" />
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
              Password Reset Successful
            </h1>

            <p
              className="
                mt-3
                text-[15px]
                leading-7
                text-[#636363]
              "
            >
              All active sessions have been logged out. Redirecting you to the
              login page...
            </p>
          </div>

          {/* CONTENT */}
          <div className="px-8 py-8">
            <Link
              href="/login"
              className="
                inline-flex
                items-center
                gap-2
                text-[14px]
                font-medium
                text-[#024ad8]
              "
            >
              <ArrowLeft className="h-4 w-4" />
              Login now
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
            <Lock className="h-6 w-6 text-[#024ad8]" />
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
            Reset Password
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
            Create a new secure password for your account.
          </p>
        </div>

        {/* FORM */}
        <div className="px-8 py-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* PASSWORD */}
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
                New Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  {...register("password")}
                  className="
                    h-12
                    w-full
                    rounded-[4px]
                    border
                    border-[#cfcfcf]
                    bg-white
                    px-4
                    pr-12
                    text-[15px]
                    text-[#1a1a1a]
                    outline-none
                    transition-colors

                    placeholder:text-[#8a8a8a]

                    focus:border-[#1a1a1a]
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-[#7a7a7a]
                    transition-colors

                    hover:text-[#1a1a1a]
                  "
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p
                  className="
                    mt-2
                    text-[13px]
                    text-[#dc2626]
                  "
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* CONFIRM */}
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
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat new password"
                  {...register("confirmPassword")}
                  className="
                    h-12
                    w-full
                    rounded-[4px]
                    border
                    border-[#cfcfcf]
                    bg-white
                    px-4
                    pr-12
                    text-[15px]
                    text-[#1a1a1a]
                    outline-none
                    transition-colors

                    placeholder:text-[#8a8a8a]

                    focus:border-[#1a1a1a]
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-[#7a7a7a]
                    transition-colors

                    hover:text-[#1a1a1a]
                  "
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p
                  className="
                    mt-2
                    text-[13px]
                    text-[#dc2626]
                  "
                >
                  {errors.confirmPassword.message}
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

              {isSubmitting ? "Saving..." : "Reset Password"}
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
