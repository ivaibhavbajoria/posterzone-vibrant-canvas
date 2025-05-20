
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Collections from "./pages/Collections";
import CustomPoster from "./pages/CustomPoster";
import Trending from "./pages/Trending";
import BestSellers from "./pages/BestSellers";
import CollagePacks from "./pages/CollagePacks";
import SurpriseMePage from "./pages/SurpriseMePage";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/:categoryId" element={<Collections />} />
            <Route path="/custom-poster" element={<CustomPoster />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/best-sellers" element={<BestSellers />} />
            <Route path="/collage-packs" element={<CollagePacks />} />
            <Route path="/surprise-me" element={<SurpriseMePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
