import Navbar from "../components/navbar";
import { Separator } from "@/components/ui/separator";

import CoinTable from "../components/coin-table";

const LandingPage: React.FC = () => {
  return (
    <div className="flex min-h-svh flex-col items-center w-full px-4">
      <Navbar />

      <Separator className="h-[2px] bg-border shadow-sm shadow-white/30 w-full" />

      <div className="mt-5 max-w-5xl w-full">
        <CoinTable />
      </div>
    </div>
  );
};

export default LandingPage;
