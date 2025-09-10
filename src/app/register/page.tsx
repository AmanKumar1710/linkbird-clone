"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Registration failed");
      return;
    }
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl max-w-sm w-full px-8 pt-8 pb-6">
        <button className="mb-4 text-gray-600 flex items-center" onClick={() => router.back()}>
          &larr; <span className="ml-1 text-sm">Back</span>
        </button>
        <h1 className="text-xl font-semibold mb-2">Register with email</h1>
        <p className="mb-6 text-gray-500 text-sm">Register using your email address.</p>
        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="flex space-x-2">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              required
              className="w-1/2 bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 focus:border-blue-400 focus:ring outline-none"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              required
              className="w-1/2 bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 focus:border-blue-400 focus:ring outline-none"
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full bg-blue-50 rounded-lg px-4 py-3 border border-gray-200 focus:border-blue-400 focus:ring outline-none"
          />
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full bg-blue-50 rounded-lg px-4 py-3 border border-gray-200 focus:border-blue-400 focus:ring outline-none pr-10"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPass(v => !v)}
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3 font-medium"
          >
            Create my account
          </button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
        <div className="text-center mt-5 text-sm">
          Already have an account?{" "}
          <a href="/login" className="underline text-blue-700 font-medium">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
