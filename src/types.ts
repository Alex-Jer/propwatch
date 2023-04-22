import { UnstyledButtonProps } from "@mantine/core";
import { Session } from "next-auth";
import { ReactNode } from "react";

export type Collection = {
  id: string;
  name: string;
  description: string;
};

export type UseCollectionsProps = {
  session: Session;
  status: string;
};

export type UseCollectionProps = {
  session: Session;
  status: string;
  collectionId: string;
};

export type ShellProps = {
  children: ReactNode;
};

export type HeaderActionProps = {
  links: { link: string; label: string /* links: { link: string; label: string }[] */ }[];
};

export type UserButtonProps = UnstyledButtonProps & {
  image: string;
  name: string;
  icon?: React.ReactNode;
};
