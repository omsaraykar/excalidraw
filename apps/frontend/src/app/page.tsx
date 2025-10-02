import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl text-center p-2">Website Under Construction</h1>

      <div className="h-[50%] w-[25%] flex flex-col justify-center items-center gap-4">
        <Link href="/signup" passHref>
          <button
            className="cursor-pointer bg-[#232323] p-3 w-[125px] rounded-xl text-white"
            type="button"
          >
            Sign Up
          </button>
        </Link>

        <Link href="/signin" passHref>
          <button
            className="cursor-pointer bg-[#232323] p-3 w-[125px] rounded-xl text-white"
            type="button"
          >
            Sign In
          </button>
        </Link>
      </div>
    </div>
  );
}
