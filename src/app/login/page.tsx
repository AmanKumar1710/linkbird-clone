"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-xl px-8 pt-8 pb-6 flex flex-col items-center">
        <h1 className="font-bold text-xl mb-2">Continue with an account</h1>
        <span className="text-gray-500 text-sm mb-6 text-center">
          You must log in or register to continue.
        </span>
        <button
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center rounded-full border border-gray-300 py-3 font-medium text-base hover:bg-gray-100 mb-3"
        >
          <svg width="20" height="20" fill="none" className="mr-3">
            {/* Google logo SVG here */}
            <circle cx={10} cy={10} r={10} fill="#4285F4" />
          </svg>
          Continue with Google
        </button>
        <button
          className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3 font-medium text-base mb-2"
          onClick={() => router.push("/login/email")}
        >
          <svg width="20" height="20" fill="none" className="mr-3">
            {/* Email icon SVG */}
            <rect x={2.5} y={4.5} width={15} height={11} stroke="#fff" strokeWidth={1.5} />
            <path d="M2.5 4.5l7.5 7 7.5-7" stroke="#fff" strokeWidth={1.5} />
          </svg>
          Login with Email
        </button>
        <div className="text-center mt-3 text-sm">
          New User?{" "}
          <a href="/register" className="underline text-blue-700 font-medium">
            Create New Account
          </a>
        </div>
        <p className="mt-4 text-xs text-center text-gray-400">
          By continuing, you agree to our{" "}
          <a href="#" className="underline">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="#" className="underline">
            T&amp;Cs
          </a>
        </p>
      </div>
    </div>
  );
}
