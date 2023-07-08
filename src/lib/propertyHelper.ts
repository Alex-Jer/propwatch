export const priceToString = (price: number) => {
  //check if price has decimals
  if (price % 1 == 0) price = Math.floor(price);
  return price.toLocaleString("pt-PT") + " €";
};
