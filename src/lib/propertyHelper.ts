import type { Property, Address } from "~/types";

export const priceToString = (price: number) => {
  // check if price is a decimal number
  if (price % 1 == 0) price = Math.floor(price);
  return price.toLocaleString("pt-PT", { style: "currency", currency: "EUR" });
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

export const propertyDetailsResume = (property: Property) => {
  const _sep = " ; ";

  let detailsStr = "";

  if (property.type) detailsStr += property.type + _sep;
  if (property.typology) detailsStr += property.typology + _sep; // The "T" comes from the database!!
  if (property.wc) detailsStr += property.wc.toString() + " bathroom" + (property.wc > 1 ? "s" : "") + _sep;
  if (property.gross_area) detailsStr += numberToString(property.gross_area) + " m²" + _sep;

  if (detailsStr.endsWith(_sep)) detailsStr = detailsStr.slice(0, -_sep.length);

  return detailsStr;
};
