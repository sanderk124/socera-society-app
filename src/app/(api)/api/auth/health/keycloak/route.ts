export async function GET() {
    try {
      const response = await fetch(
        `${process.env.KEYCLOAK_ISSUER}/.well-known/openid-configuration`,
        { 
          signal: AbortSignal.timeout(3000),
          cache: 'no-store'
        }
      );
      
      if (!response.ok) {
        return Response.json({ available: false });
      }
      
      const data = await response.json();
      const isValid = data.issuer && data.authorization_endpoint;
      
      return Response.json({ available: isValid });
    } catch {
      return Response.json({ available: false });
    }
  }