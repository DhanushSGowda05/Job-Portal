import React, { useState, useEffect, useContext } from "react";
import { useClerk } from "@clerk/clerk-react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext.jsx";

const RecruiterLogin = () => {
    const [companyName, setCompanyName] = useState("");
    const [companyLogo, setCompanyLogo] = useState(null);
    const [isLogoStage, setIsLogoStage] = useState(false);

    const { openSignUp } = useClerk();
    const { setshowRecruiterLogin } = useContext(AppContext);

    // Handle submit for first stage (text)
    const handleNext = (e) => {
        e.preventDefault();
        if (!companyName) return alert("Please enter your company name");
        setIsLogoStage(true);
    };

    // Handle final submit (logo + open Clerk signup)
    const handleSignup = async (e) => {
        e.preventDefault();

        if (!companyLogo) return alert("Please upload your company logo");

        // Convert image to Base64
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Logo = reader.result;

            // Save recruiter metadata for PostSignUpHandler
            localStorage.setItem("signupRole", "recruiter");
            localStorage.setItem("companyName", companyName);
            localStorage.setItem("companyLogo", base64Logo);

            // Close popup
            setshowRecruiterLogin(false);

            // Open Clerk signup modal
            openSignUp();
        };
        reader.readAsDataURL(companyLogo);
    };

    // Prevent background scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
            <form
                onSubmit={isLogoStage ? handleSignup : handleNext}
                className="relative bg-white p-10 rounded-xl text-slate-500 w-[22rem]"
            >
                <h1 className="text-center text-2xl text-neutral-700 font-medium">
                    Recruiter Sign Up
                </h1>
                <p className="text-sm text-center mt-1">
                    Create your recruiter account to post jobs
                </p>

                {/* Stage 1: Company Name */}
                {!isLogoStage && (
                    <>
                        <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-8">
                            <img src={assets.person_icon} alt="" />
                            <input
                                className="outline-none text-sm w-full"
                                onChange={(e) => setCompanyName(e.target.value)}
                                value={companyName}
                                type="text"
                                placeholder="Company name"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="mt-6 bg-blue-600 w-full text-white py-2 rounded-full"
                        >
                            Next
                        </button>
                    </>
                )}

                {/* Stage 2: Logo Upload */}
                {isLogoStage && (
                    <>
                        <div className="flex flex-col items-center my-8">
                            <label htmlFor="logo" className="cursor-pointer">
                                <img
                                    className="w-20 h-20 rounded-full object-cover border"
                                    src={
                                        companyLogo
                                            ? URL.createObjectURL(companyLogo)
                                            : assets.upload_area
                                    }
                                    alt=""
                                />
                                <input
                                    onChange={(e) => setCompanyLogo(e.target.files[0])}
                                    type="file"
                                    id="logo"
                                    hidden
                                />
                            </label>
                            <p className="text-sm mt-2 text-center text-gray-600">
                                Upload your company logo
                            </p>
                        </div>
                        <button
                            type="submit"
                            className="mt-2 bg-blue-600 w-full text-white py-2 rounded-full"
                        >
                            Continue to Sign Up
                        </button>
                    </>
                )}

                <img
                    onClick={() => setshowRecruiterLogin(false)}
                    className="absolute top-5 right-5 cursor-pointer"
                    src={assets.cross_icon}
                    alt=""
                />
                <p className='mt-4 text-center text-sm'>
                    Already have an account?{" "}
                    <span onClick={() => openSignUp()} className='text-blue-600 cursor-pointer'>
                        Sign In
                    </span>
                </p>

            </form>
        </div>
    );
};

export default RecruiterLogin;
