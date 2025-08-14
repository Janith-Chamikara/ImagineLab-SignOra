import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

interface SiteHeaderProps {
  showAuthButtons?: boolean;
}

export function SiteHeader({ showAuthButtons = true }: SiteHeaderProps) {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4  h-16 flex items-center justify-between">
        <Logo />

        {showAuthButtons && (
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1">
                  Getting started
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Documentation</DropdownMenuItem>
                <DropdownMenuItem>API Reference</DropdownMenuItem>
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

            <Link href="/signup">
              <Button className="bg-black text-white hover:bg-gray-800">
                Register
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
