import { ThemeProvider } from "@/components/theme-provider"

import LandingPage from "./page/LandingPage"
import { Routes , Route } from "react-router-dom"
import CoinDetail from "./page/DetailPage"
import Comparision from "./page/comparisionPage"
import WatchlistPage from "./page/WatchlistPage"

import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/coin/:id" element={<CoinDetail />} />
        <Route path="/compare/:coin1Id/:coin2Id" element={<Comparision />} />
      </Routes>
    </ThemeProvider>
    <Analytics />
    </>
    
  )
}

export default App
