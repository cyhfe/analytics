import { Router } from "express";
import UAParser from "ua-parser-js";
import { prisma } from "../prismaClient";
import { Prisma } from "@prisma/client";
import { BadRequestError } from "../error";
import dayjs from "dayjs";

const router = Router();

type ViewDataAccumulator = {
  [key: string]: { duration: number; count: number };
};

const viewDataGroupType = ["country", "os", "browser", "device"] as const;
type ViewDataGroupType = (typeof viewDataGroupType)[number];
router.get("/viewDataGroup", async (req, res, next) => {
  const { wid, type } = req.query;
  if (typeof wid !== "string")
    return next(new BadRequestError({ message: "missing wid" }));
  if (!viewDataGroupType.includes(type as ViewDataGroupType))
    return next(new BadRequestError({ message: "invalid type" }));

  try {
    const data = await prisma.viewData.groupBy({
      where: {
        wid,
      },
      by: [type as ViewDataGroupType],
      _sum: {
        count: true,
        duration: true,
      },
    });

    const totalCount = data.reduce(
      (sum, group) => sum + (group._sum.count ?? 0),
      0
    );

    console.log(data);
    res.send({ [type as ViewDataGroupType]: data, totalCount });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/pages", async (req, res, next) => {
  const { wid } = req.query;
  if (typeof wid !== "string")
    return next(new BadRequestError({ message: "missing wid" }));

  try {
    const pages = await prisma.page.findMany({
      where: {
        wid,
      },

      include: {
        _count: {
          select: {
            viewData: true,
          },
        },
      },

      orderBy: {
        viewData: {
          _count: "desc",
        },
      },
    });

    const totalCount = pages.reduce(
      (sum, group) => sum + group._count.viewData,
      0
    );

    console.log(pages);
    res.send({ pages, totalCount });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/referrer", async (req, res, next) => {
  const { wid } = req.query;
  if (typeof wid !== "string")
    return next(new BadRequestError({ message: "missing wid" }));

  try {
    const referrer = await prisma.viewData.groupBy({
      where: {
        wid,
      },
      by: ["referrer"],
      _count: {
        referrer: true,
      },
      orderBy: {
        _count: {
          referrer: "desc",
        },
      },
    });

    const prettier = referrer.map(({ referrer, _count }) => ({
      referrer,
      count: _count.referrer,
    }));

    const totalCount = prettier.reduce((sum, group) => sum + group.count, 0);

    res.json({ referrer: prettier, totalCount });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/viewData", async (req, res, next) => {
  const { wid } = req.query;
  if (typeof wid !== "string")
    return next(new BadRequestError({ message: "missing wid" }));

  try {
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
    const viewDataAccumulator: ViewDataAccumulator = viewData.reduce(
      (groups: ViewDataAccumulator, item) => {
        const key = new Date(
          dayjs(item.createdAt).format("YYYY-MM-DD HH:00:00")
        ).getTime();

        groups[key] = {
          duration: (groups[key]?.duration ?? 0) + item.duration,
          count: (groups[key]?.count ?? 0) + item.count,
        };
        return groups;
      },
      Object.assign({})
    );

    res.json({ viewDataAccumulator });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/online", async (req, res, next) => {
  const { wid } = req.query;
  if (typeof wid !== "string")
    return next(new BadRequestError({ message: "missing wid" }));
  try {
    const onlineVisitors = await prisma.session.count({
      where: {
        wid,
        online: true,
      },
    });
    res.json({ onlineVisitors });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/stats", async (req, res, next) => {
  try {
    const { wid } = req.query;
    if (typeof wid !== "string")
      return next(new BadRequestError({ message: "missing wid" }));
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

    const viewsPerVisit = (totalPageViews / totalVisits).toFixed(2);

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

    res.status(200);
    return res.json({
      uniqueVisitors,
      totalVisits,
      totalPageViews,
      viewsPerVisit,
      avgVisitDuration,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/websites", async (req, res, next) => {
  try {
    const websites = await prisma.website.findMany({
      select: {
        domain: true,
        id: true,
      },
    });
    res.status(200);
    res.json(websites);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/enter", async (req, res, next) => {
  const { wid, sessionId } = req.body;

  if (sessionId) {
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

  const ips = [
    "67.72.64.195",
    "127.50.157.183",
    "221.133.81.195",
    "115.184.179.162",
    "72.231.199.205",
  ];
  // let ip = "::ffff:112.10.225.55";
  // if (ip.startsWith("::ffff:")) {
  //   ip = ip.slice(7);
  // }

  const ip = ips[Math.floor(Math.random() * ips.length)];

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
          browser: session.browser,
          os: session.os,
          device: session.device,
          country: session.country,
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
