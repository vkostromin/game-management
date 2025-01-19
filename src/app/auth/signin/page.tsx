import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import SignInForm from "@/components/auth/SignInForm";

export default async function SignIn() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignInForm />
    </div>
  );
} 