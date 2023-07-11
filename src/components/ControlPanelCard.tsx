import { Card, Group, Text, Badge } from "@mantine/core";

type ControlPanelCardProps = {
  title: string;
  description: string;
  icon: React.ElementType;
  buttonLabel?: string;
  badges: string[];
};

const badgeColor = (badge: string) => {
  switch (badge) {
    case "view":
      return "blue";
    case "edit":
      return "yellow";
    case "delete":
      return "red";
    case "list":
      return "dark";
    case "create":
      return "teal";
  }
};

const badgeVariant = (/*badge: string*/) => "light";

export function ControlPanelCard({ title, description, icon: Icon, badges }: ControlPanelCardProps) {
  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            minHeight: "160px",
          }}
        >
          <Icon size="4.5rem" />
        </Card.Section>

        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>{title}</Text>
        </Group>

        <Group>
          <Text size="sm" color="dimmed">
            {description}
          </Text>
        </Group>

        <Group position="left" mt="xs" className="-mb-2">
          {badges.map((badge) => (
            <Badge className="-mr-2" key={badge} color={badgeColor(badge)} variant={badgeVariant()}>
              {badge}
            </Badge>
          ))}
        </Group>
      </Card>
    </>
  );
}
