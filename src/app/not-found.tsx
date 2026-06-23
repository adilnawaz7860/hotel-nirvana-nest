import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <span className="font-heading text-7xl font-bold text-gradient-gold">404</span>
      <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">Page Not Found</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Button
        className="mt-8 bg-primary text-primary-foreground hover:bg-gold-light font-semibold"
        nativeButton={false}
        render={<Link href="/">Back to Home</Link>}
      />
    </div>
  );
}
