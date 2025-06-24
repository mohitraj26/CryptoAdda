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
import { axiosInstance } from "../lib/axios";
import { ChartLineDefault } from "@/components/graph";
import { Separator } from "@radix-ui/react-dropdown-menu";

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
  const [coin1, setCoin1] = useState<any>(null);
  const [coin2, setCoin2] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const [res1, res2] = await Promise.all([
          axiosInstance.get(`/coins/${coin1Id}`, {
            params: {
              localization: false,
              tickers: false,
              market_data: true,
              community_data: false,
              developer_data: false,
              sparkline: false,
            },
          }),
          axiosInstance.get(`/coins/${coin2Id}`, {
            params: {
              localization: false,
              tickers: false,
              market_data: true,
              community_data: false,
              developer_data: false,
              sparkline: false,
            },
          }),
        ]);
        setCoin1(res1.data);
        setCoin2(res2.data);
      } catch (err) {
        console.error("Failed to fetch coin data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [coin1Id, coin2Id]);

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

          <Breadcrumb className="mb-6 max-w-5xl px-6">
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
                    src={coin.image.small}
                    alt={coin.name}
                    className="w-6 h-6 rounded-full"
                    loading="lazy"
                  />
                  {coin.name}
                </TableCell>
                <TableCell className="py-4 px-3 sm:px-6">
                  ${coin.market_data.current_price.usd.toLocaleString()}
                </TableCell>
                <TableCell
                  className={`py-4 px-3 sm:px-6 ${
                    coin.market_data.price_change_percentage_24h < 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {coin.market_data.price_change_percentage_24h.toFixed(2)}%
                </TableCell>
                <TableCell className="py-4 px-3 sm:px-6">
                  ${coin.market_data.market_cap.usd.toLocaleString()}
                </TableCell>
                <TableCell className="py-4 px-3 sm:px-6">
                  ${coin.market_data.total_volume.usd.toLocaleString()}
                </TableCell>
                <TableCell className="py-4 px-3 sm:px-6 whitespace-nowrap">
                  {coin.market_data.circulating_supply
                    ? coin.market_data.circulating_supply.toLocaleString()
                    : "N/A"}
                </TableCell>
                <TableCell className="py-4 px-3 sm:px-6 whitespace-nowrap">
                  {coin.market_data.total_supply
                    ? coin.market_data.total_supply.toLocaleString()
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
                  src={coin.image.large}
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
                  ${coin.market_data.current_price.usd.toLocaleString()}
                </p>
                <p
                  className={`text-lg font-semibold ${
                    coin.market_data.price_change_percentage_7d < 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  <span className="text-gray-500 mb-1 block">Past 7 Days</span>
                  {coin.market_data.price_change_percentage_7d.toFixed(2)}%
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
