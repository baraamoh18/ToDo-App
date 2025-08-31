import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    return (
        <>
            <div className="flex flex-col gap-y-6">
                <h1 className="font-bold text-6xl self-center mt-60 kumar-one-outline-regular">
                    Welcome to your
                </h1>
                <p className="text-5xl self-center kumar-one-outline-regular">
                    ToDo App
                </p>

                <div className="flex flex-row gap-x-10 justify-center mt-20 text-2xl">
                    <button
                        onClick={() => navigate("/signup")}
                        className="kumar-one-outline-regular cursor-pointer px-8 py-3 rounded-2xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 hover:scale-105 transition-transform duration-200"
                    >
                        Sign Up
                    </button>
                    <button
                        onClick={() => navigate("/login")}
                        className="kumar-one-outline-regular cursor-pointer px-8 py-3 rounded-2xl bg-green-600 text-white font-semibold shadow-md hover:bg-green-700 hover:scale-105 transition-transform duration-200"
                    >
                        Log In
                    </button>
                </div>
            </div>
        </>
    );
}

export default Home;
