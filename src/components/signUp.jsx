import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { createUser, getUsers } from './../api/userService';

function SignUp() {
    const navigate = useNavigate();
    const initialValues = {username: "", email: "", password: ""}
    const [formValues, setFormValues] = useState(initialValues)
    const [formErrors, setFormErrors] = useState({})
    const [isVisible, setIsVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: ''
            });
        }
    }


    const handleErrors = (values) => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        
        if (!values.username) {
            errors.username = "Username is required";
        } else if (values.username.length < 3) {
            errors.username = "Username must be at least 3 characters";
        }

        if (!values.email) {
            errors.email = "Email is required";
        } else if (!emailRegex.test(values.email)) {
            errors.email = "Invalid email format";
        }

        if (!values.password) {
            errors.password = "Password is required";
        } else if (values.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        } else if (!/\d/.test(values.password)) {
            errors.password = "Password must contain at least one number";
        }

        return errors;
    }

   const checkUserExist = async (username, email) => {
    try {
        const users = await getUsers();
        const usernameExists = users.find(u => u.username === username);
        const emailExists = users.find(u => u.email === email);

        return { usernameExists, emailExists };
    } catch (error) {
        console.error('Error checking user existence:', error);
        throw error;
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = handleErrors(formValues);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
        return;
    }
    
    setIsLoading(true);

    try {
        const { usernameExists, emailExists } = await checkUserExist(
            formValues.username,
            formValues.email
        );

        const newErrors = {};

        if (usernameExists) {
            newErrors.username = 'Username already exists';
            toast.error("User already exists with this username");
        }

        if (emailExists) {
            newErrors.email = 'Email already exists';
            toast.error("User already exists with this email");
        }

        if (Object.keys(newErrors).length > 0) {
            setFormErrors(newErrors);
            return;
        }

        const newUser = await createUser(formValues);

        if (newUser) {
            toast.success(`${formValues.username} you are signed up successfully!`)
            setFormValues(initialValues);
            setFormErrors({});
            navigate('/logIn');
        }

    } catch (error) { 
        console.error('Error during signup:', error);
        toast.error("Something went wrong! Please try again.");
    } finally {
        setIsLoading(false);
    }
};



    return (
        <>
            <div className="flex justify-center items-center flex-col min-h-screen">
                <div onClick={ () => navigate("/")} className="fixed top-0 left-0 ml-4 mt-4 min-w-1.5 flex items-center cursor-pointer">
                    <IoMdArrowRoundBack className="text-3xl inline-block mt-2"/>
                    <span className="text-2xl inline-block ml-1">Home</span>
                </div>
                <form onSubmit={handleSubmit} className="w-96 p-6 bg-white shadow-md rounded-lg">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Username
                        </label>
                        <input 
                            type="text" 
                            name="username"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                            placeholder="Enter username"
                            value={formValues.username}
                            onChange={handleChange}
                        />
                        {formErrors.username && 
                            <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>
                        }
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input 
                            type="email"
                            name="email" 
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                            placeholder="Enter email"
                            value={formValues.email}
                            onChange={handleChange}
                        />
                        {formErrors.email && 
                            <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                        }
                    </div>
                    <div className="mb-6 relative">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input 
                            type={isVisible ? "text" : "password"}
                            name="password" 
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 pr-10"
                            placeholder="Enter password"
                            value={formValues.password}
                            onChange={handleChange}
                            
                        />
                        {isVisible ? (
                            <FaEye 
                                onClick={() => setIsVisible(false)}
                                className="absolute right-3 top-10 cursor-pointer"/> ) : (
                            <FaEyeSlash 
                            onClick={() => setIsVisible(true)}
                            className="absolute right-3 top-10 cursor-pointer"
                        />
                    )}
                        {formErrors.password && 
                            <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                        }
                        
                    </div>
                    <button 
                        type="submit"
                        disapled={isLoading}
                        className={isLoading ? "w-full bg-gray-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 opacity-50" 
                                            : "w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2"}
                    >
                    {isLoading ? ( 
                    <div class="text-center">
                    <div role="status">
                        <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-black fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span class="sr-only">Loading...</span>
                    </div>
                    </div>
                    ) 
                        : ("Sign Up")}
                    </button>
                    <div className="mt-2">Already have an account?<Link className="text-blue-700 font-bold hover:underline" to="/logIn"> Login</Link></div>
                </form>
            </div>
        </>
    )
}

export default SignUp;