import { type UnstyledButtonProps } from "@mantine/core";
import { type AxiosError } from "axios";
import { type ReactNode } from "react";
import { type PropertiesResponse } from "./hooks/useQueries";
import { type UseQueryResult } from "@tanstack/react-query";

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
  covers: string[];
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

export type Address = {
  adm1_id: number | null | undefined;
  adm1: string | null | undefined;
  adm2_id: number | null | undefined;
  adm2: string | null | undefined;
  adm3_id: number | null | undefined;
  adm3: string | null | undefined;
  postal_code: string | null | undefined;
  full_address: string | null | undefined;
  coordinates:
    | {
        latitude: number;
        longitude: number;
      }
    | null
    | undefined;
};

type Characteristic = {
  id: number;
  name: string;
  type: "numerical" | "textual";
  value: string;
};

export type BareCharacteristic = {
  id: number;
  name: string;
  type: "numerical" | "textual";
};

export type Tag = {
  id: number;
  name: string;
};

export type TagManage = {
  id: number;
  name: string;
  num_properties: number;
};

type List = {
  id: number;
  name: string;
};

export type Media = {
  photos: { id: number; url: string }[];
  videos: { id: number; url: string }[];
  blueprints: { id: number; url: string }[];
};

type PriceHistory = {
  price: string | null;
  datetime: string;
  latest: boolean;
};

export type Offer = {
  id?: string;
  listing_type?: string;
  url: string;
  description: string;
  price_history?: PriceHistory[];
  price?: number;
};

export type Property = {
  id: string;
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
  lists: List[];
  media: Media;
  offers: {
    sale: Offer[];
    rent: Offer[];
  };
};

export type PropertyTitle = {
  id: string;
  title: string;
  collection_ids: number[];
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

export type UserButtonProps = UnstyledButtonProps & {
  image: string;
  name: string;
  icon?: React.ReactNode;
};

export type ShellProps = {
  children: ReactNode;
  useNavbarSearch?: boolean;
  search: string;
  filters: FiltersOptions;
  setSearch?: (search: string) => void;
  setFilters: (filters: FiltersOptions) => void;
};

export type FiltersOptions = {
  include_tags?: string[];
  exclude_tags?: string[];
  list?: string;
  adm?: string;
  listingPropertyFilters?: string[];
  ratingRange?: [number, number];
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  wcs?: number;
  typology?: string[];
  addressSearch?: string;
};

export type SearchPropertyProps = {
  search: string;
  filters: FiltersOptions;
  setFilters: (filters: FiltersOptions) => void;
};

export type DisplayPropertiesProps = {
  propData: PropertiesResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  activePage: number;
  setPage: (page: number) => void;
  hasFilters?: boolean;
};

export type AxiosErrorResponse = AxiosError & {
  response: {
    data: {
      errors: {
        [key: string]: string[];
      };
      message: string;
    };
  };
};
