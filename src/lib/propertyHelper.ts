import { type Address } from "~/types";

export const priceToString = (price: number) => {
  //check if price has decimals
  if (price % 1 == 0) price = Math.floor(price);
  return price.toLocaleString("pt-PT") + " €";
};

const addressWithProps = (address: Address, addressProps: string[]) => {
  let addressStr = "";
  let needsSeparator = false;
  let lastProp = "";

  for (const prop of addressProps) {
    if (!address.hasOwnProperty(prop)) continue;
    const value = address[prop as keyof Address]?.toString();
    if (value) {
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
