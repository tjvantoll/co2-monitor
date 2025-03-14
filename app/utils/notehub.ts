import { NotehubEvent } from "../types/notehub";

async function getAccessToken(): Promise<string> {
  const clientId = process.env.NOTEHUB_CLIENT_ID;
  const clientSecret = process.env.NOTEHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing Notehub credentials in environment variables");
  }

  const response = await fetch("https://notehub.io/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Token request failed:", errorText);
    throw new Error("Failed to get access token");
  }

  const data = await response.json();
  return data.access_token;
}

export async function getEvents(): Promise<NotehubEvent[]> {
  try {
    const accessToken = await getAccessToken();
    const projectUID = process.env.NOTEHUB_PROJECT_UID;

    if (!projectUID) {
      throw new Error("Missing Notehub project UID in environment variables");
    }

    const response = await fetch(
      `https://api.notefile.net/v1/projects/${projectUID}/events?sortOrder=desc&sortBy=captured&pageSize=5000`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store", // Disable caching to always get fresh data
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Events request failed:", errorText);
      throw new Error("Failed to fetch events");
    }

    const data = await response.json();
    console.log(`Retrieved ${data.events?.length || 0} events`);
    return data.events || [];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}
