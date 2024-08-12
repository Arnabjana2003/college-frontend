import React, { useState } from "react";
import logo from "../assets/logo-college.png";
import { Link, useNavigate } from "react-router-dom";
import coverImg from "../assets/background-cover.png";
import brandLogo from "../assets/capture-logo.png";
import cameraicon from "../assets/camera-icon.png";
import validate from "../components/validationSignup";
import { useMutation } from "@tanstack/react-query";

import { signup } from "../components/centralApi";

function SignUp() {
  const [collegeName, setcollegeName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [collegeRegistrationNumber, setcollegeRegistrationNumber] = useState("");
  const [state, setState] = useState("");
  const [registrationCertificate, setregistrationCertificate] = useState(null); 
  const [pincode, setPincode] = useState("");
  const [directorsName, setdirectorsName] = useState("");
  const [totalStudents, settotalStudents] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [password, setPassword] = useState("");
  const [videoStream, setVideoStream] = useState(null);
  const [image, setImage] = useState(null);
  const [showRetakeContinue, setShowRetakeContinue] = useState(false);
  const [videoCam, setVideoCam] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      setVideoStream(stream);
      const video = document.getElementById("video");
      if (video) {
        video.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const handleCaptureImage = async () => {
    try {
      console.log("Capturing image...");
      const canvas = document.createElement("canvas");
      const video = document.getElementById("video");
      console.log("Video element:", video);
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
      .getContext("2d")
      .drawImage(video, 0, 0, canvas.width, canvas.height);
      const capturedImage = canvas.toDataURL("image/jpeg");
      setImage(capturedImage);
      setShowRetakeContinue(true);
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    } catch (error) {
      console.error("Error capturing image:", error);
    }
  };

  const handleRetake = () => {
    setImage(null);
    setShowRetakeContinue(false);
    startCamera();
  };

  const mutation = useMutation({
    mutationFn: signup,  // using react query and centralApi
    onSuccess: (response) => {
      console.log(response);
      if (response.message === "College Name or Email already exists") {
        setErrors({ submit: "College Name or Email already exists" });

        navigate("/signup");
        setVideoCam(true);
      } else if (response.status === "ok") {
        navigate("/login");
      } else {
        console.error("Error in response:", response.message);
      }
    },
    onError: (error) => {
      console.error("Error:", error);
      setErrors({ submit: "An error occurred. Please try again later." });
    },
  });

  const handleContinue = async () => {
    try {
      if (image) {
        const blob = await fetch(image).then((res) => res.blob());
        const formData = new FormData();
        formData.append("image", blob);
            formData.append("collegeName", collegeName); 
        formData.append("email", email);
        formData.append("address", address);
        formData.append("phoneNumber", phoneNumber);
        formData.append("city", city);
            formData.append("collegeRegistrationNumber", collegeRegistrationNumber);
        formData.append("state", state);
        formData.append("registrationCertificate", registrationCertificate);
        formData.append("pincode", pincode);
        formData.append("directorsName", directorsName);
            formData.append("totalStudents", totalStudents);
        formData.append("password", password);

        console.log(formData);

        mutation.mutate(formData);
      } else {
        console.error("No image captured.");
      }
    } catch (error) {
      console.error("Error sending image to backend:", error);
    }
  };

  async function registerUser(event) {
    event.preventDefault();

    // Validate form data
    const validationData = {
      collegeName,
      address,
      email,
      phoneNumber,
      city,
      collegeRegistrationNumber,
      state,
      registrationCertificate,
      pincode,
      directorsName,
      totalStudents,
      createPassword,
      password,
    };

    const validationErrors = validate(validationData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (password !== createPassword) {
      alert("Passwords do not match");
      return;
    }
    setVideoCam(true);
    startCamera();
  }
console.log("errors",errors)

  return (
    <section className="flex   flex-row ">
      <div className="side-img flex-none w-30">
        <img
          src={coverImg}
          alt=""
          className="object-cover h-screen w-[500px]  sm:block hidden "
        />
      </div>
      <div className="flex flex-col  justify-center w-full items-center   ">
        <div className="form-header flex flex-col sm:flex-row sm:justify-center md:justify-between gap-x-40 md:mr-60 md:mt-0 mt-10 mb-20 sm:items-center sm:ml-30">
          {!videoCam ? (
           <img
             src={logo}
             alt="logo"
             className="h-[60px] hidden md:block mb-4 sm:mb-0"
           />
          ) : (
            <img
              src={brandLogo}
              alt="logo"
              className="h-[60px] hidden md:block mb-4 sm:mb-0"
            />
          )}

          <div className="form-btn flex justify-center items-center gap-2 sm:gap-4 sm:mr-50">
            <span className="custom-span-style text-2xl font-semibold">
              Sign Up
            </span>
            /
            <Link
              to="/login"
              className="custom-link-style text-2xl text-gray-400 font-semibold"
            >
              Login
            </Link>
          </div>
        </div>

        {!videoCam ? (
          <form
            className="flex flex-col justify-start  w-1/2  "
            onSubmit={registerUser}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-10">
              <div className="max-w-60">
                <input
                  type="text"
                  name="collegeName"
                  value={collegeName}
                  onChange={(e) => setcollegeName(e.target.value)}
                  className="block w-full px-0  text-[12px] text-black  border-b-2 border-gray-300 focus:border-black focus:outline-none"
                  placeholder="College Name"
                  required
                />
                {errors.collegeName && (
                  <span className="text-red-500 text-[12px]">
                    {errors.collegeName}
                  </span>
                )}
              </div>
              <div className="max-w-60">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-0  text-[12px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                  placeholder="Email ID"
                  required
                />
                {errors.email && (
                  <span className="text-red-500 text-[12px]">
                    {errors.email}
                  </span>
                )}
              </div>
              <div className="max-w-60">
                <input
                  type="text"
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="block w-full px-0  text-[12px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                  placeholder="Address"
                  required
                />
                {errors.address && (
                  <span className="text-red-500 text-[12px]">
                    {errors.address}
                  </span>
                )}
              </div>
              <div className="max-w-60">
                <input
                  type="number"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setphoneNumber(e.target.value)}
                  className="block w-full px-0  text-[12px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                  placeholder="Phone Number"
                  required
                />
                {errors.phoneNumber && (
                  <span className="text-red-500 text-[12px]">
                    {errors.phoneNumber}
                  </span>
                )}
              </div>
              <div className="max-w-60">
                <input
                  type="text"
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="block w-full px-0  text-[12px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                  placeholder="City"
                  required
                />
                {errors.city && (
                  <span className="text-red-500 text-[12px]">
                    {errors.city}
                  </span>
                )}
              </div>
              <div className="max-w-60">
                <input
                  type="text"
                  name="collegeRegistrationNumber"
                  value={collegeRegistrationNumber}
                  onChange={(e) => setcollegeRegistrationNumber(e.target.value)}
                  className="block w-full px-0  text-[12px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                  placeholder="College Registration Number"
                  required
                />
                {errors.collegeRegistrationNumber && (
                  <span className="text-red-500 text-[12px]">
                    {errors.collegeRegistrationNumber}
                  </span>
                )}
              </div>
              <div className="max-w-60">
                <input
                  type="text"
                  name="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="block w-full px-0  text-[12px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                  placeholder="State"
                  required
                />
                {errors.state && (
                  <span className="text-red-500 text-[12px]">
                    {errors.state}
                  </span>
                )}
              </div>
              <div className="max-w-60">

              <span className="block w-full px-0 md:text-[12px] text-[10px] text-gray-600 border-b-2 border-gray-300 focus:border-black focus:outline-none">
               {registrationCertificate ? registrationCertificate.name : "Registration Certificate Upload"}
              </span> 
              <input
                  type="file"
                  id="registrationCertificate"
                  accept=".jpg"
                  onChange={(e) => {
                    setregistrationCertificate(e.target.files[0]);
                  }}
                  className="hidden"
                  placeholder="Registration Certificate"
                  required
                />
                 <label
                 htmlFor="registrationCertificate"
                   className=" px-4 py-2 text-[12px] text-white bg-gray-700 rounded cursor-pointer text-center mt-4 h-8 w-14 flex items-center justify-center"
                  >
                    Choose 
                  </label>
                {errors.registrationCertificate && <span className="text-red-500 text-[12px]">{errors.registrationCertificate}</span>}
              </div>
              </div>

              
              <div className="max-w-60 mb-8">
                <input
                  type="number"
                  name="pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="block w-full px-0 text-[12px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                  placeholder="Pincode"
                  required
                />
                {errors.pincode && <span className="text-red-500 text-[12px]">{errors.pincode}</span>}
              </div>
             
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-10">
              <div className="max-w-60">
                <input
                  type="text"
                  name="directorsName"
                  value={directorsName}
                  onChange={(e) => setdirectorsName(e.target.value)}
                  className="block w-full px-0 text-[12px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                  placeholder="College Director's Name"
                  required
                />
                {errors.directorsName && <span className="text-red-500 text-[12px]">{errors.directorsName}</span>}
              </div>
              <div className="">
                <input
                  type="password"
                  name="create-password"
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                  className="block w-full px-0  text-[12px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                  placeholder="Create Password"
                  required
                />
                {errors.createPassword && (
                  <span className="text-red-500 text-[12px]">
                    {errors.createPassword}
                  </span>
                )}
              </div>
              <div className="max-w-60">
                <input
                  type="number"
                  name="totalStudents"
                  value={totalStudents}
                  onChange={(e) => settotalStudents(e.target.value)}
                  className="block w-full px-0 text-[12px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                  placeholder="Total Number of Students"
                  required
                />
                {errors.totalStudents && <span className="text-red-500 text-[12px]">{errors.totalStudents}</span>}
              </div>
            
              <div className="">
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-0  text-[12px] text-black border-b-2 border-gray-300 focus:border-black focus:outline-none"
                  placeholder="Confirm Password"
                  required
                />
                {errors.password && (
                  <span className="text-red-500 text-[12px]">
                    {errors.password}
                  </span>
                )}
              </div>
              </div>
            <span className="">
              {errors.submit && (
                <span className="text-red-500 text-[11px]">
                  {errors.submit}
                </span>
              )}
            </span>
            <div className="text-center mt-10 ">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-1.5 text-sm text-center text-white bg-black hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg"
              >
                Sign Up
            </button>
            </div>
            <p className="text-[10px] text-center text-gray-500 mt-4">
              Terms and Condition privacy policy
            </p>
          </form>
        ) : (
          <div className="capture-image flex flex-col justify-center items-center mt-16 ">
            <p
              className="text-xs mb-6 mr-32"
              style={{
                fontFamily: "Poppins",
                fontWeight: 600,
                textAlign: "left",
              }}
            >
              Please Capture our face to continue
            </p>

            <div className="bg-gray-400 h-64 w-80 rounded-md flex justify-center items-center relative">
              {!image && (
                <img
                  src={cameraicon}
                  alt="Camera Icon"
                  className="h-10 w-10 absolute inset-0 m-auto"
                />
              )}

              <label htmlFor="imageInput" className="">
                {image ? (
                  <img src={image} alt="Camera Icon" className="h-64 w-80" />
                ) : (
                  <div className="h-68 w-80">
                    <video id="video" autoPlay muted></video>
                  </div>
                )}
              </label>
              </div>

            <div className="button-section my-8">
              {!image && (
                <button
                  onClick={handleCaptureImage}
                  className="w-full sm:w-auto px-6 py-1.5 text-sm text-center text-white bg-black hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg"
                >
                  Capture
                </button>
              )}
              {showRetakeContinue && (
                <div className=" justify-center mt-10 flex gap-4">
                  <button
                    onClick={handleRetake}
                    className="w-full sm:w-auto px-6 py-1.5 text-sm text-center text-white bg-black hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg"
                  >
                    Re-take
                  </button>
                  <button
                    onClick={handleContinue}
                    className="w-full sm:w-auto px-6 py-1.5 text-sm text-center text-white bg-black hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg"
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>
            <p className="text-[10px] text-center text-gray-500 mt-6">
              *Terms and Condition privacy policy
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default SignUp;
