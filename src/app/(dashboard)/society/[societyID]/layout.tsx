import { redirect } from 'next/navigation'
import { getSocietyStatus } from '@/services/society.services'
import { isAdminOrOwner } from '@/services/user.services'
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

export default async function SocietyLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ societyID: string }>
}) {
    const { societyID } = await params

    const result = await getSocietyStatus(societyID)

    if (!result.found) {
        redirect('/society-blocked?reason=not-found')
    }

    if (result.data.status !== 'Approved') {
        const reason = result.data.status.toLowerCase()
        const name = encodeURIComponent(result.data.name)
        redirect(`/society-blocked?reason=${reason}&name=${name}`)
    }

    const authorized = await isAdminOrOwner({ societyID })

    if (!authorized) {
        redirect('/unauthorized')
    }

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