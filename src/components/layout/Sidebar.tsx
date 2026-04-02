'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Calendar, Settings } from 'lucide-react';

const navItems = [
    { label: 'Dashboard', href: 'dashboard', icon: LayoutDashboard },
    { label: 'Ledenbeheer', href: 'ledenbeheer', icon: Users },
    { label: 'Evenementen', href: 'evenementen', icon: Calendar },
    { label: 'Instellingen', href: 'instellingen', icon: Settings },
];

export default function Sidebar() {
    const params = useParams();
    const pathname = usePathname();
    const societyID = params.societyID as string;

    return (
        <aside className="fixed top-0 left-0 h-screen w-60 bg-gray-900 flex flex-col z-20">
            <div className="px-6 py-5 border-b border-gray-700">
                <span className="text-white font-semibold text-lg tracking-tight">Socera</span>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map(({ label, href, icon: Icon }) => {
                    const fullPath = `/society/${societyID}/${href}`;
                    const isActive = pathname === fullPath;
                    return (
                        <Link
                            key={href}
                            href={fullPath}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                                isActive
                                    ? 'bg-gray-700 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <Icon size={18} />
                            {label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}