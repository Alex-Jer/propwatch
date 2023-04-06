import { useQuery } from "@tanstack/react-query";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { axiosReq } from "~/lib/requestHelper";

interface List {
  id: number;
  name: string;
  description: string;
}

const Lists: NextPage = () => {
  const { data: session, status } = useSession();

  const {
    isLoading,
    error,
    data: res,
    isFetching,
  } = useQuery({
    queryKey: ["lists"],
    queryFn: () => axiosReq("me/lists", "GET", session?.user.access_token),
    enabled: status === "authenticated",
  });

  if (isLoading) {
    console.log("Loading...");
  }

  if (isFetching) {
    console.log("Fetching...");
  }

  if (error) {
    console.log("Error!");
  }

  return (
    <>
      <Head>
        <title>My Lists</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <h1>My Lists</h1>
        {res?.data?.map((list: List) => (
          <div key={list.id}>
            <h3 className="text-2xl">{list.name}</h3>
            <p>{list.description}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Lists;
