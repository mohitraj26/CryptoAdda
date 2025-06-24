"use client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import type { detailCoin } from "../types/detailCoin";
import Navbar from "../components/navbar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChartAreaInteractive } from "../components/lineChart";
import { Badge } from "@/components/ui/badge";


function RankBadge({ rank }: { rank: number }) {
  return (
    <Badge
      variant="secondary"
      className="text-sm px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-yellow-900 shadow dark:from-yellow-300 dark:via-yellow-400 dark:to-yellow-500 dark:text-yellow-900"
    >
      Rank #{rank}
    </Badge>
  );
}

const CoinDetail: React.FC = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState<detailCoin | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);


    // Check if coin is already bookmarked
  useEffect(() => {
    const stored = localStorage.getItem("bookmarkedCoins");
    if (stored) {
      const bookmarks: string[] = JSON.parse(stored);
      setBookmarked(bookmarks.includes(id!));
    }
  }, [id]);

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const res = await axiosInstance.get(`/coins/${id}`, {
          params: {
            localization: false,
            tickers: false,
            market_data: true,
            community_data: false,
            developer_data: false,
            sparkline: false,
          },
        });
        setCoin(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Failed to fetch coin:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoin();
  }, [id]);



  const toggleBookmark = () => {
    const stored = localStorage.getItem("bookmarkedCoins");
    const bookmarks: string[] = stored ? JSON.parse(stored) : [];

    let updated: string[];
    if (bookmarks.includes(id!)) {
      updated = bookmarks.filter((coinId) => coinId !== id);
      setBookmarked(false);
    } else {
      updated = [...bookmarks, id!];
      setBookmarked(true);
    }

    localStorage.setItem("bookmarkedCoins", JSON.stringify(updated));
  };

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

        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <img src={coin.image.large} alt={coin.name} className="w-10 h-10" />
            <h1 className="text-2xl font-semibold">
              {coin.name} ({coin.symbol.toUpperCase()})
            </h1>
          </div>
          <Button
            variant={bookmarked ? "secondary" : "outline"}
            className={`
            transition-colors duration-200
            ${
              bookmarked
                ? "bg-yellow-200 text-yellow-900 dark:bg-yellow-400 dark:text-yellow-900"
                : ""
            }
            border-yellow-400
            hover:bg-yellow-100 hover:text-yellow-900 dark:hover:bg-yellow-300
            font-semibold rounded-lg px-6 py-2
          `}
            onClick={toggleBookmark}
            aria-pressed={bookmarked}
            aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            {bookmarked ? "Bookmarked" : "Bookmark"}
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>

          <p className="mb-2 text-gray-500">7D</p>
          <p className="text-xl font-bold mb-2">
            ${coin.market_data.current_price.usd.toLocaleString()}
          </p>
          <div className="flex  items-center gap-2">
            <p className="text-sm text-gray-500">Last 7 Days</p>
            <p
              className={`text-base  ${
                coin.market_data.price_change_percentage_7d < 0
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {coin.market_data.price_change_percentage_7d}
            </p>
          </div>
          </div>

          <RankBadge rank={coin.market_cap_rank} />



        </div>

        <div className="px-4 lg:px-6 mt-10">
          <ChartAreaInteractive coinId={coin.id} />
        </div>

        {/* stats */}

        <h1 className="text-2xl font-semibold mt-10">Bitcoin Stats</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">

          <div className="p-4 rounded-xl border shadow-sm">
            <h2 className="text-sm text-muted-foreground">Market Cap</h2>
            <p className="text-xl font-bold">
              ${coin.market_data.market_cap.usd.toLocaleString()}
            </p>
          </div>

          <div className="p-4 rounded-xl border shadow-sm">
            <h2 className="text-sm text-muted-foreground">Total Volume</h2>
            <p className="text-xl font-bold">
              ${coin.market_data.total_volume.usd.toLocaleString()}
            </p>
          </div>

          <div className="p-4 rounded-xl border shadow-sm">
            <h2 className="text-sm text-muted-foreground">Total Supply</h2>
            <p className="text-xl font-bold">
              ${coin.market_data.total_supply.toLocaleString()}
            </p>
          </div>

          <div className="p-4 rounded-xl border shadow-sm">
            <h2 className="text-sm text-muted-foreground">Circulating Supply</h2>
            <p className="text-xl font-bold">
              ${coin.market_data.circulating_supply.toLocaleString()}
            </p>
          </div>

          <div className="p-4 rounded-xl border shadow-sm">
            <h2 className="text-sm text-muted-foreground">Max Supply</h2>
            <p className="text-xl font-bold">
              ${coin.market_data.max_supply?.toLocaleString()}
            </p>
          </div>

          <div className="p-4 rounded-xl border shadow-sm">
            <h2 className="text-sm text-muted-foreground">Fully Diluted Valuation</h2>
            <p className="text-xl font-bold">
              ${coin.market_data.fully_diluted_valuation.usd.toLocaleString()}
            </p>
          </div>

          <div className="p-4 rounded-xl border shadow-sm">
            <h2 className="text-sm text-muted-foreground">All-Time High</h2>
            <p className="text-xl font-bold">
              ${coin.market_data.ath.usd.toLocaleString()}
            </p>
              <p className="text-sm text-gray-400">{coin.market_data.ath_date.usd.split("T")[0]}</p>
          </div>

          <div className="p-4 rounded-xl border shadow-sm">
            <h2 className="text-sm text-muted-foreground">All-Time Low</h2>
            <p className="text-xl font-bold">
              ${coin.market_data.atl.usd.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">{coin.market_data.atl_date.usd.split("T")[0]}</p>
          </div>

        </div>
      </div>
    </>
  );
};

export default CoinDetail;
