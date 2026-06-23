"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User, LayoutDashboard, LogOut } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useQueryClient } from "@tanstack/react-query";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/rooms", label: t.nav.rooms },
    { href: "/restaurant", label: t.nav.restaurant },
    { href: "/gallery", label: t.nav.gallery },
    { href: "/about", label: t.nav.about },
    { href: "/reviews", label: t.nav.reviews },
    { href: "/contact", label: t.nav.contact },
  ];

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    queryClient.invalidateQueries({ queryKey: ["current-user"] });
    router.push("/");
  }

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "glass border-b border-border py-3" : "bg-transparent py-5"
      )}
    >
      <div className="container-luxury flex items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-heading text-2xl font-bold text-gradient-gold">Nirvana Nest</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium tracking-wide transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-foreground/80"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          <LanguageToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="size-4" />
                    {user.name.split(" ")[0]}
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  render={
                    <Link href={user.role === "customer" ? "/dashboard" : "/admin"}>
                      <LayoutDashboard className="size-4" />
                      {t.nav.dashboard}
                    </Link>
                  }
                />
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} variant="destructive">
                  <LogOut className="size-4" />
                  {t.nav.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/login">{t.nav.login}</Link>} />
          )}

          <Button
            size="sm"
            nativeButton={false}
            className="bg-primary text-primary-foreground hover:bg-gold-light font-semibold"
            render={<Link href="/rooms">{t.nav.bookNow}</Link>}
          />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <LanguageToggle />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon">
                  <Menu className="size-5" />
                </Button>
              }
            />
            <SheetContent side="right" className="bg-background border-border w-72">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-heading text-lg text-gradient-gold">Nirvana Nest</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                  <X className="size-5" />
                </Button>
              </div>
              <nav className="flex flex-col gap-1 p-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-foreground/5",
                      pathname === link.href ? "text-primary" : "text-foreground/80"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-2 px-1">
                  {user ? (
                    <>
                      <Button
                        variant="outline"
                        nativeButton={false}
                        render={
                          <Link href={user.role === "customer" ? "/dashboard" : "/admin"}>
                            {t.nav.dashboard}
                          </Link>
                        }
                      />
                      <Button variant="ghost" onClick={handleLogout}>
                        {t.nav.logout}
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" nativeButton={false} render={<Link href="/login">{t.nav.login}</Link>} />
                  )}
                  <Button
                    className="bg-primary text-primary-foreground font-semibold"
                    nativeButton={false}
                    render={<Link href="/rooms">{t.nav.bookNow}</Link>}
                  />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
