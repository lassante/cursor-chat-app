import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 space-y-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold">Page Not Found</h2>
      <p className="text-muted-foreground text-center max-w-md">
        Oops! The page you&apos;re looking for doesn&apos;t exist or has been
        moved.
      </p>
      <Button asChild>
        <Link href="/" className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Return Home
        </Link>
      </Button>
    </div>
  );
}
