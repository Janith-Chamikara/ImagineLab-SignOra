import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section
        className="relative mt-6 min-h-[600px] md:min-h-[700px] rounded-sm flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/hero-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-6xl mx-auto text-center md:text-left">
            <h1 className="font-serif font-bold text-4xl md:text-5xl lg:text-7xl leading-tight mb-8">
              Transforming governance
              <br />
              for every citizen
            </h1>

            <div className="max-w-4xl mb-12">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-2">
                Submit Documents, Track Applications,
              </p>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-2">
                And Book Appointments With
              </p>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-2">
                Government Authorities - All From Your
              </p>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                Mobile Device.
              </p>
            </div>

            <Link href="/login">
              <Button
                size="lg"
                className="bg-black text-white font-bold hover:bg-gray-800 px-8 py-3 text-lg  group"
              >
                Explore
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
