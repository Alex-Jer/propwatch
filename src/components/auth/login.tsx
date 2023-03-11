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
import { signIn, useSession } from "next-auth/react";

type Inputs = {
  email: string;
  password: string;
};

export function LoginForm() {
  const form = useForm<Inputs>({
    initialValues: { email: "test@test.com", password: "123456" },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => (value.length > 5 ? null : "Password must be at least 6 characters long"),
    },
  });

  const handleSubmit = (values: Inputs) => {
    console.log(values);
    void signIn("credentials", { redirect: false, ...values });
  };

  const { data: session, status } = useSession();

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

      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
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
          <Button fullWidth mt="xl" type="submit">
            Sign in
          </Button>
        </Paper>
      </form>

      <Text color="dimmed" size="sm" align="left" mt={5}>
        <div>
          <p>Session status: {status}</p>
          <p>name: {session?.user?.name}</p>
          <p>email: {session?.user?.email}</p>
          <p>photo_url: {session?.user?.photo_url || "none"}</p>
        </div>
      </Text>
    </Container>
  );
}
