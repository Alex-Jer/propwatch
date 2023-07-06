import { create } from "zustand";
import { type Offer } from "~/types";
import { sortBy } from "remeda";
import { type DataTableSortStatus } from "mantine-datatable";

interface OfferState {
  offers: Offer[];
  totalOffers: number;
  addOffer: (offer: Offer) => void;
  removeOffer: (offer: Offer) => void;
  removeOffers: (offers: Offer[]) => void;
  clearOffers: () => void;
  sortOffers: (offers: Offer[], sortStatus: DataTableSortStatus) => void;
}

const useOffersStore = create<OfferState>((set) => ({
  offers: [] as Offer[],
  totalOffers: 0,
  addOffer: (offer: Offer) =>
    set((state) => ({ offers: [...state.offers, offer], totalOffers: state.totalOffers + 1 })),
  removeOffer: (offer: Offer) =>
    set((state) => ({
      offers: state.offers.filter((o) => o.id !== offer.id),
      totalOffers: state.totalOffers - 1,
    })),
  removeOffers: (offers: Offer[]) =>
    set((state) => ({
      offers: state.offers.filter((o) => !offers.some((s) => s.id === o.id)),
      totalOffers: state.totalOffers - offers.length,
    })),
  clearOffers: () => set({ offers: [], totalOffers: 0 }),
  sortOffers: (offers: Offer[], sortStatus: DataTableSortStatus) => {
    // @ts-expect-error sortBy is not typed
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const sortedOffers = sortBy(offers, (offer) => offer[sortStatus.columnAccessor]);
    const sortedData = sortStatus.direction === "asc" ? sortedOffers : [...sortedOffers].reverse();
    set({ offers: sortedData });
  },
}));

export default useOffersStore;
