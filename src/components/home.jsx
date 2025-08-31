import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen ">
            <h1 className="font-extrabold text-6xl md:text-7xl text-gray-800 text-center tracking-tight">
                Welcome to your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-900 to-emerald-900 text-shadow-lg">
                    ToDo App
                </span>
            </h1>

            <p className="mt-6 text-xl md:text-2xl text-gray-600 text-center max-w-lg">
                Organize your day, stay productive, and keep track of your tasks easily ✨
            </p>

            <div className="flex flex-row gap-x-8 mt-12">
                <button
                    onClick={() => navigate("/signup")}
                    className="px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 text-lg"
                >
                    Sign Up
                </button>
                <button
                    onClick={() => navigate("/login")}
                    className="px-8 py-4 rounded-xl bg-green-600 text-white font-semibold shadow-lg hover:bg-green-700 hover:scale-105 transition-all duration-200 text-lg"
                >
                    Log In
                </button>
            </div>
        </div>
    );
}

export default Home;
