import { UnstyledButton, Group, Avatar, Text, createStyles, Menu } from "@mantine/core";
import { IconChevronRight, IconLogout } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { logout } from "~/lib/requestHelper";
import { type UserButtonProps } from "~/types";

const useStyles = createStyles((theme) => ({
  user: {
    display: "block",
    width: "100%",
    padding: theme.spacing.md,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

    "&:hover": {
      backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
    },
  },
}));

export function UserButton({ image, name, icon, ...others }: UserButtonProps) {
  const { classes } = useStyles();
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    if (!session) return;
    await router.push("/");
    await signOut({ redirect: false });
    await logout(session.user.access_token);
  };

  return (
    <Group position="center">
      <Menu withArrow width={280} position="bottom" transitionProps={{ transition: "pop" }} withinPortal>
        <Menu.Target>
          <UnstyledButton className={classes.user} {...others}>
            <Group>
              <Avatar src={image} size="sm" radius="xl" />

              <div style={{ flex: 1 }}>
                <Text size="sm" weight={500}>
                  {name}
                </Text>
              </div>

              {icon || <IconChevronRight size="0.9rem" stroke={1.5} />}
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Account</Menu.Label>
          <Menu.Item icon={<IconLogout size="0.9rem" stroke={1.5} />} onClick={() => void handleLogout()}>
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
