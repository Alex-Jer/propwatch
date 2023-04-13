import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { axiosReq } from "~/lib/requestHelper";

type Inputs = {
  email: string;
  password: string;
};

export function LoginForm() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<Inputs>({
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

    console.log(`Welcome back ${values.email}`);
    setIsLoading(false);
  };

  const logout = async () => {
    await signOut({ redirect: false });
    await axiosReq("logout", "DELETE", session?.user.access_token, null, false, true);
    console.log("Logged out");
  };

  return (
    <Container size={420} my={40}>
      {/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
      <Title align="center" sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}>
        Welcome back!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        {"Don't have an account yet? "}
        <Anchor size="sm" component="button">
          Create account
        </Anchor>
      </Text>
      <form onSubmit={form.onSubmit((values) => void (async () => await handleSubmit(values))())}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput label="Email" placeholder="you@mantine.dev" required {...form.getInputProps("email")} />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps("password")}
          />
          <Group position="apart" mt="lg">
            <Checkbox label="Remember me" />
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" type="submit" loading={isLoading} disabled={status === "authenticated"}>
            Sign in
          </Button>
          <Button fullWidth mt="sm" onClick={logout} variant="default">
            Log out
          </Button>
        </Paper>
      </form>
      <Text color="dimmed" size="sm" align="left" mt={5}>
        <div>
          <p>email: {session?.user?.email}</p>
          <p>photo_url: {session?.user?.photo_url || "none"}</p>
          <p>access_token: {session?.user.access_token}</p>
        </div>
      </Text>
    </Container>
  );
}
