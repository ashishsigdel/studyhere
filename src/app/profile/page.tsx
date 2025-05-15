import { Footer } from "@/components/footer";
import MainLayout from "@/components/layout/MainLayout";
import Profile from "@/components/profile/Profile";
import RequireAuth from "@/utils/RequireAuth";

export default function page() {
  return (
    <RequireAuth>
      <MainLayout>
        <Profile />
      </MainLayout>
    </RequireAuth>
  );
}
