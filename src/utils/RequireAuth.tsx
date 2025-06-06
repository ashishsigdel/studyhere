"use client";
import { useEffect, useState } from "react";
import { Spinner } from ".";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { removeAuth } from "@/redux/features/authSlice";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const pathname = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user) {
      setIsAuthenticated(true);
    } else {
      dispatch(removeAuth());
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
