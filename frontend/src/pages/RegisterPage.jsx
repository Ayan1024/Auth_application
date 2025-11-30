// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";
import { Listbox } from "@headlessui/react";
import toast from "react-hot-toast";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";

/**
 * Small list of countries for the dropdown.
 * Extend as needed. Keep `code` without the '+' sign.
 */
const COUNTRY_CODES = [
  { code: "91", label: "India", iso: "IN", example: "1234567890" },
  { code: "1", label: "United States", iso: "US", example: "5550000000" },
  { code: "44", label: "United Kingdom", iso: "GB", example: "7700900000" },
  { code: "61", label: "Australia", iso: "AU", example: "412345678" },
  { code: "92", label: "Pakistan", iso: "PK", example: "3012345678" },
  { code: "880", label: "Bangladesh", iso: "BD", example: "1712345678" },
  { code: "971", label: "UAE", iso: "AE", example: "501234567" },
];

/** Converts a country ISO (e.g. "IN") to the corresponding emoji flag. */
const countryToFlag = (iso) =>
  iso
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );

export default function RegisterPage() {
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0].code);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // helper: normalize phone digits (remove non-digit chars)
  const onlyDigits = (s) => (s || "").replace(/\D/g, "");

  const validate = () => {
    const tempErrors = {};

    if (!formData.fullName.trim()) tempErrors.fullName = "Full name is required";

    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = "Enter a valid email address";
    }

    const digits = onlyDigits(formData.phoneNumber);
    if (!digits) {
      tempErrors.phone = "Phone number is required";
    } else if (digits.length < 7 || digits.length > 15) {
      tempErrors.phone = "Phone number must be 7–15 digits";
    }

    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const onRegister = async (payload) => {
    setIsLoading(true);
    try {
      const rawDigits = onlyDigits(payload.phoneNumber);
      const phone = `+${countryCode}${rawDigits}`;

      await registerUser({
        name: payload.fullName,
        email: payload.email,
        phone,
        password: payload.password,
      });

      toast.success("Registration successful — please login.");
      setTimeout(() => nav("/login"), 900);
    } catch (err) {
      const message = err?.error || err?.message || "Registration failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Fix the highlighted errors and try again");
      return;
    }
    onRegister(formData);
  };

  const currentCountry = COUNTRY_CODES.find((c) => c.code === countryCode);
  const placeholderExample = currentCountry ? `${currentCountry.example}` : "1234567890";

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 animate-fade-in">
      <div className="glass-panel w-full max-w-lg p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-purple-500" />

        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-gray-400 mb-8">Join the Automate Reality platform</p>

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-gray-500" size={20} />
              <input
                type="text"
                required
                className={`w-full glass-input rounded-lg py-3 pl-10 pr-4 transition-colors ${errors.fullName ? "border-red-500" : ""}`}
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? "err-fullname" : undefined}
              />
            </div>
            {errors.fullName && <p id="err-fullname" className="text-red-400 text-xs">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-500" size={20} />
              <input
                type="email"
                required
                className={`w-full glass-input rounded-lg py-3 pl-10 pr-4 transition-colors ${errors.email ? "border-red-500" : ""}`}
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "err-email" : undefined}
              />
            </div>
            {errors.email && <p id="err-email" className="text-red-400 text-xs">{errors.email}</p>}
          </div>

          {/* Phone with Headless UI Listbox for country codes */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300 ml-1">Phone Number</label>

            <div className="relative flex gap-2 items-center">
              {/* Custom dropdown using Headless UI Listbox */}
              <div className="w-36">
                <Listbox value={countryCode} onChange={setCountryCode}>
                  <div className="relative">
                    <Listbox.Button
                      className="glass-input w-full py-3 pl-3 pr-8 bg-transparent rounded-lg flex items-center justify-between border border-white/10"
                      aria-label="Country code"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{countryToFlag(currentCountry?.iso || "UN")}</span>
                        <span className="ml-2 opacity-80">+{countryCode}</span>
                      </div>

                      <ChevronDown size={18} className="text-gray-300" />
                    </Listbox.Button>

                    <Listbox.Options className="absolute z-50 mt-1 w-full bg-black/90 text-white rounded-lg shadow-lg max-h-60 overflow-auto border border-white/10">
                      {COUNTRY_CODES.map((c) => (
                        <Listbox.Option key={c.code} value={c.code} as={React.Fragment}>
                          {({ active, selected }) => (
                            <li
                              className={`cursor-pointer px-4 py-2 flex items-center justify-between ${
                                active ? "bg-purple-600/30" : ""
                              } ${selected ? "bg-purple-600/40" : ""}`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-lg">{countryToFlag(c.iso)}</span>
                                <span className="font-medium">{c.iso}</span>
                              </div>
                              <span className="text-sm opacity-80">+{c.code}</span>
                            </li>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
              </div>

              {/* Phone input */}
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-3.5 text-gray-500" size={20} />
                <input
                  type="tel"
                  required
                  inputMode="tel"
                  className={`w-full glass-input rounded-lg py-3 pl-10 pr-4 transition-colors ${errors.phone ? "border-red-500" : ""}`}
                  placeholder={placeholderExample}
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "err-phone" : undefined}
                />
              </div>
            </div>

            {errors.phone && <p id="err-phone" className="text-red-400 text-xs">{errors.phone}</p>}
            <p className="text-xs text-gray-500 mt-1">
              We will save your phone in international format (e.g. {`+${countryCode}${placeholderExample}`})
            </p>
          </div>

          {/* Password and Confirm */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-500" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className={`w-full glass-input rounded-lg py-3 pl-10 pr-12 ${errors.password ? "border-red-500" : ""}`}
                  placeholder="••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "err-password" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p id="err-password" className="text-red-400 text-xs">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">Confirm</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-500" size={20} />
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  className={`w-full glass-input rounded-lg py-3 pl-10 pr-12 ${errors.confirmPassword ? "border-red-500" : ""}`}
                  placeholder="••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? "err-confirm" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p id="err-confirm" className="text-red-400 text-xs">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 mt-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-lg transition-all shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Complete Registration"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">Already have an account?
            <button onClick={() => nav("/login")} className="text-purple-400 hover:text-purple-300 ml-2 font-medium underline-offset-4 hover:underline">
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
