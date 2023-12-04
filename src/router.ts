import { Router } from "express";
import UAParser from "ua-parser-js";
import { prisma } from "./prismaClient";
import { Prisma } from "@prisma/client";

const router = Router();

router.post("/analytics/enter", async (req, res, next) => {
  const { wid } = req.body;
  console.log(wid);

  let ip = "::ffff:112.10.225.55";
  if (ip.startsWith("::ffff:")) {
    ip = ip.slice(7);
  }

  const { country_name }: { country_name: string | undefined } = await (
    await fetch("https://api.iplocation.net/?ip=" + ip)
  ).json();

  const parser = new UAParser(req.headers["user-agent"]); // you need to pass the user-agent for nodejs

  const { browser, os, device } = parser.getResult();

  let session: Prisma.PromiseReturnType<typeof prisma.session.findUnique>;

  try {
    session = await prisma.session.findUnique({
      where: {
        wid,
        newuser: {
          ip,
          browser: browser.name ?? "",
          os: os.name ?? "",
        },
      },
    });
    if (session == null) {
      session = await prisma.session.create({
        data: {
          wid,
          ip,
          online: true,
          browser: browser.name ?? "",
          os: os.name ?? "",
          device: device.model,
          country: country_name,
        },
      });
    }

    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        online: true,
      },
    });

    setTimeout(async () => {
      session &&
        (await prisma.session.update({
          where: {
            id: session.id,
          },
          data: {
            online: false,
          },
        }));
    }, 5 * 60 * 1000);

    res.send("ok");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/analytics/leave", async (req, res, next) => {
  console.log(req.body);
  res.send("ok");
});

export { router };
