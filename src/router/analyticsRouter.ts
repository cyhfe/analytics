import { Router } from "express";
import UAParser from "ua-parser-js";
import { prisma } from "../prismaClient";
import { Prisma } from "@prisma/client";
import { BadRequestError } from "../error";
import dayjs from "dayjs";
const router = Router();

router.get("/");

router.get("/stats", async (req, res, next) => {
  try {
    const { wid } = req.query;
    if (typeof wid !== "string")
      throw new BadRequestError({ message: "missing wid" });
    const uniqueVisitors = await prisma.session.count({
      where: {
        wid,
      },
    });

    const totalVisits = await prisma.viewData.count({
      where: {
        wid,
      },
    });

    const onlineVisitors = await prisma.session.count({
      where: {
        wid,
        online: true,
      },
    });

    const {
      _sum: { count: totalPageViews },
    } = await prisma.viewData.aggregate({
      _sum: {
        count: true,
      },
    });

    if (totalPageViews == null) {
      return next(new Error("totalPageViews is null"));
    }

    const viewsPerVisit = totalPageViews / totalVisits;

    const {
      _avg: { duration: avgVisitDuration },
    } = await prisma.viewData.aggregate({
      _avg: {
        duration: true,
      },
      where: {
        wid,
      },
    });

    if (avgVisitDuration == null) {
      return next(new Error("avgVisitDuration is null"));
    }

    const viewData = await prisma.viewData.findMany({
      where: {
        wid,
      },
      select: {
        createdAt: true,
        duration: true,
        count: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    console.log(viewData);

    type ViewDataAccumulator = {
      [key: string]: { duration: number; count: number };
    };
    const viewDataAccumulator: ViewDataAccumulator = viewData.reduce(
      (groups: ViewDataAccumulator, item) => {
        const key = dayjs(item.createdAt).format("YYYY-MM-DD HH:00:00");
        groups[key] = {
          duration: (groups[key]?.duration ?? 0) + item.duration,
          count: (groups[key]?.count ?? 0) + item.count,
        };
        return groups;
      },
      Object.assign({})
    );

    res.status(200);
    return res.json({
      uniqueVisitors,
      onlineVisitors,
      totalVisits,
      totalPageViews,
      viewsPerVisit,
      avgVisitDuration,
      viewDataAccumulator,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/enter", async (req, res, next) => {
  const { wid, sessionId } = req.body;

  if (sessionId) {
    console.log("enter again");
    try {
      await prisma.session.update({
        where: {
          id: sessionId,
        },
        data: {
          online: true,
        },
      });
      res.send(sessionId);
    } catch (error) {
      next("error");
    }
    return;
  }

  console.log("first enter");

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
        unique_user: {
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

    res.send(session.id);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/leave", async (req, res, next) => {
  const { pageViewsData, screen, language, referrer, sessionId, wid } =
    req.body;
  if (!sessionId) {
    return res.send("require sessionId");
  }
  if (!wid) {
    return res.send("require wid");
  }
  try {
    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    });

    if (!session) {
      return res.send("require sessionId");
    }

    for (const pathname in pageViewsData) {
      let page: Prisma.PromiseReturnType<typeof prisma.page.findUnique>;
      page = await prisma.page.findUnique({
        where: {
          pathname,
        },
      });
      if (!page) {
        page = await prisma.page.create({
          data: {
            wid,
            pathname,
          },
        });
      }

      await prisma.viewData.create({
        data: {
          wid,
          sessionId: session.id,
          pageId: page.id,
          duration: pageViewsData[pathname].duration,
          count: pageViewsData[pathname].count,
          referrer,
          screen,
          language,
        },
      });
    }

    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        online: false,
      },
    });

    res.send("ok");
  } catch (error) {
    next(error);
    console.log(error);
  }
});

export { router as analyticsRouter };
