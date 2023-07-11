import type { Property, Address } from "~/types";
import seedrandom from "seedrandom";
import { cloneElement, ReactElement } from "react";

export const priceToString = (price: number) => {
  // check if price is a decimal number
  if (price % 1 == 0) price = Math.floor(price);
  return price.toLocaleString("pt-PT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: price % 1 == 0 ? 0 : 2,
  });
};

export const priceToStringShort = (price: number) => {
  // check if price is a decimal number
  if (price % 1 == 0) price = Math.floor(price);
  let short = "";
  if (price >= 1000000) {
    price = price / 1000000;
    short = "M";
  } else if (price > 9999) {
    price = price / 1000;
    short = "K";
  }
  if (short != "") price = Math.round(price);
  return price
    .toLocaleString("pt-PT", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    })
    .replaceAll(/.€/g, short + " €");
};

export const numberToString = (number: number) => {
  if (number % 1 == 0) number = Math.floor(number);
  return number.toLocaleString("pt-PT");
};

const addressWithProps = (address: Address, addressProps: string[]) => {
  let addressStr = "";
  let needsSeparator = false;
  let lastProp = "";

  for (const prop of addressProps) {
    if (!address.hasOwnProperty(prop)) continue;
    const value = address[prop as keyof Address]?.toString();
    if (value?.trim()) {
      if (lastProp == value) continue;
      addressStr += (needsSeparator ? ", " : "") + value;
      needsSeparator = true;
      lastProp = value;
    }
  }

  return addressStr;
};
export const completeAddress = (address: Address) => {
  return addressWithProps(address, ["full_address", "postal_code", "adm3", "adm2", "adm1"]);
};

export const completeAdmAddress = (address: Address) => {
  return addressWithProps(address, ["adm3", "adm2", "adm1"]);
};

export const ucfirst = (string: string) => {
  if (!string) return "";
  return string.length > 1 ? string.charAt(0).toUpperCase() + string.slice(1) : string.toUpperCase();
};

export const propertyDetailsResume = (property: Property) => {
  const _sep = " | ";

  let detailsStr = "";

  if (property.type) detailsStr += ucfirst(property.type) + _sep;
  if (property.typology) detailsStr += property.typology + _sep; // The "T" comes from the database!!
  if (property.wc) detailsStr += property.wc.toString() + " bathroom" + (property.wc > 1 ? "s" : "") + _sep;
  // Areas
  if (property.gross_area) detailsStr += numberToString(parseInt(property.gross_area)) + " m²" + _sep;
  else if (property.useful_area) detailsStr += numberToString(parseInt(property.useful_area)) + " m²" + _sep;

  if (detailsStr.endsWith(_sep)) detailsStr = detailsStr.slice(0, -_sep.length);

  return detailsStr;
};

export function getRandomHexColor(seed: string) {
  // Generate a random number between 0 and 16777215 (FFFFFF in hexadecimal)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  let randomColor = Math.floor(seedrandom(seed)() * 16777215).toString(16);

  // Prepend zeros to the color code if necessary
  while (randomColor.length < 6) {
    randomColor = "0" + randomColor;
  }

  // Return the random color in hexadecimal format
  return "#" + randomColor;
}

export const generateLoadingElements = (count: number, component: ReactElement) => {
  const loadingElements = [];
  for (let i = 0; i < count; i++) {
    loadingElements.push(cloneElement(component, { key: i }));
  }

  return loadingElements;
};
