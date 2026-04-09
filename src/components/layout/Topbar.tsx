'use client';

import { usePathname } from 'next/navigation';

const pageTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    ledenbeheer: 'Ledenbeheer',
    evenementen: 'Evenementen',
    instellingen: 'Instellingen',
};

export default function Topbar() {
    const pathname = usePathname();
    const segment = pathname.split('/').pop() ?? '';
    const title = pageTitles[segment] ?? 'Dashboard';

    return (
        <header className="fixed top-0 left-60 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-6 z-10">
            <h1 className="text-gray-800 font-semibold text-base">{title}</h1>
        </header>
    );
}