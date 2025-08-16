"use client";

import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronDown, Bell, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Notifications } from "./notifications";

interface SiteHeaderProps {
  showAuthButtons?: boolean;
}

export function SiteHeader({ showAuthButtons = true }: SiteHeaderProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const NavigationMenu = () => (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-1">
            Getting started
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {session && (
            <DropdownMenuItem onClick={() => router.push("/dashboard")}>
              Dashboard
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>Support</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-1">
            Language
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>English</DropdownMenuItem>
          <DropdownMenuItem>සිංහල</DropdownMenuItem>
          <DropdownMenuItem>தமிழ்</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />

        {showAuthButtons && (
          <>
            <div className="hidden md:flex items-center gap-4">
              <NavigationMenu />

              {session !== null && <Notifications />}

              {!session ? (
                <Link href="/signup">
                  <Button className=" bg-black text-white hover:bg-gray-800">
                    Register
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={async () => {
                    await signOut();
                  }}
                  className=" bg-black text-white hover:bg-gray-800"
                >
                  Log out
                </Button>
              )}
            </div>

            <div className="md:hidden flex items-center gap-2">
              {session !== null && <Notifications />}

              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col gap-6 mt-6">
                    <div className="flex flex-col gap-4">
                      <NavigationMenu />
                    </div>

                    <div className="pt-4 border-t">
                      {!session ? (
                        <Link
                          href="/signup"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Button className="w-full bg-black text-white hover:bg-gray-800">
                            Register
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          onClick={async () => {
                            await signOut();
                          }}
                          className="w-full bg-black text-white hover:bg-gray-800"
                        >
                          Log out
                        </Button>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
