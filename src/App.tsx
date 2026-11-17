import React, { useState, useEffect } from 'react';
import { LiquidBackground } from './components/common/LiquidBackground';
import { HeaderNavbar } from './components/common/HeaderNavbar';
import { MacOSDock } from './components/common/MacOSDock';
import { FloatingWhatsAppButton } from './components/common/FloatingWhatsAppButton';
import { PostLoginAnnouncementModal } from './components/common/PostLoginAnnouncementModal';
import { AuthModal } from './components/auth/AuthModal';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { NewOrderForm } from './components/order/NewOrderForm';
import { OrderHistory } from './components/order/OrderHistory';
import { DepositManager } from './components/deposit/DepositManager';
import { LiveChatWidget } from './components/chat/LiveChatWidget';
import { ProfileSettings } from './components/profile/ProfileSettings';
import { ServiceCatalogModal } from './components/services/ServiceCatalogModal';
import { api } from './services/api';
import { User, Order, Deposit, ServiceItem } from './types';
import { DEFAULT_SERVICES } from './services/fayupedia';

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [services, setServices] = useState<ServiceItem[]>(DEFAULT_SERVICES);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isChannelOpen, setIsChannelOpen] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  // Load initial data
  const loadUserData = async (currentUser?: User | null) => {
    const u = currentUser !== undefined ? currentUser : api.getCurrentUser();
    setUser(u);

    // Fetch services
    try {
      const srvList = await api.getServices();
      if (srvList && srvList.length > 0) {
        setServices(srvList);
      }
    } catch {}

    // Fetch orders & deposits
    try {
      const ords = await api.getOrders(u?.id);
      setOrders(ords);

      const deps = await api.getDeposits(u?.id);
      setDeposits(deps);
    } catch {}
  };

  useEffect(() => {
    loadUserData();
    // Try initializing DB endpoint on Cloudflare if available
    fetch('/api/init-db', { method: 'POST' }).catch(() => {});
  }, []);

  const handleAuthSuccess = (loggedUser: User) => {
    setUser(loggedUser);
    loadUserData(loggedUser);
    // Trigger the mandatory announcement channel popup
    setIsChannelOpen(true);
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    loadUserData(null);
    setActiveTab('dashboard');
  };

  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing');

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col font-sans">
      {/* Dynamic Water Liquid Background */}
      <LiquidBackground />

      {/* Top Navbar */}
      <HeaderNavbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onNavigate={(tab) => setActiveTab(tab)}
        onOpenChannel={() => setIsChannelOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 pt-6 pb-32 relative z-10">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            user={user}
            orders={orders}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenChannel={() => setIsChannelOpen(true)}
          />
        )}

        {activeTab === 'new-order' && (
          <NewOrderForm
            user={user}
            services={services}
            onOrderSuccess={() => {
              loadUserData(user);
              setActiveTab('pending-orders');
            }}
            onNavigateToDeposit={() => setActiveTab('deposit')}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {activeTab === 'pending-orders' && (
          <OrderHistory
            orders={orders}
            onRefresh={() => loadUserData(user)}
            defaultFilter="pending"
          />
        )}

        {activeTab === 'order-history' && (
          <OrderHistory
            orders={orders}
            onRefresh={() => loadUserData(user)}
            defaultFilter="all"
          />
        )}

        {activeTab === 'services' && (
          <ServiceCatalogModal
            services={services}
            onSelectService={() => setActiveTab('new-order')}
          />
        )}

        {activeTab === 'deposit' && (
          <DepositManager
            user={user}
            deposits={deposits}
            onRefresh={() => loadUserData(user)}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {activeTab === 'chat' && (
          <LiveChatWidget
            user={user}
            onOpenAuth={() => setIsAuthOpen(true)}
            csNumber="+628815722784"
          />
        )}

        {activeTab === 'profile' && (
          <ProfileSettings
            user={user}
            onUpdateSuccess={(updated) => setUser(updated)}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}
      </main>

      {/* Floating macOS Dock navigation */}
      <MacOSDock
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab)}
        unreadChatCount={unreadChatCount}
        pendingOrderCount={pendingOrders.length}
        onOpenChannel={() => setIsChannelOpen(true)}
      />

      {/* Floating WhatsApp Customer Support Button (+628815722784) */}
      <FloatingWhatsAppButton phoneNumber="628815722784" />

      {/* Auth Modal (Login & Register with Google) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Post Login Official Channel Notification Modal */}
      <PostLoginAnnouncementModal
        isOpen={isChannelOpen}
        onClose={() => setIsChannelOpen(false)}
        channelUrl="https://whatsapp.com/channel/0029VbE5A9VBPzjScJYKA50E"
      />
    </div>
  );
}

export default App;
