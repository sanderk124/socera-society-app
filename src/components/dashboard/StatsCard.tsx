import { type LucideIcon } from 'lucide-react';

type Props = {
    label: string;
    value: string | number;
    icon: LucideIcon;
    iconColor: string;
    iconBg: string;
    sub?: string;
};

export function StatsCard({ label, value, icon: Icon, iconColor, iconBg, sub }: Props) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 px-5 py-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={20} className={iconColor} />
            </div>
            <div className="min-w-0">
                <p className="text-xs text-gray-500 truncate">{label}</p>
                <p className="text-xl font-semibold text-gray-900 leading-tight">{value}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}