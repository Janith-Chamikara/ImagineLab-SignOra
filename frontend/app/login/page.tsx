import { LoginForm } from "@/components/auth/login-form";
import Image from "next/image";
import dancer from "@/public/images/dancer.png";
import Link from "next/link";

export default function LoginPage() {
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
                    Welcome back
                  </h1>
                  <p className="text-gray-600">Login to your SIGNORA account</p>
                </div>

                <LoginForm />

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                      href="/signup"
                      className="text-black font-medium hover:underline"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Illustration Section */}
            <div className="hidden lg:flex items-center justify-center p-8">
              <div className="w-full max-w-md mx-auto">
                <Image
                  src={dancer}
                  alt="Sri Lankan Cultural Illustration"
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
