
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { DeviceProvider } from "@/context/DeviceContext";
import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import LockInSession from "./pages/LockInSession";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import CatCollectionPage from "./pages/CatCollectionPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Layout wrapper that conditionally shows sidebar
const LayoutWrapper = ({ children, showSidebar }: { children: React.ReactNode, showSidebar: boolean }) => {
  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-12 items-center border-b px-4">
            <SidebarTrigger />
            <h1 className="ml-4 font-semibold">FocusTracker</h1>
          </header>
          <main className="flex-1 p-4">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

// Main App component with routes and providers
const AppContent = () => {
  const location = useLocation();
  const showSidebar = location.pathname !== "/";

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LayoutWrapper showSidebar={showSidebar}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/lock-in" element={
            <ProtectedRoute>
              <LockInSession />
            </ProtectedRoute>
          } />
          <Route path="/statistics" element={
            <ProtectedRoute>
              <Statistics />
            </ProtectedRoute>
          } />
          <Route path="/cats" element={
            <ProtectedRoute>
              <CatCollectionPage />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </LayoutWrapper>
    </TooltipProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <DeviceProvider>
          <AppContent />
        </DeviceProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
