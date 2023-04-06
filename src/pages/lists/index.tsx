import { useQuery } from "@tanstack/react-query";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect } from "react";
import { axiosReq } from "~/lib/requestHelper";

const Lists: NextPage = () => {
  const { data: session, status } = useSession();

  const { isLoading, error, data, isFetching } = useQuery({
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

  // TODO:  temp
  useEffect(() => {
    if (data) {
      console.log("Data: ", data);
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>My Lists</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/*
      <div>
        {data?.data?.map((list) => (
          <div key={list.id}>
            <h3>{list.name}</h3>
            <p>{list.description}</p>
          </div>
        ))}
      </div>
      */}
    </>
  );
};

export default Lists;
