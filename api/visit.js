export default async function handler(req, res) {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    "unknown";

  console.log("Visitor IP:", ip);

  res.status(200).json({ ok: true });
}
