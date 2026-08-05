import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Laptop, ClipboardList, BarChart, Settings, LogOut, Menu, X } from "lucide-react";
import { cn } from "../utils";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Assets", href: "/assets", icon: Laptop },
  { name: "Employees", href: "/employees", icon: Users },
  { name: "Assignments", href: "/assignments", icon: ClipboardList },
  { name: "Reports", href: "/reports", icon: BarChart },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Layout() {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:w-64",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-blue-600">Corp AssetTrack</span>
          <button 
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            
            // Hide Employees and Settings tabs for non-admins
            if (!isAdmin && (item.name === "Employees" || item.name === "Settings")) {
              return null;
            }

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-blue-700" : "text-gray-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={logout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-red-500" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shrink-0 lg:hidden">
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-gray-500 hover:text-gray-700 mr-4 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 rounded-md"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              {navigation.find((n) => n.href === location.pathname)?.name || "Asset Management"}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-sm text-gray-600">
              <span className="font-medium text-gray-900">{user?.name || "User"}</span>
              <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-500 border border-gray-200">
                {user?.role}
              </span>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              {user?.name?.charAt(0) || "U"}
            </div>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex h-16 bg-white border-b border-gray-200 items-center justify-between px-6 shrink-0">
          <h1 className="text-xl font-semibold text-gray-800">
            {navigation.find((n) => n.href === location.pathname)?.name || "Asset Management"}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600 flex items-center">
              <span className="font-medium text-gray-900">{user?.name || "User"}</span>
              <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-500 border border-gray-200">
                {user?.role}
              </span>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              {user?.name?.charAt(0) || "U"}
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
