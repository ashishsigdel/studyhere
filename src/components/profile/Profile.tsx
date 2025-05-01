"use client";
import { myAxios } from "@/services/apiServices";
import { useEffect, useState } from "react";
import Image from "next/image";
import defaultPic from "@/assets/pictures/defaultpic.jpg";
import { toast } from "react-hot-toast";
import { UserProfile } from "@/types/user";
import { useDispatch } from "react-redux";
import { setAuth } from "@/redux/features/authSlice";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  getAuth,
  signInWithPopup,
} from "firebase/auth";
import { app } from "@/config/firebase";
import { useTheme } from "next-themes";

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [semester, setSemester] = useState("");
  const [dob, setDob] = useState("");
  const [college, setCollege] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const dispatch = useDispatch();
  const { theme } = useTheme();

  // Error states
  const [fullNameError, setFullNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await myAxios("/user/me");
        const userData = response.data.data;
        setProfile(userData);

        setFullName(userData.fullName || "");
        setSemester(userData.semester || "");
        setDob(userData.dob || "");
        setCollege(userData.college || "");
        setAddress(userData.address || "");
        setPhone(userData.phone || "");
        setProfilePic(userData.profilePic || "");
      } catch (error) {
        toast.error("Failed to fetch profile data");
        console.log("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Form validation functions
  const validateFullName = () => {
    if (!fullName.trim()) {
      setFullNameError("Full name is required");
      return false;
    } else if (fullName.length < 3) {
      setFullNameError("Name must be at least 3 characters");
      return false;
    }
    setFullNameError("");
    return true;
  };

  const validatePhone = () => {
    if (phone && !/^\d{10}$/.test(phone)) {
      setPhoneError("Please enter a valid 10-digit phone number");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      // Store the file for form submission
      setImageFile(file);

      // Create a local preview
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Validate form inputs
    const isNameValid = validateFullName();
    const isPhoneValid = validatePhone();

    if (!isNameValid || !isPhoneValid) {
      return;
    }

    try {
      setUpdating(true);

      // Create FormData object for multipart form submission
      const formData = new FormData();

      // Append text fields
      formData.append("fullName", fullName);
      if (semester) formData.append("semester", semester);
      if (dob) formData.append("dob", dob);
      if (college) formData.append("college", college);
      if (address) formData.append("address", address);
      if (phone) formData.append("phone", phone);

      // Append image file if selected
      if (imageFile) {
        formData.append("profilePic", imageFile);
      }

      // Send multipart form data to backend
      const response = await myAxios.post("/user/me-update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch(
        setAuth({
          id: response.data.data.id,
          email: response.data.data.email,
          fullName: response.data.data.fullName,
          profilePic: response.data.data.profilePic,
          role: response.data.data.role,
        })
      );

      // Update local state with response data
      setProfile(response.data.data);

      // Clear image file state after successful upload
      setImageFile(null);

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await myAxios.delete("/user/me");
        toast.success("Account deleted successfully");
        // Redirect to login page or home page after deletion
        window.location.href = "/login";
      } catch (error) {
        toast.error("Failed to delete account");
      }
    }
  };

  const handleChangeEmail = async (provider: any) => {
    try {
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await myAxios.put(
        "/user/me/change-email",
        {
          email: result.user.email,
        },
        {
          headers: {
            "X-OAuth": `${idToken}`,
          },
        }
      );

      localStorage.setItem("accessToken", response.data.data.accessToken);
      dispatch(setAuth(response.data.data.user));
      toast.success("Email Updated!");
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data.message || "Something went wrong!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-t-blue-500 border-b-blue-600 border-l-blue-300 border-r-blue-300"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl w-full mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Profile Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your personal information and account preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Picture Section */}
        <div className="bg-white dark:bg-[#424242] border border-black/10 dark:border-white/10 rounded-lg p-6">
          <div className="flex flex-col items-center">
            <div className="relative group mb-4">
              <input
                type="file"
                id="profile-image-input"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="profile-image-input"
                className="cursor-pointer block"
              >
                <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                  {!loading && (
                    <Image
                      src={profilePic || profile?.profilePic || defaultPic}
                      fill
                      className="object-cover"
                      alt="User Image"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <span className="text-white text-sm font-medium">
                      Change
                    </span>
                  </div>
                </div>
              </label>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {profile?.fullName || "User"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 capitalize">
              {profile?.role || "Member"}
            </p>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-white dark:bg-[#424242] border border-black/10 dark:border-white/10 rounded-lg p-6">
          <h3 className="w-full px-4 sm:px-6 md:px-8 border-b-[1px] border-black/10 dark:border-white/10 pb-4 mb-8 font-semibold text-[17.5px] leading-5 uppercase">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Email
              </h3>
              <p className="text-gray-900 dark:text-white">
                {profile?.email || "Not provided"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Phone
              </h3>
              <p className="text-gray-900 dark:text-white">
                {profile?.phone || "Not provided"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Date of Birth
              </h3>
              <p className="text-gray-900 dark:text-white">
                {profile?.dob
                  ? new Date(profile.dob).toLocaleDateString()
                  : "Not provided"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                College
              </h3>
              <p className="text-gray-900 dark:text-white">
                {profile?.college || "Not provided"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Semester
              </h3>
              <p className="text-gray-900 dark:text-white">
                {profile?.semester || "Not provided"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Address
              </h3>
              <p className="text-gray-900 dark:text-white">
                {profile?.address || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Form Section */}
        <div className="bg-white dark:bg-[#424242] border border-black/10 dark:border-white/10 rounded-lg p-6">
          <h3 className="w-full px-4 sm:px-6 md:px-8 border-b-[1px] border-black/10 dark:border-white/10 pb-4 mb-8 font-semibold text-[17.5px] leading-5 uppercase">
            Edit Profile
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onBlur={validateFullName}
                  className={`w-full px-3 py-2 rounded-md border ${
                    fullNameError
                      ? "border-red-500"
                      : "border-black/10 dark:border-white/10"
                  } bg-gray-100 dark:bg-[#3c3c3c] text-gray-600 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                />
                {fullNameError && (
                  <p className="mt-1 text-sm text-red-600">{fullNameError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={validatePhone}
                  className={`w-full px-3 py-2 rounded-md border ${
                    phoneError
                      ? "border-red-500"
                      : "border-black/10 dark:border-white/10"
                  } bg-gray-100 dark:bg-[#3c3c3c] text-gray-600 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                />
                {phoneError && (
                  <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border border-black/10 dark:border-white/10 bg-gray-100 dark:bg-[#3c3c3c] text-gray-600 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  College
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border border-black/10 dark:border-white/10 bg-gray-100 dark:bg-[#3c3c3c] text-gray-600 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Semester
                </label>
                <input
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border border-black/10 dark:border-white/10 bg-gray-100 dark:bg-[#3c3c3c] text-gray-600 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 rounded-md border border-black/10 dark:border-white/10 bg-gray-100 dark:bg-[#3c3c3c] text-gray-600 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={updating}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {updating ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Account Section */}
        <div className="bg-white dark:bg-[#424242] border border-black/10 dark:border-white/10 rounded-lg p-6">
          <h3 className="w-full px-4 sm:px-6 md:px-8 border-b-[1px] border-black/10 dark:border-white/10 pb-4 mb-8 font-semibold text-[17.5px] leading-5 uppercase">
            Account
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Member Since
              </h3>
              <p className="text-gray-900 dark:text-white">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString()
                  : "Not available"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Last Active
              </h3>
              <p className="text-gray-900 dark:text-white">
                {profile?.lastActiveAt
                  ? new Date(profile.lastActiveAt).toLocaleDateString()
                  : "Not available"}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-10 border-t pt-6">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Change Email
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mr-3">
                Update your account with a new email address. <br /> Current:{" "}
                {profile?.email}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                className="w-full px-4 py-2.5 rounded-lg flex items-center justify-center gap-3 cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 transition-colors"
                onClick={() => handleChangeEmail(new GoogleAuthProvider())}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width="24px"
                  height="24px"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
                <span>From Google</span>
              </button>

              <button
                type="button"
                className="w-full px-4 py-2.5 rounded-lg flex items-center justify-center gap-3 cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 transition-colors"
                onClick={() => handleChangeEmail(new GithubAuthProvider())}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24px"
                  height="24px"
                  fill={theme === "light" ? "#000000" : "#FFFFFF"}
                >
                  <path d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6C7,7.2,7,6.6,7.3,6c0,0,1.4,0,2.8,1.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3C15.3,6,16.8,6,16.8,6C17,6.6,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c3.7-1.5,6.3-5.1,6.3-9.3C22,6.1,16.9,1.4,10.9,2.1z" />
                </svg>
                <span>From GitHub</span>
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white dark:bg-[#424242] rounded-lg p-6 border border-red-200 dark:border-red-800/50">
          <h3 className="text-red-500 w-full px-4 sm:px-6 md:px-8 border-b-[1px] border-black/10 dark:border-white/10 pb-4 mb-8 font-semibold text-[17.5px] leading-5 uppercase">
            Danger Zone
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Delete Account
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mr-3">
                Deleting your account will permanently remove your personal data
                and settings. However, your contributions—such as subjects,
                questions, and answers—will remain visible to others.
              </p>
            </div>

            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 whitespace-nowrap"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
