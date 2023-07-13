import { UnstyledButton, Group, Avatar, Text, createStyles, Menu } from "@mantine/core";
import { IconDeviceAnalytics } from "@tabler/icons-react";
import { IconAdjustmentsAlt, IconChevronRight, IconLogout, IconUserCircle } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
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
    await signOut({ redirect: false });
    await logout(session.user.access_token);
    await router.push("/auth/login");
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
          <Menu.Label>Settings</Menu.Label>
          <Link href="/manage">
            <Menu.Item icon={<IconAdjustmentsAlt size="1rem" stroke={1.5} />}>Control Panel</Menu.Item>
          </Link>
          <Menu.Label>Statistics</Menu.Label>
          <Link href="/statistics">
            <Menu.Item icon={<IconDeviceAnalytics size="1rem" stroke={1.5} />}>Statistics</Menu.Item>
          </Link>
          <Menu.Label>Account</Menu.Label>
          <Link href="/profile">
            <Menu.Item icon={<IconUserCircle size="1rem" stroke={1.5} />}>Profile</Menu.Item>
          </Link>
          <Menu.Item icon={<IconLogout size="1rem" stroke={1.5} />} onClick={() => void handleLogout()}>
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
