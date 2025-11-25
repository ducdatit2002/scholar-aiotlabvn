import { NextRequest, NextResponse } from "next/server";

const SCHOLAR_ENDPOINT = "https://serpapi.com/search.json";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const yearFrom = searchParams.get("yearFrom") || undefined;
  const yearTo = searchParams.get("yearTo") || undefined;
  const start = searchParams.get("start") || "0";
  const num = searchParams.get("num") || "20";

  if (!q || q.trim() === "") {
    return NextResponse.json(
      { error: "Missing required query parameter `q`." },
      { status: 400 }
    );
  }

  const apiKey =
    req.headers.get("x-serpapi-key") || process.env.SERPAPI_KEY || "";
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing SerpAPI key. Vui lòng nhập API key trong ứng dụng." },
      { status: 401 }
    );
  }

  const params = new URLSearchParams({
    engine: "google_scholar",
    q,
    api_key: apiKey,
    hl: "vi",
    start,
    num,
  });

  if (yearFrom) params.set("as_ylo", yearFrom);
  if (yearTo) params.set("as_yhi", yearTo);

  try {
    const response = await fetch(`${SCHOLAR_ENDPOINT}?${params.toString()}`);
    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: `SerpAPI error (${response.status})`, details: text },
        { status: response.status }
      );
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to reach SerpAPI", details: error?.message },
      { status: 502 }
    );
  }
}
