import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <SignUp 
        appearance={{
          elements: {
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-sm",
          },
        }}
      />
    </div>
  );
}
