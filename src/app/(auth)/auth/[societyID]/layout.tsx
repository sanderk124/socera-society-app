import { redirect } from 'next/navigation'
import { getSocietyStatus } from '@/services/society.services'

export default async function AuthSocietyLayout({
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

    return <>{children}</>
}