"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "./supabaseClient";

const withAuth = (WrappedComponent) => {
  return function ProtectedComponent(props) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push(`/?redirect=${encodeURIComponent(pathname)}`);
        } else {
          setUser(session.user);
        }

        setLoading(false);
      };

      checkAuth();

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) {
          router.push(`/?redirect=${encodeURIComponent(pathname)}`);
        } else {
          setUser(session.user);
        }
      });

      return () => {
        subscription?.unsubscribe();
      };
    }, [router, pathname]);

    if (loading) return <p>Loading...</p>;

    return user ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;
