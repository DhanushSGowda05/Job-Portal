import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const PostSignUpHandler = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleMetadata = async () => {
      if (!isLoaded || !user) return;

      // Skip if role already exists
      const existingRole = user.unsafeMetadata?.role;
      if (existingRole) {
        navigate(existingRole === "recruiter" ? "/dashboard" : "/");
        return;
      }

      const role = localStorage.getItem("signupRole");
      if (!role) return;

      const companyName = localStorage.getItem("companyName") || "";
      const companyLogo = localStorage.getItem("companyLogo") || "";

      try {
        await user.update({
          unsafeMetadata: { role, companyName},
        });

        // Cleanup
        localStorage.removeItem("signupRole");
        localStorage.removeItem("companyName");
        localStorage.removeItem("companyLogo");

        // Redirect based on role
        navigate(role === "recruiter" ? "/dashboard" : "/");
      } catch (err) {
        console.error("Metadata update failed:", err);
      }
    };

    handleMetadata();
  }, [user, isLoaded, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg text-gray-600">Setting up your account...</p>
    </div>
  );
};

export default PostSignUpHandler;
