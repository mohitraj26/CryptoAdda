import Navbar from "@/components/navbar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCoinStore } from "../store/useCoinStore";
import { useEffect, useRef, useState } from "react";

const ITEMS_PER_PAGE = 7;



const WatchlistPage: React.FC = () => {
  const { coins, loading, fetchCoins } = useCoinStore();
  const [page, setPage] = useState(1);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const initialized = useRef(false);

  // Load bookmarks from localStorage only once
  useEffect(() => {
    if (!initialized.current) {
      const stored = localStorage.getItem("bookmarkedCoins");
      if (stored) {
        setBookmarkedIds(new Set(JSON.parse(stored)));
      }
      initialized.current = true;
    }
  }, []);

  // Fetch all coins
  useEffect(() => {
    fetchCoins();
  }, []);

  // Filter only bookmarked coins
  const bookmarkedCoins = coins.filter((coin) => bookmarkedIds.has(coin.id));

  const totalPages = Math.ceil(bookmarkedCoins.length / ITEMS_PER_PAGE);
  const paginatedCoins = bookmarkedCoins.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const removeBookmark = (id: string) => {
    const updated = new Set(bookmarkedIds);
    updated.delete(id);
    setBookmarkedIds(updated);
    localStorage.setItem("bookmarkedCoins", JSON.stringify(Array.from(updated)));
  };

  return (
    <>
      <Navbar />
      <Separator className="h-[2px] bg-border shadow-sm shadow-white/30 w-full" />
      <h1 className="text-2xl font-bold mt-5 text-center">Watchlist</h1>
          <Breadcrumb className="max-w-5xl mx-auto px-6 mt-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Markets</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Watchlist</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

      <div className="max-w-5xl w-full mx-auto">

      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-base py-4 px-6">#</TableHead>
            <TableHead className="text-base py-4 px-6">Coin</TableHead>
            <TableHead className="text-base py-4 px-6">Price</TableHead>
            <TableHead className="text-base py-4 px-6">24h%</TableHead>
            <TableHead className="text-base py-4 px-6">Market Cap</TableHead>
            <TableHead className="text-base py-4 px-6">Remove</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
{bookmarkedIds.size === 0 ? (
  <TableRow>
    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground text-lg">
      You haven’t bookmarked any coins yet. Go bookmark something!
    </TableCell>
  </TableRow>
)  : paginatedCoins.length > 0 ? (
            paginatedCoins.map((coin, index) => (
              <TableRow key={coin.id}>
                <TableCell className="font-medium text-base py-4 px-6">
                  {(page - 1) * ITEMS_PER_PAGE + index + 1}
                </TableCell>
                <TableCell className="flex items-center gap-2 text-base py-4 px-6">
                  <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                  <Link to={`/coin/${coin.id}`}>{coin.name}</Link>
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
                  <Button
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={() => removeBookmark(coin.id)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                No bookmarked coins found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      </div>

      {/* Pagination */}
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

export default WatchlistPage;
