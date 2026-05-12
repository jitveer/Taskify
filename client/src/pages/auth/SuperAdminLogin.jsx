import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function SuperAdminLogin() {

    // 2. Initialize the form tools
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const navigate = useNavigate();

    // 3. Define what happens when the form is valid
    const onSubmit = (data) => {
        console.log("SuperAdmin Data:", data);
        alert("Login Successful");

        navigate("/super-admin-dashboard");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-200 to-indigo-300 flex justify-center items-center px-5">

            {/* login card */}
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10">

                {/* Heading */}
                <div className="text-center mb-8">

                    <h1 className="text-4xl font-bold text-gray-800 mb-3">
                        SuperAdmin
                    </h1>

                    <p className="text-gray-500">
                        Login to Countinue
                    </p>

                </div>




                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* Emailinput */}
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

                            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"

                        />

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
                                required: "Password is required",
                                pattern: {
                                    value:
                                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,

                                    message:
                                        "Password must contain uppercase, lowercase, number & special character"
                                }
                            })}

                            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                        />

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
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-lg font-semibold duration-300 shadow-lg">
                        Login
                    </button>

                </form>



                {/* Bottom text */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    Taskify super Admin Portal
                </p>

            </div>
        </div>
    )
}



export default SuperAdminLogin;