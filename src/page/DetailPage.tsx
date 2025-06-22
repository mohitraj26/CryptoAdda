import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import type { Coin } from "../types/Coin";
import Navbar from "../components/navbar"
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChartAreaInteractive } from "../components/lineChart";

const CoinDetail: React.FC = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState<Coin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const res = await axiosInstance.get(`/coins/markets?vs_currency=usd&ids=${id}`, {
          params: {
            localization: false,
            tickers: false,
            market_data: true,
            community_data: false,
            developer_data: false,
            sparkline: false,
          },
        });
        setCoin(res.data[0]);
        console.log(res.data);
      } catch (err) {
        console.error("Failed to fetch coin:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoin();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!coin) return <p>Coin not found.</p>;

  return (
    <>
    <Navbar />

    <Separator className="h-[2px] bg-border shadow-sm shadow-white/30 w-full" />


    <div className="max-w-5xl mx-auto px-6 py-8">
        <Breadcrumb className="mb-6">
            <BreadcrumbList>
                <BreadcrumbItem>
                <BreadcrumbLink href="/">Markets</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                <BreadcrumbPage>{coin.name}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

      <div className="flex items-center gap-4 mb-6">
        <img src={coin.image} alt={coin.name} className="w-10 h-10" />
        <h1 className="text-2xl font-semibold">{coin.name} ({coin.symbol.toUpperCase()})</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border shadow-sm">
          <h2 className="text-sm text-muted-foreground">Current Price</h2>
          <p className="text-xl font-bold">${coin.current_price.toLocaleString()}</p>
        </div>

        <div className="p-4 rounded-xl border shadow-sm">
          <h2 className="text-sm text-muted-foreground">Market Cap</h2>
          <p className="text-xl font-bold">${coin.market_cap.toLocaleString()}</p>
        </div>

        <div className="p-4 rounded-xl border shadow-sm">
          <h2 className="text-sm text-muted-foreground">24h High</h2>
          <p className="text-xl font-bold">${coin.high_24h.toLocaleString()}</p>
        </div>

        <div className="p-4 rounded-xl border shadow-sm">
          <h2 className="text-sm text-muted-foreground">24h Low</h2>
          <p className="text-xl font-bold">${coin.low_24h.toLocaleString()}</p>
        </div>
      </div>

            <div className="px-4 lg:px-6">
                <ChartAreaInteractive coinId={coin.id}/>
              </div>
      
    </div>
    </>
  );
};

export default CoinDetail;
