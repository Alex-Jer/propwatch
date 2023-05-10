import { type UnstyledButtonProps } from "@mantine/core";
import { type ReactNode } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  photo_url: string;
  blocked: boolean;
};

export type Collection = {
  id: string;
  name: string;
  description: string;
  num_properties: number;
};

export type CollectionWithProperties = {
  id: string;
  name: string;
  description: string;
  num_properties: number;
  properties: CollectionProperties;
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

export type Links = {
  first: string;
  last: string;
  prev: string;
  next: string;
};

export type Link = {
  active: boolean;
  label: string;
  url: string;
};

export type Meta = {
  current_page: number;
  from: number;
  last_page: number;
  links: Link[];
  path: string;
  per_page: number;
  to: number;
  total: number;
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

export type CollectionProperties = {
  data: CollectionProperty[];
  meta: Meta;
  links: Links;
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
