import { useSession, signIn, signOut } from "next-auth/react";
import Nav from "@/components/Nav";
import { useState } from "react";
import Logo from "./Logo";

export default function Layout({ children }) {
  const [toggle, setToggle] = useState(false);
  const { data: session } = useSession();
  if (!session) {
    return (
      <div className="bg-bggray tw-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button
            onClick={() => signIn("google")}
            className="bg-white text-black px-2 p-2 rounded-lg"
            type="submit"
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-bggray min-h-screen">
      <div className="md:hidden flex items-center p-4">
        <button onClick={() => setToggle(!toggle)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <div className="flex grow justify-center mr-6">
          <Logo />
        </div>
      </div>
      <div className=" flex">
        <Nav toggle={toggle} />
        <div className="  flex-grow p-4 mb-2 ">
          {children}
        </div>
      </div>
    </div>
  );
}
