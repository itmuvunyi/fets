"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, X, ShieldAlert, ShieldCheck } from "lucide-react";
import { SocialLoginButtons } from "./social-login-buttons";
import { InputField } from "./input-field";
import { AuthButton } from "./auth-button";
import { useAuth } from "@/lib/auth";
import { addToast } from "@/lib/toast";

export const AuthPage = () => {
  const router = useRouter();
  const { login, register, isLoading: authLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const passwordValidation = useMemo(() => {
    const { password } = formData;
    return {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
    };
  }, [formData.password]);

  const passwordStrength = useMemo(() => {
    const values = Object.values(passwordValidation);
    const metCount = values.filter(Boolean).length;
    if (metCount === 0) return { label: "", color: "bg-gray-200" };
    if (metCount < 3) return { label: "Weak", color: "bg-red-500" };
    if (metCount < 5) return { label: "Medium", color: "bg-yellow-500" };
    return { label: "Strong", color: "bg-green-500" };
  }, [passwordValidation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const success = await login(formData.email, formData.password);
        if (success) {
          router.push("/dashboard");
        }
      } else {
        // Validation for Register
        if (formData.password !== formData.confirmPassword) {
          addToast({
            title: "Error",
            description: "Passwords do not match",
            type: "error",
          });
          setLoading(false);
          return;
        }

        const isStrong = Object.values(passwordValidation).every(Boolean);
        if (!isStrong) {
          addToast({
            title: "Error",
            description: "Please use a stronger password",
            type: "error",
          });
          setLoading(false);
          return;
        }

        const success = await register(
          formData.email,
          formData.password,
          formData.name,
        );
        if (success) {
          // Small delay to ensure the user sees the toast and the session is processed
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      addToast({
        title: "Error",
        description: "An unexpected error occurred",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = (e: React.MouseEvent) => {
    e.preventDefault();
    addToast({
      title: "Info",
      description: "Password reset instructions sent to your email",
      type: "info",
    });
  };

  const isSubmitting = loading || authLoading;

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col p-4 font-sans text-sm">
      {/* Top Navigation */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-start pt-4 lg:pt-8 mb-4 lg:mb-0 px-2 lg:px-8">
        <Link
          href="/"
          className="flex items-center text-gray-500 hover:text-gray-900 font-semibold transition-colors text-sm lg:text-base"
        >
          <ArrowLeft className="w-4 h-4 mr-1 lg:w-5 lg:h-5" />
          Back
        </Link>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center w-full max-w-7xl mx-auto px-4 lg:px-12 gap-8 lg:gap-12">
        {/* LEFT SIDE - Logo */}
        <div className="w-full lg:w-1/4 flex flex-col items-center lg:items-start justify-center text-center lg:text-left pl-0 lg:pl-10">
          <img
            src="/logo.png"
            alt="FETS Logo"
            className="w-20 h-20 lg:w-32 lg:h-32 rounded-3xl shadow-xl bg-white p-2 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 mb-4"
          />
          <p className="mt-1 text-gray-500 text-sm lg:text-lg font-medium tracking-wide">
            Your Food Tracker Expiry System
          </p>
        </div>

        {/* RIGHT SIDE - Auth Card */}
        <div className="w-full lg:w-3/4 flex justify-center lg:justify-end">
          <div className="flex flex-col md:flex-row w-full max-w-4xl bg-[#f3f4f6] rounded-[2.5rem] shadow-[20px_20px_60px_#cecece,-20px_-20px_60px_#ffffff] overflow-hidden min-h-[420px]">
            {/* Form Section */}
            <div className="w-full md:w-3/5 p-6 lg:p-10 flex flex-col items-center justify-center relative bg-[#f3f4f6]">
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-1 tracking-tight">
                {isLogin ? "Sign in" : "Sign up"}
              </h1>

              <div className="scale-90 origin-top mb-1">
                <SocialLoginButtons />
              </div>

              <form
                className="w-full max-w-[20rem] mt-0 flex flex-col items-center space-y-3"
                onSubmit={handleSubmit}
              >
                {!isLogin && (
                  <InputField
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                )}
                <InputField
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <InputField
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {!isLogin && (
                  <>
                    <InputField
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />

                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="w-full px-4 space-y-2 py-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Strength: {passwordStrength.label}
                          </span>
                          {passwordStrength.label === "Strong" ? (
                            <ShieldCheck size={14} className="text-green-500" />
                          ) : (
                            <ShieldAlert size={14} className="text-amber-500" />
                          )}
                        </div>
                        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden flex gap-0.5">
                          <div
                            className={`h-full flex-1 transition-all duration-500 ${passwordValidation.minLength ? "bg-green-500" : "bg-gray-300"}`}
                          />
                          <div
                            className={`h-full flex-1 transition-all duration-500 ${passwordValidation.hasUpper ? "bg-green-500" : "bg-gray-300"}`}
                          />
                          <div
                            className={`h-full flex-1 transition-all duration-500 ${passwordValidation.hasLower ? "bg-green-500" : "bg-gray-300"}`}
                          />
                          <div
                            className={`h-full flex-1 transition-all duration-500 ${passwordValidation.hasNumber ? "bg-green-500" : "bg-gray-300"}`}
                          />
                          <div
                            className={`h-full flex-1 transition-all duration-500 ${passwordValidation.hasSpecial ? "bg-green-500" : "bg-gray-300"}`}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9px]">
                          <div
                            className={`flex items-center gap-1 ${passwordValidation.minLength ? "text-green-600" : "text-gray-400"}`}
                          >
                            {passwordValidation.minLength ? (
                              <Check size={8} />
                            ) : (
                              <X size={8} />
                            )}{" "}
                            8+ chars
                          </div>
                          <div
                            className={`flex items-center gap-1 ${passwordValidation.hasUpper ? "text-green-600" : "text-gray-400"}`}
                          >
                            {passwordValidation.hasUpper ? (
                              <Check size={8} />
                            ) : (
                              <X size={8} />
                            )}{" "}
                            Uppercase
                          </div>
                          <div
                            className={`flex items-center gap-1 ${passwordValidation.hasLower ? "text-green-600" : "text-gray-400"}`}
                          >
                            {passwordValidation.hasLower ? (
                              <Check size={8} />
                            ) : (
                              <X size={8} />
                            )}{" "}
                            Lowercase
                          </div>
                          <div
                            className={`flex items-center gap-1 ${passwordValidation.hasNumber ? "text-green-600" : "text-gray-400"}`}
                          >
                            {passwordValidation.hasNumber ? (
                              <Check size={8} />
                            ) : (
                              <X size={8} />
                            )}{" "}
                            Number
                          </div>
                          <div
                            className={`flex items-center gap-1 ${passwordValidation.hasSpecial ? "text-green-600" : "text-gray-400"}`}
                          >
                            {passwordValidation.hasSpecial ? (
                              <Check size={8} />
                            ) : (
                              <X size={8} />
                            )}{" "}
                            Special
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="mt-4 scale-90">
                  <AuthButton
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "PROCESSING..."
                      : isLogin
                        ? "SIGN IN"
                        : "SIGN UP"}
                  </AuthButton>
                </div>
              </form>

              {isLogin && (
                <div className="mt-4">
                  <a
                    href="#"
                    onClick={handleForgot}
                    className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors border-b border-transparent hover:border-gray-500 pb-0.5"
                  >
                    Forgot your password?
                  </a>
                </div>
              )}
            </div>

            {/* Right Panel */}
            <div className="w-full md:w-2/5 bg-[#F59E0B] p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-600/20 pointer-events-none" />

              <div className="relative z-10">
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight">
                  {isLogin ? (
                    <>
                      Welcome To
                      <br />
                      FETS
                    </>
                  ) : (
                    <>
                      Welcome
                      <br />
                      Back!
                    </>
                  )}
                </h2>

                <p className="text-white/90 text-sm lg:text-base mb-6 font-medium">
                  {isLogin ? "New Here?" : "Already user?"}
                </p>

                <div className="scale-90">
                  <AuthButton
                    type="button"
                    variant="orange"
                    onClick={toggleMode}
                    disabled={isSubmitting}
                  >
                    {isLogin ? "SIGN UP" : "SIGN IN"}
                  </AuthButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
