import { UnstyledButtonProps } from "@mantine/core";
import { Session } from "next-auth";
import { ReactNode } from "react";

export type Collection = {
  id: string;
  name: string;
  description: string;
};

export type CollectionProperty = {
  id: string;
  quantity: number;
  listing_type: string;
  title: string;
  cover_url: string;
  type: string;
  typology: string;
  wc: number;
  rating: number;
  current_price_sale: number;
  current_price_rent: number;
  status: string;
};

export type Property = {
  id: string;
  quantity: number;
  listing_type: string;
  title: string;
  description: string;
  cover_url: string;
  useful_area: string;
  gross_area: string;
  type: string;
  typology: string;
  wc: number;
  rating: number;
  current_price_sale: number;
  current_price_rent: number;
  status: string;
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

export type UsePropertyProps = {
  session: Session;
  status: string;
  propertyId: string;
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
