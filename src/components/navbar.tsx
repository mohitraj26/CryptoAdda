import React from 'react'
import { Link } from 'react-router-dom'
import { Bitcoin, LogOut, User, Settings } from 'lucide-react'
import { ModeToggle } from './mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar: React.FC = () => {
  return (
    <nav className="w-full bg-white text-black dark:bg-black dark:text-white shadow-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-row justify-between gap-4 md:flex-row md:items-center md:justify-between">
        
        {/* Logo */}
        <div className="text-xl font-bold flex items-center gap-2">
          <Bitcoin className="h-6 w-6" />
          <Link to="/" className="hover:opacity-80 text-base sm:text-lg">
            CryptoAdda
          </Link>
        </div>

        {/* Theme Toggle + Profile */}
        <div className="flex items-center justify-end gap-4">
          {/* Theme Toggle */}
          <ModeToggle />

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
                  <AvatarFallback>MR</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

