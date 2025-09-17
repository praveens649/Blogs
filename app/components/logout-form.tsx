"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthService } from "../backend/auth.service";
import { toast } from "sonner";

const authService = new AuthService();

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const result = await authService.logout();

    if (result.success) {
      toast( `Logout successful!  `)
      router.push("/login");
    } else {
      console.error("Logout error:", result.error);
    }
  };

  return (
    <Button onClick={handleLogout} variant="destructive">
      Logout
    </Button>
  );
}
