import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col items-center">
      <h1 className="text-4xl text-center p-2">Website under Construction</h1>
      <div className="h-[50%] w-[25%] flex flex-col justify-center items-center gap-4">
        <Link className="" href={"/signup"}>
          <button className="cursor-pointer bg-[#232323] p-3 w-[125px] rounded-xl" type="button">Sign Up</button>
        </Link>
        <Link className="" href={"/signin"}>
          <button className="cursor-pointer bg-[#232323] p-3 w-[125px] rounded-xl" type="button">Sign In</button>
        </Link>
      </div>
    </div>
  );
}
