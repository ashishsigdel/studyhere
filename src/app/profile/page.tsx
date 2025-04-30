import Profile from "@/components/profile/Profile";
import RequireAuth from "@/utils/RequireAuth";

export default function page() {
  return (
    <RequireAuth>
      <div className="mx-auto max-w-[1400px] px-4 container flex min-[900px]:flex-row flex-col-reverse gap-4 relative">
        <Profile />
      </div>
    </RequireAuth>
  );
}
