import { create } from 'zustand'
import type { Coin } from '../types/Coin'
const apiKey = import.meta.env.VITE_CG_API_KEY;

interface CoinStore {
  coins: Coin[]
  loading: boolean
  loadingThreeMonthData: boolean;
  threeMonthData: { date: string; price: number }[];
  fetchCoins: () => Promise<void>
  fetchthreeMonthData: (coinId: string) => Promise<void>;
  coinData: Record<string, DataPoint[]>;
}
type DataPoint = { date: string; price: number };

export const useCoinStore = create<CoinStore>((set,get) => ({
  coins: [],
  loading: false,
  loadingThreeMonthData: false,
  threeMonthData: [],
  coinData: {},

fetchCoins: async () => {
  set({ loading: true });
  try {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': apiKey
      }
    };

    const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false`, options);
    const data = await res.json();
    set({ coins: data });
  } catch (err) {
    console.error('CoinGecko fetch failed:', err);
  } finally {
    set({ loading: false });
  }
},



fetchthreeMonthData: async (coinId: string) => {
  try {
    if (get().coinData[coinId]) return;
    set({ loadingThreeMonthData: true });

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': apiKey,
      },
    };

    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=90&interval=daily`,
      options
    );
    const data = await res.json();

    const prices = (data as { prices: [number, number][] }).prices;
    const formatted: DataPoint[] = prices.map(([timestamp, price]) => ({
      date: new Date(timestamp).toLocaleDateString("en-GB"),
      price,
    }));

    set((state) => ({
      coinData: {
        ...state.coinData,
        [coinId]: formatted,
      },
    }));
  } catch (error) {
    console.error("Error fetching price data:", error);
  } finally {
    set({ loadingThreeMonthData: false });
  }
}

  
}));



