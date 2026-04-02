
export default async function SocietyDashboard({ params }: { params: Promise<{ societyID: string }> }) {
    const { societyID } = await params;

    return (
        <div>
            <h1>Society Dashboard for {societyID}</h1>
        </div>
    );
}