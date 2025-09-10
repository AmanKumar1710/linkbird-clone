"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EmailLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res && res.error) {
      setError("Invalid credentials");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full px-8 pt-8 pb-6">
        <button className="mb-4 text-gray-600 flex items-center" onClick={() => router.back()}>
          &larr; <span className="ml-1 text-sm">Back</span>
        </button>
        <h1 className="text-xl font-semibold mb-2">Login with email</h1>
        <p className="text-gray-500 text-sm mb-6">Login using your email address.</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email or Username"
            className="w-full bg-blue-50 rounded-lg px-4 py-3 border border-gray-200 focus:border-blue-400 focus:ring outline-none"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-blue-50 rounded-lg px-4 py-3 border border-gray-200 focus:border-blue-400 focus:ring outline-none pr-10"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
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
            Login
          </button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
        <div className="flex justify-between mt-4 text-sm">
          <a href="#" className="underline text-gray-500">
            Forgot password
          </a>
          <a href="/register" className="underline text-blue-700 font-medium">
            Create New Account
          </a>
        </div>
      </div>
    </div>
  );
}
