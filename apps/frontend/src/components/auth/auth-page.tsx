"use client";

interface AuthPageProps {
  isSignin: boolean
}

export default function AuthPage ({isSignin}: AuthPageProps) {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="bg-[#121212] flex flex-col justify-center items-center gap-4 p-8 rounded-xl">
        {isSignin ? <input className="p-3 bg-[#232323] text-white rounded" type="text" placeholder="Name" /> : null}
        <input className="p-3 bg-[#232323] text-white rounded" type="text" placeholder="Email" />
        <input className="p-3 bg-[#232323] text-white rounded" type="password" placeholder="Password" />

        <button className="bg-[#232323] p-3 w-full rounded-xl" type="button" onClick={() => { }}>{isSignin ? "Signin" : "Signup"}</button>
      </div>

    </div>
  );
}