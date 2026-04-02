import { authOptions } from "@/lib/auth";
import { SocietyProfile } from "@/types/society.types";
import { getServerSession } from "next-auth";

export async function getSocietyProfile(params: { societyId: string }): Promise<SocietyProfile> {
    const { societyId } = params;
    const session = await getServerSession(authOptions);
    const url = `${process.env.API_BASE_URL}/api/v1/societies/${societyId}/profile`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${session?.accessToken}`,
            },
        });
        const data = await response.json();
        return data as SocietyProfile;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to get society profile: ' + error);
    }
}