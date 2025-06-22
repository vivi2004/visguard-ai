import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";


export default function Header() {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Logout error:", error.message);
            toast.error("Logout failed");
        } else {
            toast.success("Logged out successfully");
            navigate("/login");
        }
    };

    return (
        <header className="w-full border-b border-[#e7edf4] dark:border-gray-700 bg-white dark:bg-[#0f172a] px-6 py-3 shadow-sm sticky top-0 z-50">
            <div className="flex items-center justify-between">
                {/* Logo + Brand */}
                <div className="flex items-center gap-3 text-[#0d141c] dark:text-white">
                    <div className="w-6 h-6 text-[#0c77f2]">
                        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
                                fill="currentColor"
                            />
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold tracking-tight">VisGuard AI</h2>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-4">
                    <Link className="text-sm font-medium hover:text-[#0c77f2] dark:text-white" to="/upload">
                        Dashboard
                    </Link>
                    <Link className="text-sm font-medium hover:text-[#0c77f2] dark:text-white" to="/history">
                        History
                    </Link>
                    <Link className="text-sm font-medium hover:text-[#0c77f2] dark:text-white" to="#">
                        Documentation
                    </Link>
                    <Link className="text-sm font-medium hover:text-[#0c77f2] dark:text-white" to="#">
                        Support
                    </Link>



                    <Button
                        onClick={handleLogout}
                        className="bg-[#0c77f2] hover:bg-[#075cd1] text-white font-bold text-sm px-4 py-2 rounded-lg"
                    >
                        Log Out
                    </Button>
                </nav>

                {/* Mobile Menu Icon */}
                <div className="md:hidden">
                    <Button variant="ghost" size="icon" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
                        {mobileNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Dropdown Nav */}
            {mobileNavOpen && (
                <div className="md:hidden mt-4 flex flex-col gap-4 text-sm font-medium text-[#0d141c] dark:text-white">
                    <Link to="/upload" onClick={() => setMobileNavOpen(false)} className="hover:text-[#0c77f2]">
                        Dashboard
                    </Link>
                    <Link to="/history" onClick={() => setMobileNavOpen(false)} className="hover:text-[#0c77f2]">
                        History
                    </Link>
                    <Link to="#" onClick={() => setMobileNavOpen(false)} className="hover:text-[#0c77f2]">
                        Documentation
                    </Link>
                    <Link to="#" onClick={() => setMobileNavOpen(false)} className="hover:text-[#0c77f2]">
                        Support
                    </Link>



                    <Button
                        onClick={() => {
                            setMobileNavOpen(false);
                            handleLogout();
                        }}
                        className="bg-[#0c77f2] text-white font-bold text-sm rounded-lg"
                    >
                        Log Out
                    </Button>
                </div>
            )}
        </header>
    );
}
