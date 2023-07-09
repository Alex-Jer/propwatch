import { zodResolver } from "@hookform/resolvers/zod";
import { Anchor, Button, Container, Paper, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { PasswordInput, TextInput } from "react-hook-form-mantine";
import { z } from "zod";
import { register } from "~/lib/requestHelper";
import { type AxiosErrorResponse } from "~/types";

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  password_confirmation: z.string().min(6),
});

const defaultValues: FormSchemaType = {
  // TODO: Temp values
  name: "Test",
  email: "test3210@example.com",
  password: "123456",
  password_confirmation: "123456",
};

type FormSchemaType = z.infer<typeof schema>;

export function SignUpForm() {
  const router = useRouter();
  const { status } = useSession();

  const { control, handleSubmit } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  /* const handleSubmit = async (values: FormSchemaType) => { */
  /*   setIsLoading(true); */
  /*   const res = await signIn("credentials", { redirect: false, ...values }); */
  /**/
  /*   if (res?.status === 401) { */
  /*     console.log("Wrong email or password"); */
  /*     setIsLoading(false); */
  /*     return; */
  /*   } */
  /**/
  /*   void router.push("/collections"); */
  /*   setIsLoading(false); */
  /* }; */

  const signup = async (values: FormSchemaType) => {
    await register(
      values.name,
      values.email,
      values.password,
      values.password_confirmation,
      window.navigator.userAgent
    );

    return await signIn("credentials", { redirect: false, ...values });
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "You have been successfully registered!",
        color: "teal",
        icon: <IconCheck size="1.5rem" />,
      });
      void router.push("/properties");
    },
    onError: (error: AxiosErrorResponse) => {
      notifications.show({
        title: "Error",
        message: error.response.data.message,
        color: "red",
        icon: <IconX size="1.5rem" />,
      });
    },
  });

  return (
    <Container size={420} my={40}>
      {/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
      <Title align="center" sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}>
        Welcome!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        {"Already have an account? "}
        <Link href="/auth/login">
          <Anchor size="sm" component="button">
            Sign up
          </Anchor>
        </Link>
      </Text>

      <form
        /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
        onSubmit={handleSubmit(
          (data) => mutate(data, {}),
          (error) => {
            console.log({ error });
          }
        )}
      >
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput name="name" label="Name" control={control} placeholder="Your name" required />
          <TextInput name="email" label="Email" control={control} placeholder="you@mantine.dev" mt="md" required />
          <PasswordInput
            name="password"
            label="Password"
            control={control}
            placeholder="Your password"
            required
            mt="md"
          />
          <PasswordInput
            name="password_confirmation"
            label="Confirm password"
            control={control}
            placeholder="Your password"
            required
            mt="md"
          />
          <Button fullWidth mt="xl" type="submit" loading={isLoading} disabled={status === "authenticated"}>
            Create account
          </Button>
        </Paper>
      </form>
    </Container>
  );
}
