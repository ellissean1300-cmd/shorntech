import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded
    ? forwarded.split(",")[0].trim()
    : "unknown";

  const userAgent = req.headers["user-agent"] || "";

  await sql`
    INSERT INTO visits (ip, user_agent)
    VALUES (${ip}, ${userAgent})
  `;

  res.status(200).json({ success: true });
}
