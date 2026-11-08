import { NextRequest, NextResponse } from "next/server";

type IpApiResponse = {
  ip?: string;
  network?: string;
  version?: string;
  city?: string;
  region?: string;
  region_code?: string;
  country_name?: string;
  country_code?: string;
  country_code_iso3?: string;
  country_capital?: string;
  country_tld?: string;
  continent_code?: string;
  in_eu?: boolean;
  postal?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  utc_offset?: string;
  country_calling_code?: string;
  currency?: string;
  currency_name?: string;
  languages?: string;
  asn?: string;
  org?: string;
  error?: boolean;
  reason?: string;
};

function getClientIp(req: NextRequest) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");

  const ip = forwardedFor?.split(",")[0].trim() || realIp || "unknown";

  return ip;
}

function isLocalIp(ip: string) {
  return ip === "::1" || ip === "127.0.0.1" || ip === "unknown";
}

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    if (isLocalIp(ip)) {
      return NextResponse.json({
        success: true,
        local: true,
        message: "Local development IP detected",
        data: {
          ip,
          note: "This is localhost, not a public IP.",
        },
      });
    }

    const response = await fetch(`https://ipapi.co/154.185.60.50/json/`, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const geo = (await response.json()) as IpApiResponse;

    console.log("IP Geolocation data:", geo);

    return NextResponse.json({
      success: true,
      local: false,
      data: {
        ip,
        network: geo.network ?? null,
        version: geo.version ?? null,

        city: geo.city ?? null,
        region: geo.region ?? null,
        regionCode: geo.region_code ?? null,

        country: geo.country_name ?? null,
        countryCode: geo.country_code ?? null,
        countryCodeIso3: geo.country_code_iso3 ?? null,
        countryCapital: geo.country_capital ?? null,
        countryTld: geo.country_tld ?? null,
        continentCode: geo.continent_code ?? null,
        inEu: geo.in_eu ?? null,

        postal: geo.postal ?? null,
        latitude: geo.latitude ?? null,
        longitude: geo.longitude ?? null,
        timezone: geo.timezone ?? null,
        utcOffset: geo.utc_offset ?? null,

        countryCallingCode: geo.country_calling_code ?? null,
        currency: geo.currency ?? null,
        currencyName: geo.currency_name ?? null,
        languages: geo.languages ?? null,

        asn: geo.asn ?? null,
        org: geo.org ?? null,

        googleMapsUrl:
          geo.latitude && geo.longitude
            ? `https://www.google.com/maps?q=${geo.latitude},${geo.longitude}`
            : null,
      },
      raw: geo, // keep raw provider response if you want EVERYTHING
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch IP geolocation data",
      },
      { status: 500 },
    );
  }
}
