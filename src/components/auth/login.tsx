import { Anchor, Button, Container, Paper, PasswordInput, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { errorNotification } from "../PropertyCard";

type Inputs = {
  email: string;
  password: string;
};

export function LoginForm() {
  const router = useRouter();
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<Inputs>({
    initialValues: { email: "", password: "" },
    validate: {
      email: (value: string) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value: string) => (value.length > 0 ? null : "Password is required"),
    },
  });

  if (status === "loading") return null;
  if (status === "authenticated") {
    void router.push("/properties");
    return null;
  }

  const handleSubmit = async (values: Inputs) => {
    setIsLoading(true);
    const res = await signIn("credentials", { redirect: false, ...values });

    if (res?.status === 401) {
      errorNotification("Check your credentials and try again.", "Wrong email or password");
      setIsLoading(false);
      return;
    }

    if (res?.status !== 200) {
      errorNotification("Check your internet connection and try again", "Something went wrong.");
      setIsLoading(false);
      return;
    }

    void router.push("/properties");
    setIsLoading(false);
  };

  return (
    <Container size={420} my={40}>
      {/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
      <Title align="center" sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}>
        Welcome back!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        {"Don't have an account yet? "}
        <Link href="/auth/signup">
          <Anchor size="sm" component="button">
            Create account
          </Anchor>
        </Link>
      </Text>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit((values) => void (async () => await handleSubmit(values))())}>
          <TextInput label="Email" placeholder="Your email" {...form.getInputProps("email")} />
          <PasswordInput label="Password" placeholder="Your password" mt="md" {...form.getInputProps("password")} />
          <Button fullWidth mt="xl" type="submit" loading={isLoading} disabled={status === "authenticated"}>
            Sign in
          </Button>
        </form>
      </Paper>
      <Text color="dimmed" size="sm" align="center" mt={16}>
        <Link href="/">
          <Anchor size="sm" component="button">
            Return to the home page
          </Anchor>
        </Link>
      </Text>
    </Container>
  );
}
