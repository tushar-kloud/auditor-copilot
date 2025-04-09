import React from 'react'
import { Button } from "@/components/ui/button";
import { cn } from "../lib/utils";


const Header = () => {
    return (
        <div style={{ display: 'flex', width: '100%' }}>
            <header className="px-5 w-full border-b bg-white">
                <div className="container mx-auto flex items-center justify-between py-2">
                    {/* Logo and Navigation */}
                    <div className="flex items-center space-x-8">
                        {/* Logo */}
                        <div className="text-2xl font-bold">
                            <span>△</span> 
                        </div>
                        {/* Navigation */}
                        <div>
                        <span>Hii it's </span>
                        <span style={{ fontSize:'30px',fontWeight:'bold'}}>Amy, </span>
                        <span>your auditor copilot</span>
                        </div>
                        {/* <nav className="flex space-x-6 text-sm font-semibold">
                            <a href="#" className="hover:text-gray-500">
                                Home
                            </a>
                            <a href="#" className="hover:text-gray-500">
                                About
                            </a>
                            <a href="#" className="hover:text-gray-500">
                                Services
                            </a>
                            <a href="#" className="hover:text-gray-500">
                                Contact
                            </a>
                        </nav> */}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                        {/* <Button variant="outline" className="px-4">
                            Sign in
                        </Button>
                        <Button className="bg-black text-white hover:bg-gray-800 px-4">
                            Sign Up
                        </Button> */}
                    </div>
                </div>
            </header>
        </div>
    )
}

export default Header