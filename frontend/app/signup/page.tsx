import { SignupForm } from "@/components/auth/signup-form";
import Link from "next/link";
import welcome from "@/public/images/welcome.png";
import Image from "next/image";

export default function SignupPage() {
  return (
    <main className="flex-1 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-2 min-h-[600px]">
            {/* Form Section */}
            <div className="flex items-center justify-center p-8 lg:p-12">
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                    Create an Account
                  </h1>
                  <p className="text-gray-600">Sign up to get started.</p>
                </div>

                <SignupForm />
              </div>
            </div>

            {/* Illustration Section */}
            <div className="hidden lg:flex items-center justify-center p-8">
              <div className="w-full max-w-md">
                <Image
                  src={welcome}
                  alt="Traditional Sri Lankan People Illustration"
                  className="mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
