"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import emailValidator from '@/utils/Validator/emailvalidator';
import { toast } from 'sonner'
import { myInstance } from '@/utils/Axios/axios'
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const Loginform = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [isVisible, setIsVisible] = useState(false);

    const router = useRouter();

    const toggleVisibility = () => setIsVisible(!isVisible)

    const handleRegister = () => {
        router.push('/register');
      };
    

    const handleLogin = async () => {      

        setIsLoading(true);

        let response;
        if(!emailValidator(email)){
            console.log("Email is invalid")
            toast.error("Invalid email");
            setIsLoading(false);
            return;
        }

        try{
                response = await myInstance.post('/login',{
                email: email,
                password: password,
            });
            if (!response){
                setIsLoading(false);
                toast.error("Invalid credentials")
            }else{
                const { token } = response.data

                if (token){
                    localStorage.setItem("authtoken",token);
                    setIsLoading(false);
                    router.push('/dashboard');
                }              
            }
        } catch (error) {
            setIsLoading(false);
            toast.error("There was an error");
            console.log("error");
        }

             
    }
  return (
    
    <div className="flex justify-center items-center h-screen overflow-hidden">
    <form
    onSubmit={handleLogin}
    className="border bg-white bg-opacity-70 p-6 rounded-lg shadow-md w-80"
    >
    <h2 className="text-2xl font-bold text-gray-800 mb-7 mt-5 text-center">
      Login
    </h2>

    <div className="mb-4">
      <label htmlFor="email" className="block text-gray-700">
        Email
      </label>
      <input
        type="text"
        id="username"
        className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
       
      />
    </div>

    <div className="mb-4">
    <label htmlFor="password" className="block text-gray-700">
    Password
    </label>
    <div className="relative mt-2">
      <input
      id="password"
      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-10"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      type={isVisible ? "text" : "password"}
      />
     <button
      className="absolute inset-y-0 right-3 flex items-center"
      type="button"
      onClick={toggleVisibility}
      aria-label="toggle password visibility"
      >
      {isVisible ? (
        <IoMdEye className="text-xl text-gray-400" />
      ) : (
        <IoMdEyeOff className="text-xl text-gray-400" />
      )}
      </button>
  </div>
</div>


    <button
      type="submit"
      className="w-full bg-[#2F4F4F] font-medium text-white p-2 mt-6 rounded-md hover:bg-cyan-700 transition"
    >
      {isLoading ? "Logging in..." : "Login"}
    </button>

    <hr className="my-4 " />

    <button
      type="button"
      onClick={handleRegister}
      className="w-full bg-[#2F4F4F] font-medium text-white p-2 mt-1.5 rounded-md hover:bg-cyan-700 transition"
    >
      Register
    </button>
  </form>
</div>


 
  )
}

export default Loginform;