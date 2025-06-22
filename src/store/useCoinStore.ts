import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import type { Coin } from '../types/Coin'

interface CoinStore {
  coins: Coin[]
  loading: boolean
  threeMonthData: { date: string; price: number }[];
  fetchCoins: () => Promise<void>
  fetchthreeMonthData: (coinId: string) => Promise<void>;
}

export const useCoinStore = create<CoinStore>((set) => ({
  coins: [],
  loading: false,
  threeMonthData: [],

  fetchCoins: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get<Coin[]>('/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 250,
          page: 1,
          sparkline: false,
        },
      });
      set({ coins: res.data });
    } catch (err) {
      console.error('CoinGecko fetch failed:', err);
    } finally {
      set({ loading: false });
    }
  },


fetchthreeMonthData: async (coinId: string) => {
  try {
    const response = await axiosInstance.get(`/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: "usd",
        days: 90,
        interval: "daily",
      },
    });

    const formatted = response.data.prices.map(
      ([timestamp, price]: [number, number]) => ({
        date: new Date(timestamp).toLocaleDateString(),
        price,
      })
    );

    set({ threeMonthData: formatted });
  } catch (error) {
    console.error("Error fetching price data:", error);
  }
}

  
}));



