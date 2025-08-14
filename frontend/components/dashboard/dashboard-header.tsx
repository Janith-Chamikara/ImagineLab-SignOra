import { SignoraLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown, Search, Calendar } from "lucide-react";
import Link from "next/link";

export function DashboardHeader() {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard">
          <SignoraLogo />
        </Link>

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

          <Link href="/">
            <Button className="bg-black text-white hover:bg-gray-800">
              Log out
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 border-t bg-gray-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-purple-100 text-purple-600 text-sm">
                JC
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1">
              <span className="font-medium">Janith Chamikara</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search document" className="pl-10 w-64" />
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-white border rounded-md">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm">Jan 20, 2023 - Feb 09, 2023</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
