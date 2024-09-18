import { SignUp } from "@clerk/nextjs";
import React from "react";

const SignInPage = () => {
  return (
    <main className="auth-page">
      <SignUp />
    </main>
  )
}

export default SignInPage;
