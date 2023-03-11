import { type NextPage } from "next";
import Head from "next/head";
import { LoginForm } from "~/components/auth/login";

const Login: NextPage = () => {
  return (
    <>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoginForm />
    </>
  );
};

export default Login;
