import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function AdminLogin() {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();


    const navigate = useNavigate();


    const onSubmit = (data) => {
        console.log("SuperAdmin Data:", data);
        alert("Login Successful");

        navigate("/admin-dashboard");
    };




    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-200 to-cyan-300 flex justify-center items-center px-5">

            {/* Login Card */}
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10">

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-3">
                        Admin Login
                    </h1>

                    <p className="text-gray-500">
                        Login to countinue
                    </p>
                </div>


                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* EMail */}
                    <div className="mb-5">

                        <label className="block text-gray-700 font-semibold mb-2">
                            Email Address
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your Email"

                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                                    message: "Only Gmail addresses are allowed"
                                }
                            })}

                            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />


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

                        <input
                            type="password"
                            placeholder="Enter your password"

                            {...register("password", {
                                required: "password is required",
                                pattern: {
                                    value:
                                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,

                                    message:
                                        "Password must contain uppercase, lowercase, number & special character"
                                }
                            })}

                            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />

                        {/* Password error */}
                        {
                            errors.password && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.password.message}
                                </p>
                            )
                        }
                    </div>



                    {/* login button */}
                    <button
                        type="Submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold duration-300 shadow-lg">
                        Login
                    </button>

                </form>



                {/* Bottom text */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    Taskify Admin portal
                </p>
            </div >
        </div >
    )
}

export default AdminLogin;