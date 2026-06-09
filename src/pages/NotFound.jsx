import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">

        <h1 className="text-6xl font-bold text-gray-800">404</h1>

        <h2 className="mt-4 text-2xl font-semibold text-gray-700">
          Page not found
        </h2>

        <p className="mt-2 text-gray-500">
          The page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go to Home
        </Link>

      </div>
    </div>
  );
}