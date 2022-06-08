import type { NextApiRequest, NextApiResponse } from "next";
// import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { route } = req.body;
    if (!route) {
      return res.status(400).json({ msg: "Route is required" });
    }
    try {
      await prisma.counter.upsert({
        where: {
          route,
        },
        create: {
          route,
          totalVisit: 1,
        },
        update: {
          totalVisit: {
            increment: 1,
          },
        },
      });
      return res.status(200).json("Success");
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Something went wrong" });
    }
  } else if (req.method === "GET") {
    try {
      const counter = await prisma.counter.findMany();
      return res.status(200).json(counter);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Something went wrong" });
    }
  } else {
    return res.status(405).json({ msg: "Method not allowed" });
  }
}
