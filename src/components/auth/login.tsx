import { Anchor, Button, Container, Paper, PasswordInput, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

type Inputs = {
  email: string;
  password: string;
};

export function LoginForm() {
  const router = useRouter();
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  if (status === "authenticated") {
    void router.push("/properties");
  }

  const form = useForm<Inputs>({
    // TODO: Temp values
    initialValues: { email: "test123@example.com", password: "123456" },
    validate: {
      email: (value: string) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value: string) => (value.length > 5 ? null : "Password must be at least 6 characters long"),
    },
  });

  const handleSubmit = async (values: Inputs) => {
    setIsLoading(true);
    const res = await signIn("credentials", { redirect: false, ...values });

    if (res?.status === 401) {
      console.log("Wrong email or password");
      setIsLoading(false);
      return;
    }

    void router.push("/collections");
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
          <TextInput label="Email" placeholder="you@mantine.dev" required {...form.getInputProps("email")} />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps("password")}
          />
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
