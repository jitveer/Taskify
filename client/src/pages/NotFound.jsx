import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">

            <h1 className="text-8xl font-bold text-red-500">
                404
            </h1>

            <h2 className="text-3xl font-semibold text-gray-800 mt-4">
                Page Not Found
            </h2>

            <p className="text-gray-600 mt-2 text-center">
                The page you are looking for does not exist.
            </p>

            <Link
                to="/"
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Go To Home
            </Link>

        </div>
    );
}

export default NotFound;