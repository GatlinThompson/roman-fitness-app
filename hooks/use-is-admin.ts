import { useAuth } from "@/contexts/auth-context";

export function useIsAdmin() {
  const { isAdmin } = useAuth();
  return { isAdmin };
}
