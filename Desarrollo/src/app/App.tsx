import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import SplashPage from '@/pages/SplashPage';
import RegisterPage from '@/pages/RegisterPage';
import LoginPage from '@/pages/LoginPage';
import FoodProfilePage from '@/pages/FoodProfilePage';
import RecommendationsPage from '@/pages/RecommendationsPage';
import RecipeDetailPage from '@/pages/RecipeDetailPage';
import WeeklyMenuPage from '@/pages/WeeklyMenuPage';
import ShoppingListPage from '@/pages/ShoppingListPage';
import InventoryPage from '@/pages/InventoryPage';
import DashboardPage from '@/pages/DashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="size-full w-full min-h-screen">
        <div className="w-full min-h-screen bg-white">
          <Routes>
            <Route path="/" element={<SplashPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/food-profile" element={<FoodProfilePage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/recipe/:id" element={<RecipeDetailPage />} />
            <Route path="/menu" element={<WeeklyMenuPage />} />
            <Route path="/shopping" element={<ShoppingListPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/stats" element={<DashboardPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}