import { create } from "zustand";
import { type Offer } from "~/types";
import { sortBy } from "remeda";

interface OfferState {
  offers: Offer[];
  addOffer: (offer: Offer) => void;
  removeOffer: (offer: Offer) => void;
  removeOffers: (offers: Offer[]) => void;
  clearOffers: () => void;
  setOffers: (offers: Offer[]) => void;
}

const useOffersStore = create<OfferState>((set) => ({
  offers: [] as Offer[],
  addOffer: (offer: Offer) => set((state) => ({ offers: [...state.offers, offer] })),
  removeOffer: (offer: Offer) =>
    set((state) => ({
      offers: state.offers.filter((o) => o.id !== offer.id),
    })),
  removeOffers: (offers: Offer[]) =>
    set((state) => ({
      offers: state.offers.filter((o) => !offers.some((s) => s.id === o.id)),
    })),
  clearOffers: () => set({ offers: [] }),
  setOffers: (offers: Offer[]) => set({ offers }),
}));

export default useOffersStore;
