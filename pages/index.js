import Layout from "@/components/Layout";
import Image from "next/image";
import { isAdminRequest } from "./api/auth/[...nextauth]";
import { getSession } from "next-auth/react";

export default function Home({ name, image }) {
  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2>
          Salam, <b>{name}</b>
        </h2>
        <div className="flex bg-gray-300 text-black rounded-lg overflow-x-hidden ">
          <Image
            src={image}
            alt=""
            width={50}
            height={50}
            className="w-6 h-6"
          />
          <span className="px-2"> {name}</span>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ req, res }) {
  try {
    await isAdminRequest(req, res);

    const session = await getSession({ req });
    const { name, image } = session?.user;

    return {
      props: {
        name,
        image,
        data: "You are an admin!",
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
}
