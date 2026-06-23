import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-secondary/40 via-background to-background" />
      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="mb-8 block text-center">
          <span className="font-heading text-3xl font-bold text-gradient-gold">Nirvana Nest</span>
        </Link>
        <div className="glass glass-gold-border rounded-2xl p-8">{children}</div>
      </div>
    </div>
  );
}
