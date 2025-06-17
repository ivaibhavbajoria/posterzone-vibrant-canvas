
import { Toaster as UIToaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Auth0ProviderWrapper } from "./contexts/Auth0Context";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import Index from "./pages/Index";
import Collections from "./pages/Collections";
import CustomPoster from "./pages/CustomPoster";
import Trending from "./pages/Trending";
import BestSellers from "./pages/BestSellers";
import CollagePacks from "./pages/CollagePacks";
import CollagePackDetailsPage from "./pages/CollagePackDetailsPage";
import SurpriseMePage from "./pages/SurpriseMePage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import UserProfilePage from "./pages/UserProfilePage";
import LikedPostersPage from "./pages/LikedPostersPage";
import PosterDetailsPage from "./pages/PosterDetailsPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import AdminPanel from "./pages/AdminPanel";
import AdminAuthPage from "./pages/AdminAuthPage";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { CartProvider } from "./contexts/CartContext";
import Auth0AuthPage from "./pages/Auth0AuthPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Auth0ProviderWrapper>
      <AdminAuthProvider>
        <CartProvider>
          <TooltipProvider>
            <UIToaster />
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth0AuthPage />} />
                  <Route path="/collections" element={<Collections />} />
                  <Route path="/collections/:categoryId" element={<Collections />} />
                  <Route path="/custom-poster" element={<CustomPoster />} />
                  <Route path="/trending" element={<Trending />} />
                  <Route path="/best-sellers" element={<BestSellers />} />
                  <Route path="/collage-packs" element={<CollagePacks />} />
                  <Route path="/collage-pack/:packId" element={<CollagePackDetailsPage />} />
                  <Route path="/surprise-me" element={<SurpriseMePage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/profile" element={<UserProfilePage />} />
                  <Route path="/order-history" element={<OrderHistoryPage />} />
                  <Route path="/favorites" element={<LikedPostersPage />} />
                  <Route path="/poster/:posterId" element={<PosterDetailsPage />} />
                </Route>
                {/* Admin routes - separate from main layout */}
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/admin/auth" element={<AdminAuthPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AdminAuthProvider>
    </Auth0ProviderWrapper>
  </QueryClientProvider>
);

export default App;
