import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import {
    showSuccess,
    showError,
    showWarning
} from "../../components/layout/Alerts";

function EmployeeLogin() {

    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const navigate = useNavigate();


    const onSubmit = async (data) => {
        try {
            console.log("Employee Data:", data);

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/employee/login`,
                {
                    email: data.email,
                    password: data.password
                }
            );

            const loggedInUser = response.data.user;

            if (loggedInUser.role !== "employee") {
                showWarning(
                    `You are registered as ${loggedInUser.role}, not an employee.`
                );
                return;
            }

            localStorage.setItem(
                "user",
                JSON.stringify(loggedInUser)
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            showSuccess("Employee Login Successful");

            navigate("/employee-dashboard");

        } catch (error) {
            console.log(error);
            showError(
                error.response?.data?.message ||
                "Invalid Email or Password"
            );
        }
    };



    return (

        <div className="min-h-screen bg-gradient-to-br from-emerald-200 to-green-300 flex justify-center items-center px-5">

            {/* Login Card */}
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 md:p-10">


                {/* heading */}
                <div className="text-center mb-8">

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                        Employee Login
                    </h1>

                    <p className="text-gray-500">
                        Login to countinue
                    </p>
                </div>



                {/* form */}
                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* Email */}
                    <div className="mb-5">

                        <label className="block text-gray-700 font-semibold mb-2">
                            Email Address
                        </label>

                        <input type="email"
                            placeholder="Enter your Email"

                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                                    message: "Only Gmail addresses are allowed"
                                }
                            })}

                            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500" />


                        {/* Email Error */}
                        {
                            errors.email && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.email.message}
                                </p>
                            )
                        }
                    </div>


                    {/* Password */}
                    <div className="mb-6">

                        <label className="block text-gray-700 font-semibold mb-2">
                            Password
                        </label>

                        <div className="relative">

                            <input
                                type={showPassword ? "text" : "password"}

                                placeholder="Enter your password"

                                {...register("password", {
                                    required: "Password is Required",
                                    pattern: {
                                        value:
                                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,

                                        message:
                                            "Password must contain uppercase, lowercase, number & special character"
                                    }
                                })}

                                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-green-500"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-4 text-gray-500"
                            >

                                {
                                    showPassword
                                        ? <FaEyeSlash />
                                        : <FaEye />
                                }

                            </button>

                        </div>

                        {/* Password Error */}
                        {
                            errors.password && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.password.message}
                                </p>
                            )
                        }

                    </div>


                    {/* Login Button */}
                    <button
                        type="Submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-lg font-semibold duration-300 shadow-lg">
                        Login
                    </button>

                </form>


                {/* Bottom Text */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    Taskify Employee Portal
                </p>

            </div>
        </div>
    )
}

export default EmployeeLogin;
