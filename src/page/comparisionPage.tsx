"use client";

import Navbar from "@/components/navbar";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { ChartLineDefault } from "../components/lineChart";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useCoinStore } from "@/store/useCoinStore";

// Skeleton component for loading state
const TableRowSkeleton = () => (
  <TableRow>
    {[...Array(7)].map((_, i) => (
      <TableCell key={i} className="py-4 px-3 sm:px-6">
        <Skeleton className="h-4 w-full" />
      </TableCell>
    ))}
  </TableRow>
);

const Comparision: React.FC = () => {
  const { coin1Id, coin2Id } = useParams();
  const [loading, setLoading] = useState(false);

  const fetchCoins = useCoinStore((state) => state.fetchCoins);
const coinStoreCoins = useCoinStore((state) => state.coins);
  
useEffect(() => {
  if (coinStoreCoins.length === 0) {
    setLoading(true);
    fetchCoins().finally(() => setLoading(false));
  }
}, [coinStoreCoins.length, fetchCoins]);

const coin1 = useCoinStore((state) =>
  state.coins.find((coin) => coin.id === coin1Id)
);
const coin2 = useCoinStore((state) =>
  state.coins.find((coin) => coin.id === coin2Id)
);

  if (loading)
    return (
      <div className="w-full px-4">
        <Table>
          <TableBody>
            <TableRowSkeleton />
          </TableBody>
        </Table>
      </div>
    );

  if (!coin1 || !coin2)
    return (
      <p className="text-center mt-10 text-red-600 font-semibold">
        One or both coins not found.
      </p>
    );

  return (
    <>
      <div className="flex flex-col items-center w-full px-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>

      <Separator className="h-[2px] bg-border shadow-sm shadow-white/30 w-full my-4" />

      <h2 className="mt-4 text-center text-2xl sm:text-3xl font-semibold">
        Comparing {coin1.name} vs {coin2.name}
      </h2>

          <Breadcrumb className="mb-6 max-w-5xl px-6 sm: mt-5">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Markets</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{coin1.name} vs {coin2.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto mt-6 px-2 sm:px-0">
        <Table className="min-w-[700px] sm:min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-base py-4 px-3 sm:px-6">Asset</TableHead>
              <TableHead className="text-base py-4 px-3 sm:px-6">Price</TableHead>
              <TableHead className="text-base py-4 px-3 sm:px-6">24h%</TableHead>
              <TableHead className="text-base py-4 px-3 sm:px-6">Market Cap</TableHead>
              <TableHead className="text-base py-4 px-3 sm:px-6">Volume</TableHead>
              <TableHead className="text-base py-4 px-3 sm:px-6">Circulating Supply</TableHead>
              <TableHead className="text-base py-4 px-3 sm:px-6">Total Supply</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[coin1, coin2].map((coin) => (
              <TableRow key={coin.id}>
                <TableCell className="py-4 px-3 sm:px-6 flex items-center gap-2 whitespace-nowrap">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-6 h-6 rounded-full"
                    loading="lazy"
                  />
                  {coin.name}
                </TableCell>
                <TableCell className="py-4 px-3 sm:px-6">
                  ${coin.current_price.toLocaleString()}
                </TableCell>
                <TableCell
                  className={`py-4 px-3 sm:px-6 ${
                    coin.price_change_percentage_24h < 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </TableCell>
                <TableCell className="py-4 px-3 sm:px-6">
                  ${coin.market_cap.toLocaleString()}
                </TableCell>
                <TableCell className="py-4 px-3 sm:px-6">
                  ${coin.total_volume.toLocaleString()}
                </TableCell>
                <TableCell className="py-4 px-3 sm:px-6 whitespace-nowrap">
                  {coin.circulating_supply
                    ? coin.circulating_supply.toLocaleString()
                    : "N/A"}
                </TableCell>
                <TableCell className="py-4 px-3 sm:px-6 whitespace-nowrap">
                  {coin.total_supply
                    ? coin.total_supply.toLocaleString()
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

        {/* Coin Summary Sections */}
        <div className="flex flex-col sm:flex-row justify-center gap-8 mt-8 px-4 sm:px-6 lg:px-8">
          {[coin1, coin2].map((coin) => (
            <div
              key={coin.id}
              className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 w-full max-w-sm"
            >
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-12 h-12 rounded-full"
                  loading="lazy"
                />
                <h3 className="text-xl font-semibold">
                  {coin.name} ({coin.symbol.toUpperCase()})
                </h3>
              </div>
              <div className="text-center">
                
                <p className="text-2xl font-bold mb-2">
                  ${coin.current_price.toLocaleString()}
                </p>
                <p
                  className={`text-lg font-semibold ${
                    coin.price_change_percentage_24h < 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  <span className="text-gray-500 mb-1 block">Last 24h</span>
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </p>
              </div>
            </div>
          ))}
        </div>

      {/* Responsive Charts */}
      <div className="flex flex-col sm:flex-row  justify-center gap-6 mt-8 px-4 sm:px-6 lg:px-8">
        {[coin1, coin2].map((coin) => (
          <div key={coin.id} className="w-full sm:w-1/2 h-[410px]">
            <ChartLineDefault coinId={coin.id} />
          </div>
        ))}
      </div>
    </>
  );
};

export default Comparision;
