import { useEffect, useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const { user, signUp } = UserAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // For image preview
  const [isValidProfilePicture, setIsValidProfilePicture] = useState(false);
  const [errors, setErrors] = useState({
    displayName: "",
    email: "",
    password: "",
    profilePicture: "",
  });

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validate the form inputs
    let formIsValid = true;
    const newErrors = { ...errors };

    if (!displayName) {
      formIsValid = false;
      newErrors.displayName = "Name is required";
    }

    if (!email) {
      formIsValid = false;
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formIsValid = false;
      newErrors.email = "Invalid email address";
    }

    if (!password) {
      formIsValid = false;
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      formIsValid = false;
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isValidProfilePicture) {
      formIsValid = false;
      newErrors.profilePicture = "Profile picture is required";
    }

    setErrors(newErrors);

    if (formIsValid) {
      try {
        // Sign up the user using Firebase authentication
        await signUp(displayName, email, password, profilePicture);

        // Clear the form inputs after successful authentication
        setDisplayName("");
        setEmail("");
        setPassword("");
        navigate("/chat");
      } catch (error) {
        console.error("Error signing up:", error);
      }
    }
  };

  const handleProfilePictureChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setProfilePicture(selectedImage);
      setPreviewImage(URL.createObjectURL(selectedImage)); // Set the preview image
    }
    setProfilePicture(selectedImage);
    setIsValidProfilePicture(selectedImage !== undefined);

    // Clear the error message for profile picture when a file is uploaded
    setErrors((prevErrors) => ({
      ...prevErrors,
      profilePicture: "",
    }));
  };

  const handleDisplayNameChange = (e) => {
    const value = e.target.value;
    setDisplayName(value);
    // Clear the error message for display name when the user starts typing or when the field is filled
    setErrors((prevErrors) => ({
      ...prevErrors,
      displayName: value ? "" : prevErrors.displayName,
    }));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    // Clear the error message for email when the user starts typing or when the field is filled
    setErrors((prevErrors) => ({
      ...prevErrors,
      email: value ? "" : prevErrors.email,
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    // Clear the error message for password when the user starts typing or when the field is filled
    setErrors((prevErrors) => ({
      ...prevErrors,
      password: value ? "" : prevErrors.password,
    }));
  };

  useEffect(() => {
    if (user) {
      navigate("/chat");
    }
  }, [user, navigate]);

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content">
        <div className="card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100">
          <div className="card-body">
            <div className="max-w-md text-center">
              <h1 className="text-5xl font-bold">tChat</h1>
              <p className="py-6">
                Join the conversation, meet new people, and make connections in
                one shared room.
              </p>
              <button type="button" className="btn btn-primary">
                Sign up with google
              </button>
            </div>
            <div className="divider">OR</div>
            <form onSubmit={handleSignUp}>
              <div className="relative z-0 w-full mb-5">
                <input
                  type="text"
                  name="displayName"
                  placeholder=" "
                  value={displayName}
                  onChange={handleDisplayNameChange}
                  className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 border-gray-500"
                />
                <label
                  htmlFor="displayName"
                  className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500"
                >
                  Enter name
                </label>
                {errors.displayName && (
                  <div className="text-error">{errors.displayName}</div>
                )}
              </div>
              <div className="relative z-0 w-full mb-5">
                <input
                  type="text"
                  name="email"
                  placeholder=" "
                  value={email}
                  onChange={handleEmailChange}
                  className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 border-gray-500"
                />
                <label
                  htmlFor="email address"
                  className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500"
                >
                  Email address
                </label>
                {errors.email && (
                  <div className="text-error">{errors.email}</div>
                )}
              </div>
              <div className="relative z-0 w-full mb-5">
                <input
                  type="password"
                  name="password"
                  placeholder=" "
                  value={password}
                  onChange={handlePasswordChange}
                  className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 border-gray-500"
                />
                <label
                  htmlFor="password"
                  className="absolute duration-300 top-3 -z-1 origin-0 text-gray-500"
                >
                  Password
                </label>
                {errors.password && (
                  <div className="text-error">{errors.password}</div>
                )}
              </div>
              <div className="flex gap-6 flex-wrap mb-4 mt-4 items-center content-center">
                <div className="avatar">
                  <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    {previewImage ? (
                      <img src={previewImage} alt="previewImage" />
                    ) : (
                      <img
                        src="https://i.ibb.co/8mY9H99/User-Avatar.png"
                        alt="previewImage"
                      />
                    )}
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                />
                {errors.profilePicture && (
                  <div className="text-error">{errors.profilePicture}</div>
                )}
              </div>
              <div className="form-control">
                <button type="submit" className="btn btn-primary">
                  Sign up
                </button>
              </div>
            </form>
            <p>
              <Link to="/">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
