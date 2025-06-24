import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCoinStore } from "../store/useCoinStore";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";


const ITEMS_PER_PAGE = 7;


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


// Skeleton component for loading state
const TableRowSkeleton = () => (
  <TableRow>
    <TableCell className="py-4 px-6">
      <Skeleton className="h-4 w-8" />
    </TableCell>
    <TableCell className="py-4 px-6">
      <div className="flex items-center gap-2">
        <Skeleton className="w-6 h-6 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    </TableCell>
    <TableCell className="py-4 px-6">
      <Skeleton className="h-4 w-20" />
    </TableCell>
    <TableCell className="py-4 px-6">
      <Skeleton className="h-4 w-16" />
    </TableCell>
    <TableCell className="py-4 px-6">
      <Skeleton className="h-4 w-28" />
    </TableCell>
    <TableCell className="py-4 px-6">
      <Skeleton className="h-4 w-20" />
    </TableCell>
  </TableRow>
);



const CoinTable: React.FC = () => {
  const { coins, loading, fetchCoins } = useCoinStore();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [coin1, setCoin1] = useState("");;
  const [coin2, setCoin2] = useState("");;



  const toggleBookmark = (id : string) => {
  setBookmarkedIds((prev) => {
    const updated = new Set(prev);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    return updated;
  });
};

type Coin = {
  id: string;
  name: string;
};

type CoinSelectProps = {
  coins: Coin[];
  value: string;
  onChange: (value: string) => void;
};
const CoinSelect = ({ coins, value, onChange }: CoinSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Select a coin" />
      </SelectTrigger>
      <SelectContent>
        {coins.map((coin) => (
          <SelectItem key={coin.id} value={coin.id}>
            {coin.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};


  useEffect(() => {
    fetchCoins(); // Fetch once on mount
  }, []);

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCoins.length / ITEMS_PER_PAGE);
  const paginatedCoins = filteredCoins.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <>
      {/* Search bar */}
      <div className="w-full max-w-5xl relative mb-5 flex gap-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search coins"
          className="pl-10"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1); // reset to page 1 on search
          }}
          disabled={loading}
        />

        <Dialog>
            <DialogTrigger asChild>
            <Button variant="default">Comparison</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Compare your favorite coins side by side!</DialogTitle>
              <DialogDescription>
                  Dive into the key differences between your selected cryptocurrencies — from their purpose and technology to their unique features.
              </DialogDescription>
            </DialogHeader>
<div className="flex flex-col items-center">
  <div className="flex flex-col justify-center items-center gap-4 mt-4">
    <CoinSelect
      coins={coins.filter((coin) => coin.id !== coin2)} // exclude coin2
      value={coin1}
      onChange={(value) => setCoin1(value)}
    />
    <CoinSelect
      coins={coins.filter((coin) => coin.id !== coin1)} // exclude coin1
      value={coin2}
      onChange={(value) => setCoin2(value)}
    />
  </div>

  {coin1 && coin2 ? (
    <Link to={`/compare/${coin1}/${coin2}`}>
      <Button className="mt-4 w-fit">Compare</Button>
    </Link>
  ) : (
    <Button className="mt-4 w-fit" disabled>
      Select both coins to compare
    </Button>
  )}
</div>

          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-base py-4 px-6">#</TableHead>
            <TableHead className="text-base py-4 px-6">Coin</TableHead>
            <TableHead className="text-base py-4 px-6">Price</TableHead>
            <TableHead className="text-base py-4 px-6">24h%</TableHead>
            <TableHead className="text-base py-4 px-6">Market Cap</TableHead>
            <TableHead className="text-base py-4 px-6"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            // Show skeleton rows while loading
            <>
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                <TableRowSkeleton key={index} />
              ))}
            </>
          ) : paginatedCoins.length > 0 ? (
            paginatedCoins.map((coin, index) => (
              <TableRow key={coin.id}>
                <TableCell className="font-medium text-base py-4 px-6">
                  {(page - 1) * ITEMS_PER_PAGE + index + 1}
                </TableCell>
                <TableCell className="flex items-center gap-2 text-base py-4 px-6">
                  <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                  <Link to={`/coin/${coin.id}`}>
                  {coin.name}
                  </Link>
                </TableCell>
                <TableCell className="text-base py-4 px-6">
                  ${coin.current_price.toLocaleString()}
                </TableCell>
                <TableCell
                  className={`text-base py-4 px-6 ${
                    coin.price_change_percentage_24h < 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </TableCell>
                <TableCell className="text-base py-4 px-6">
                  ${coin.market_cap.toLocaleString()}
                </TableCell>
                <TableCell className="text-base py-4 px-6">
                  {(() => {
                    const isBookmarked = bookmarkedIds.has(coin.id);
                    return (
                      <Button
                        variant={isBookmarked ? "secondary" : "outline"}
                        className={`
                          transition-colors duration-200
                          ${
                            isBookmarked
                              ? "bg-yellow-200 text-yellow-900 dark:bg-yellow-400 dark:text-yellow-900"
                              : ""
                          }
                          border-yellow-400
                          hover:bg-yellow-100 hover:text-yellow-900 dark:hover:bg-yellow-300
                          font-semibold rounded-lg px-6 py-2
                        `}
                        onClick={() => toggleBookmark(coin.id)}
                        aria-pressed={isBookmarked}
                        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                      >
                        {isBookmarked ? "Bookmarked" : "Bookmark"}
                      </Button>
                    );
                  })()}
                </TableCell>

              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6}>No coins found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination - hidden while loading */}
      {!loading && totalPages > 1 && (
        <div className="mt-5">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.max(p - 1, 1));
                  }}
                />
              </PaginationItem>

              {[...Array(totalPages).keys()].slice(0, 3).map((i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={page === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(i + 1);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {totalPages > 3 && <PaginationEllipsis />}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.min(p + 1, totalPages));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
};

export default CoinTable;