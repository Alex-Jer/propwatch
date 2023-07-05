import { type UnstyledButtonProps } from "@mantine/core";
import { type ReactNode } from "react";
import { type PropertiesResponse } from "./hooks/useQueries";

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
  tags: string[];
};

export type CollectionWithProperties = {
  id: string;
  name: string;
  description: string;
  num_properties: number;
  properties: CollectionProperties;
};

export type SelectOption = {
  value: string;
  label: string;
};

type Address = {
  adm1_id: number;
  adm1: string;
  adm2_id: number;
  adm2: string;
  adm3_id: number;
  adm3: string;
  full_address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

type Characteristic = {
  name: string;
  type: string;
  value: string;
};

export type Tag = {
  id: number;
  name: string;
};

type Media = {
  photos: { url: string }[];
  videos: { url: string }[];
  blueprints: { url: string }[];
};

type PriceHistory = {
  price: string | null;
  datetime: string;
  latest: boolean;
};

export type Offer = {
  id?: number;
  listing_type?: string;
  url: string;
  description: string;
  price_history?: PriceHistory[];
  price?: number;
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
  address: Address;
  characteristics: Characteristic[];
  tags: Tag[];
  media: Media;
  offers: {
    sale: Offer[];
    rent: Offer[];
  };
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

export type AdministrativeDivision = {
  id: number;
  name: string;
  level: number;
  parent_id: number;
};

export type ShellProps = {
  children: ReactNode;
  useNavbarSearch?: boolean;
  search: SearchOptions;
  setSearch: (search: SearchOptions) => void;
};

export type UserButtonProps = UnstyledButtonProps & {
  image: string;
  name: string;
  icon?: React.ReactNode;
};

export type SearchOptions = {
  query?: string;
  include_tags?: string[];
  exclude_tags?: string[];
  list?: string;
  adm?: string;
};

export type SearchPropertyProps = {
  search: SearchOptions;
  setSearch: (search: SearchOptions) => void;
};

export type DisplayPropertiesProps = {
  propData: PropertiesResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  activePage: number;
  setPage: (page: number) => void;
};
