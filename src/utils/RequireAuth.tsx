"use client";
import { useEffect, useState } from "react";
import { Spinner } from ".";
import { usePathname, useRouter } from "next/navigation";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsAuthenticated(true);
    } else {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [router]);

  if (isAuthenticated) {
    return <>{children}</>;
  } else {
    return <Spinner />;
  }
};

export default RequireAuth;
