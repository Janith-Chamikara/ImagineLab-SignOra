import { OnboardingForm } from "@/components/onboarding/onboarding-form";

export default function OnboardingPage() {
  return (
    <main className="flex-1 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-lg border shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Confirm Information
            </h1>
            <p className="text-gray-600">
              Please review the information we've fetched for you. If anything
              looks incorrect, you can update it below.
            </p>
          </div>

          <OnboardingForm />
        </div>
      </div>
    </main>
  );
}
