import { zodResolver } from "@hookform/resolvers/zod";
import { createStyles, rem, Paper, Text, Button } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { PasswordInput, TextInput } from "react-hook-form-mantine";
import { z } from "zod";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";
import { useState } from "react";
import { makeRequest, processAxiosError } from "~/lib/requestHelper";
import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { type AxiosErrorResponse, type User } from "~/types";

registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginImageCrop,
  FilePondPluginImageResize,
  FilePondPluginImageTransform
);

type UserResponse = {
  message: string;
  user: User;
};

type PasswordResponse = {
  message: string;
  access_token: string;
};

const editSchema = z.object({
  name: z.string().nonempty({ message: "A name is required" }),
  email: z.string().email().nonempty({ message: "An email is required" }),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type EditFormSchemaType = z.infer<typeof editSchema>;
type ChangePasswordFormSchemaType = z.infer<typeof changePasswordSchema>;

const defaultChangePasswordValues: ChangePasswordFormSchemaType = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const Profile = () => {
  const { classes } = useStyles();
  const { data: session, update } = useSession();

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [avatar, setAvatar] = useState<any[]>([]);

  const defaultEditValues: EditFormSchemaType = {
    name: session?.user.name ?? "",
    email: session?.user.email ?? "",
  };

  const {
    control: editControl,
    handleSubmit: handleEditSubmit,
    setError: setEditError,
  } = useForm<EditFormSchemaType>({
    resolver: zodResolver(editSchema),
    defaultValues: defaultEditValues,
  });

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
  } = useForm<ChangePasswordFormSchemaType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: defaultChangePasswordValues,
  });

  const editProfile = async (data: EditFormSchemaType) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("email_confirmation", data.email);
    if (avatar.length > 0) {
      formData.append("photo", avatar[0]);
    }

    return await makeRequest("me", "PUT", session?.user.access_token, formData, true, false);
  };

  const { mutate: mutateEdit } = useMutation({
    mutationFn: editProfile,
    onSuccess: async (res: UserResponse) => {
      if (session) {
        session.user.name = res.user.name;
        session.user.email = res.user.email;
        session.user.photo_url = res.user.photo_url;
      }

      await update({ ...session });

      notifications.show({
        title: "Profile updated",
        message: "Your profile has been updated",
        color: "teal",
        icon: <IconCheck size="1.5rem" />,
        autoClose: 10000,
      });
    },
    onError: (error: AxiosErrorResponse) => {
      if (error.response?.data?.message?.includes("email")) {
        console.log({ error });
        setEditError("email", {
          type: "custom",
          message: error.response.data.message,
        });
        return;
      }
      processAxiosError(error, "An error occurred while updating your profile");
    },
  });

  const changePassword = async (data: ChangePasswordFormSchemaType) => {
    const formData = new FormData();

    formData.append("old_password", data.currentPassword);
    formData.append("new_password", data.newPassword);
    formData.append("new_password_confirmation", data.confirmPassword);

    return await makeRequest("me/password", "PATCH", session?.user.access_token, formData, false, false);
  };

  const { mutate: mutatePassword } = useMutation({
    mutationFn: changePassword,
    onSuccess: async (res: PasswordResponse) => {
      if (session) {
        session.user.access_token = res.access_token;
      }

      await update({ ...session });
      resetPasswordForm();

      notifications.show({
        title: "Password updated",
        message: "Your password has been updated",
        color: "teal",
        icon: <IconCheck size="1.5rem" />,
        autoClose: 10000,
      });
    },
    onError: (error: AxiosErrorResponse) => {
      processAxiosError(error, "An error occurred while updating your password");
    },
  });

  return (
    <Paper className={`${classes.paper} xl:mx-12 2xl:mx-60`} p="md">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Paper shadow="xs" p="md" withBorder className="col-span-2">
          <div className="grid grid-cols-2">
            <div className="col-span-1">
              <form
                /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
                onSubmit={handleEditSubmit(
                  (data) => mutateEdit(data),
                  (error) => {
                    console.log({ error });
                  }
                )}
              >
                <div className="space-y-2">
                  <Text size="xl" weight={500}>
                    Edit Profile
                  </Text>
                  <TextInput label="Name" name="name" control={editControl} withAsterisk />
                  <TextInput label="Email" name="email" control={editControl} withAsterisk />
                </div>
                <Button type="submit" className="mt-4">
                  Save
                </Button>
              </form>
            </div>

            <div className="col-span-1">
              <div className="flex h-full flex-col justify-center">
                <div className="mx-auto h-48 w-48">
                  <FilePond
                    className={classes.filePond}
                    files={avatar}
                    onupdatefiles={(fileItems) => {
                      setAvatar(fileItems.map((fileItem) => fileItem.file));
                    }}
                    acceptedFileTypes={["image/*"]}
                    labelIdle='Drag & Drop your picture or <span class="filepond--label-action">Browse</span>'
                    imagePreviewHeight={170}
                    imageCropAspectRatio="1:1"
                    imageResizeTargetWidth={200}
                    imageResizeTargetHeight={200}
                    stylePanelLayout="compact circle"
                    styleLoadIndicatorPosition="center bottom"
                    styleButtonRemoveItemPosition="center bottom"
                  />
                </div>
              </div>
            </div>
          </div>
        </Paper>
        <div>
          <Paper shadow="xs" p="md" withBorder>
            <form
              /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
              onSubmit={handlePasswordSubmit(
                (data) => mutatePassword(data),
                (error) => {
                  console.log({ error });
                }
              )}
            >
              <div className="space-y-2">
                <Text size="xl" weight={500} pb={6}>
                  Change Password
                </Text>
                <PasswordInput label="Current password" name="currentPassword" control={passwordControl} withAsterisk />
                <PasswordInput label="New Password" name="newPassword" control={passwordControl} withAsterisk />
                <PasswordInput
                  label="Confirm New Password"
                  name="confirmPassword"
                  control={passwordControl}
                  withAsterisk
                />
              </div>
              <Button type="submit" className="mt-4">
                Save
              </Button>
            </form>
          </Paper>
        </div>
      </div>
    </Paper>
  );
};

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: rem(80),
    paddingBottom: rem(80),
  },

  paper: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
  },

  filePond: {
    "& .filepond--drop-label": {
      color: theme.colors.dark[0],

      "& .filepond--label-action": {
        "&:hover": {
          textDecoration: "underline",
        },
      },
    },

    "& .filepond--panel-root": {
      backgroundColor: theme.colors.dark[5],
      width: "200px",
      margin: "0 auto",
    },

    "& .filepond--drip-blob": {
      backgroundColor: theme.colors.dark[1],
    },

    "& .filepond--item-panel": {
      backgroundColor: theme.colors.dark[4],
    },

    "& .filepond--credits": {
      color: theme.colors.gray[0],
    },
  },
}));

export default Profile;
