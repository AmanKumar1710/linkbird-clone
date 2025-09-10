interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export async function handleRegister(request: Request) {
  try {
    const data: RegisterData = await request.json();

    // TODO: Replace the below stub with actual Better Auth registration logic
    // Example: const user = await betterAuth.registerUser(data);
    return new Response(
      JSON.stringify({ message: `User ${data.email} registered successfully.` }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message || "Registration failed" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function handleLogin(request: Request) {
  try {
    const data: LoginData = await request.json();

    // TODO: Replace with Better Auth login logic: e.g., const session = await betterAuth.loginUser(data);
    return new Response(
      JSON.stringify({ message: `User ${data.email} logged in successfully.` }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message || "Login failed" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function handleGoogleOAuth(request: Request) {
  // TODO: Implement Google OAuth redirect or token exchange with Better Auth APIs

  // For now, respond with 501 Not Implemented
  return new Response(
    JSON.stringify({ error: "Google OAuth not implemented yet" }),
    { status: 501, headers: { "Content-Type": "application/json" } }
  );
}
