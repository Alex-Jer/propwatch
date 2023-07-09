import { type NextPage } from "next";
import Head from "next/head";
import { SignUpForm } from "~/components/auth/signup";

const SignUp: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sign Up</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SignUpForm />
    </>
  );
};

export default SignUp;
