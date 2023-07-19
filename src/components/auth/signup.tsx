import { zodResolver } from "@hookform/resolvers/zod";
import { Anchor, Button, Container, Paper, Text, Title } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { PasswordInput, TextInput } from "react-hook-form-mantine";
import { z } from "zod";
import { register } from "~/lib/requestHelper";
import { type AxiosErrorResponse } from "~/types";
import { errorNotification, successNotification } from "../PropertyCard";

const schema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(128, { message: "Password exceeds maximum length of 128 characters" }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

const defaultValues: FormSchemaType = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
};

type FormSchemaType = z.infer<typeof schema>;

export function SignUpForm() {
  const router = useRouter();
  const { status } = useSession();

  const { control, handleSubmit, setError } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

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
      successNotification("You have been successfully registered!");
      void router.push("/properties");
    },
    onError: (error: AxiosErrorResponse) => {
      if (error.response?.data?.message?.toLowerCase().includes("email")) {
        setError("email", { message: error.response.data.message });
        return;
      }
      errorNotification("Check your internet connection and try again", "Something went wrong");
    },
  });

  if (status === "loading") return null;
  if (status === "authenticated") {
    void router.push("/properties");
    return null;
  }

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
            Sign in
          </Anchor>
        </Link>
      </Text>

      <form
        /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
        onSubmit={handleSubmit((data) => mutate(data))}
      >
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput name="name" label="Name" control={control} placeholder="Your name" />
          <TextInput name="email" label="Email" control={control} placeholder="Your email" mt="md" />
          <PasswordInput name="password" label="Password" control={control} placeholder="Your password" mt="md" />
          <PasswordInput
            name="password_confirmation"
            label="Confirm password"
            control={control}
            placeholder="Your password"
            mt="md"
          />
          <Button fullWidth mt="xl" type="submit" loading={isLoading}>
            Create account
          </Button>
        </Paper>
      </form>
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
