import { getLlmsFullTxt } from "@/config/seo";

export function GET() {
  return new Response(getLlmsFullTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
