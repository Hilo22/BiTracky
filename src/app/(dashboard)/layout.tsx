import Sidebar from "@/components/sidebar"; // Import component xịn của Hiếu vào đây

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* 1. Sidebar: Thay vì viết code HTML ở đây, ta gọi Component */}
      <aside className="w-64 bg-white border-r overflow-y-auto">
         <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 2. Header: Sau này mình có thể tách riêng thành UserNav.tsx */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0">
          <p className="font-medium text-slate-600">Dashboard Area</p>
          <div className="flex items-center gap-4">
             {/* Chỗ này sau này để Avatar hoặc Thông báo */}
             <span className="text-sm text-slate-500">Hiếu Phạm</span>
          </div>
        </header>
        
        {/* 3. Main Content: Nơi các trang con (page.tsx) hiển thị */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}