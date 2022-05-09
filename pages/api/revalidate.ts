import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body;
  const pageUrl = body.pageUrl;
  // Check for secret to confirm this is a valid request
  // if (req.query.secret !== process.env.REVALIDATE_TOKEN) {
  //   return res.status(401).json({ message: "Invalid token" });
  // }
  const accessToken = req.cookies?.accessToken;
  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decoded = jwt.verify(
    accessToken,
    process.env.WEB_API_JWT_SECRET || ""
  ) as any;

  if (decoded?.sub !== 1) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!pageUrl) {
    return res.status(400).json({ message: "Bad request (page url)" });
  }

  try {
    await res.unstable_revalidate(pageUrl);
    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res
      .status(500)
      .json({
        message: "Error revalidating",
        pageUrl,
        decoded,
        accessToken,
        error: err,
      });
  }
}
