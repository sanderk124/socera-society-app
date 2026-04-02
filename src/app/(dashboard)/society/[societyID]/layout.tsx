import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

export default function SocietyLayout({ children }: { children: React.ReactNode }) {
    
    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <Topbar />
            <main className="ml-60 pt-14 p-6">
                {children}
            </main>
        </div>
    );
}