"use client"

import axios, {AxiosError} from 'axios';
import { FormEvent, MouseEventHandler, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function LoginPage() {

  const [error, setError] = useState<string | undefined>();
  const router = useRouter();

  const handleForgetPasswordClick = () => {
    router.push('/forget-password'); // Replace with your forget-password page path
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {

      const formData = new FormData(e.currentTarget)
        const res = await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirect: false,
      });

      if (res?.error) return setError(res.error as string)
    
      if (res?.ok) return router.push("/construccion_logic")
    
    }
    catch(error){
      console.log(error)
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          setError("Invalid credentials")
      }
    }
  }
}

  return (
      <main className="container mx-auto flex flex-col justify-center items-center bg-black">
        <h2 style={{textShadow: '3px 3px 2px rgba(255, 0, 0, 0.5)'}} className="text-5xl font-bold mb-6 text-center w-full text-red-500 mr-5"> LOGIN </h2>
        <div className="flex justify-between">
        <form onSubmit={handleSubmit} className="w-full max-w-md mr-6 bg-black border border-gray-300 p-4 flex flex-col justify-center items-center" style={{boxShadow: '0px 0px 5px 5px rgba(255, 255, 255, 0.2)'}}>
          <input 
            type="Email" 
            placeholder="Email" 
            name="email"
            className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-white bg-black"
            style={{ backgroundColor: 'black' }}
          />
          <input 
            type="password" 
            placeholder="********" 
            name="password"
            className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-white bg-black"
            style={{ backgroundColor: 'black' }}
          />
          <button 
              className="w-full p-2 bg-black mb-4 text-white border border-white rounded-lg font-bold uppercase duration-200 hover:bg-gray-900">
              Login
          </button>
          <button 
          type="button" // Prevent form submission
          onClick={handleForgetPasswordClick} // Handle click event
          className="w-full p-2 bg-black mb-4 text-white border border-white rounded-lg font-bold uppercase duration-200 hover:bg-gray-900"
        >
          Forget password
        </button>
          {error && <p className="text-red-500 ">{error}</p>}
        </form>
        
        </div>
    </main>
  );
}

export default LoginPage;