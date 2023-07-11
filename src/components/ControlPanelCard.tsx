import { Card, Group, Button, Text } from "@mantine/core";
import { useRouter } from "next/router";

type ControlPanelCardProps = {
  href: string;
  title: string;
  description: string;
  icon: React.ElementType;
  buttonLabel?: string;
};

export function ControlPanelCard({ href, title, description, buttonLabel = title, icon: Icon }: ControlPanelCardProps) {
  const router = useRouter();
  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section
          component="a"
          href={href}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            minHeight: "160px",
          }}
        >
          <Icon size="5.5rem" />
        </Card.Section>

        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>{title}</Text>
        </Group>

        <Group>
          <Text size="sm" color="dimmed">
            {description}
          </Text>
        </Group>

        <Button variant="light" color="blue" fullWidth mt="md" radius="md" onClick={() => void router.push(href)}>
          {buttonLabel}
        </Button>
      </Card>
    </>
  );
}
