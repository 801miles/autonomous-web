"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Shield, Zap, LayoutDashboard, GitBranch, Menu, Home, X, DollarSign, BarChart3, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", icon: <Home className="w-4 h-4" />, label: "Home" },
  { href: "/intake", icon: <Zap className="w-4 h-4" />, label: "Intake" },
  { href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard" },
  { href: "/pricing", icon: <DollarSign className="w-4 h-4" />, label: "Pricing" },
  { href: "/mobile", icon: <Smartphone className="w-4 h-4" />, label: "Mobile" },
  { href: "/revenue", icon: <BarChart3 className="w-4 h-4" />, label: "Revenue" },
];

function NavbarInner({
  pathname,
  showAuth,
  isLoaded,
  userId,
}: {
  pathname: string | null;
  showAuth: boolean;
  isLoaded: boolean;
  userId: string | null | undefined;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4"
      >
        <div className="max-w-7xl mx-auto glass rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary/20 rounded-lg group-hover:neon-glow transition-all duration-300">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              <span className="text-gradient">Archon</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                active={pathname === link.href}
              />
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener"
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <GitBranch className="w-5 h-5 text-foreground/60 hover:text-foreground transition-colors" />
            </Link>
            <Link
              href="/intake"
              className="flex items-center gap-2 bg-primary px-5 py-2 rounded-xl font-semibold text-sm hover:scale-105 hover:neon-glow transition-all active:scale-95 shadow-lg shadow-primary/20"
            >
              <Zap className="w-4 h-4" />
              Begin Intake
            </Link>

            {showAuth && isLoaded && !userId && (
              <Link href="/sign-in" className="flex items-center px-4 py-2 text-sm font-semibold hover:text-primary transition-colors">
                Sign In
              </Link>
            )}
            {showAuth && isLoaded && userId && (
              <UserButton appearance={{ elements: { userButtonAvatarBox: "w-9 h-9 border-2 border-primary/20" } }} />
            )}
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 hover:bg-white/10 rounded-xl transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] glass-strong z-[70] flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="font-bold text-lg text-gradient">Archon</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all",
                      pathname === link.href
                        ? "bg-primary/10 text-white ring-1 ring-primary/20"
                        : "text-foreground/50 hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    <span className={cn(pathname === link.href ? "text-primary" : "")}>{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="px-4 py-6 border-t border-white/5 space-y-3">
                {showAuth && isLoaded && !userId && (
                  <>
                    <Link
                      href="/sign-in"
                      onClick={() => setMobileOpen(false)}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl glass font-semibold text-sm hover:bg-white/10 transition-all"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/sign-up"
                      onClick={() => setMobileOpen(false)}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary font-semibold text-sm hover:neon-glow transition-all"
                    >
                      Get Started
                    </Link>
                  </>
                )}
                {showAuth && isLoaded && userId && (
                  <div className="flex items-center gap-3 px-4 py-3">
                    <UserButton appearance={{ elements: { userButtonAvatarBox: "w-10 h-10 border-2 border-primary/20" } }} />
                    <span className="text-sm text-foreground/50">Account</span>
                  </div>
                )}
                <Link
                  href="/intake"
                  onClick={() => setMobileOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary font-bold text-sm hover:neon-glow transition-all shadow-lg shadow-primary/20"
                >
                  <Zap className="w-4 h-4" />
                  Begin Intake
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

const NavLink = ({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) => (
  <Link
    href={href}
    className={cn(
      "relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all",
      active ? "text-foreground bg-white/8" : "text-foreground/50 hover:text-foreground hover:bg-white/5"
    )}
  >
    <span className={cn("transition-colors", active ? "text-primary" : "group-hover:text-primary")}>{icon}</span>
    {label}
    {active && (
      <motion.div
        layoutId="nav-active-pill"
        className="absolute inset-0 rounded-xl ring-1 ring-primary/30 bg-primary/8"
        transition={{ type: "spring", duration: 0.4 }}
      />
    )}
  </Link>
);

export default function Navbar() {
  const pathname = usePathname();
  const { isLoaded, userId } = useAuth();
  return <NavbarInner pathname={pathname} showAuth isLoaded={isLoaded} userId={userId} />;
}

/** Navbar when Clerk is not configured (no useAuth — safe outside ClerkProvider). */
export function NavbarGuest() {
  const pathname = usePathname();
  return <NavbarInner pathname={pathname} showAuth={false} isLoaded userId={null} />;
}
