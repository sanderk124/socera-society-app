'use client';

import { useState, useTransition } from 'react';

type Props = {
    currentRole: string;
    availableRoles: string[];
    currentUserIsOwner: boolean;
    action: (newRole: string) => Promise<void>;
};

export function RoleForm({ currentRole, availableRoles, currentUserIsOwner, action }: Props) {
    const [selectedRole, setSelectedRole] = useState(currentRole);
    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<'success' | 'error' | null>(null);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setResult(null);
        startTransition(async () => {
            try {
                await action(selectedRole);
                setResult('success');
            } catch {
                setResult('error');
            }
        });
    }

    const hasChanged = selectedRole !== currentRole;

    return (
        <div className="space-y-3">
            <form onSubmit={handleSubmit}>
                <label className="block text-sm text-gray-600 mb-2">Rol wijzigen</label>
                <div className="flex items-center gap-3">
                    <select
                        value={selectedRole}
                        onChange={e => { setSelectedRole(e.target.value); setResult(null); }}
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isPending}
                    >
                        {availableRoles.map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        disabled={isPending || !hasChanged}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'Opslaan...' : 'Opslaan'}
                    </button>
                </div>
            </form>

            {!currentUserIsOwner && (
                <p className="text-xs text-red-500">
                    Alleen owners kunnen de Owner-rol toewijzen.
                </p>
            )}

            {result === 'success' && (
                <p className="text-xs text-green-600">Rol succesvol gewijzigd.</p>
            )}
            {result === 'error' && (
                <p className="text-xs text-red-500">Er ging iets mis. Probeer het opnieuw.</p>
            )}
        </div>
    );
}