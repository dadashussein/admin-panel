import { useEffect } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const redirectIfAuthenticated = async () => {
      const session = await getSession();
      if (session) {
        router.push("/");
      }
    };

    redirectIfAuthenticated();
  }, []);

  const handleSignIn = (e) => {
    e.preventDefault();
    signIn();
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSignIn}>
        <button type="submit">Sign In with Google</button>
      </form>
    </div>
  );
}
