import { ThemeProvider } from "@/components/theme-provider"

import LandingPage from "./page/LandingPage"
import { Routes , Route } from "react-router-dom"
import CoinDetail from "./page/DetailPage"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/coin/:id" element={<CoinDetail />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
