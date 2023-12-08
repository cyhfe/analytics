import { Router } from "express";
import UAParser from "ua-parser-js";
import { prisma } from "../prismaClient";
import { Prisma } from "@prisma/client";
import { BadRequestError } from "../error";
import { getDateRange, dayjs, deteRangeByFilter } from "../utils";

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const router = Router();

router.get("/pages", async (req, res, next) => {
  const { wid } = req.query;
  if (typeof wid !== "string")
    return next(new BadRequestError({ message: "missing wid" }));

  try {
    const pages = await prisma.viewData.groupBy({
      where: { wid },
      by: ["pathname"],
      _sum: {
        count: true,
        duration: true,
      },
      _count: {
        sessionId: true,
      },
    });

    const prettier = pages.map(({ pathname, _sum, _count }) => ({
      pathname,
      duration: _sum.duration,
      count: _sum.count,
      sessions: _count.sessionId,
    }));

    res.json({ pages: prettier });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/devices", async (req, res, next) => {
  const { wid } = req.query;
  if (typeof wid !== "string")
    return next(new BadRequestError({ message: "missing wid" }));

  try {
    const browserArray = await prisma.session.groupBy({
      where: { wid },
      by: ["browser"],
      _count: {
        _all: true,
      },
    });

    const browser = browserArray.map((b) => ({
      name: b.browser,
      count: b._count._all,
    }));

    const deviceArray = await prisma.session.groupBy({
      where: { wid },
      by: ["device"],
      _count: {
        _all: true,
      },
    });

    const device = deviceArray.map((d) => ({
      name: d.device,
      count: d._count._all,
    }));

    const osArray = await prisma.session.groupBy({
      where: { wid },
      by: ["os"],
      _count: {
        _all: true,
      },
    });

    const os = osArray.map((o) => ({
      name: o.os,
      count: o._count._all,
    }));

    res.json({
      browser,
      device,
      os,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/referrers", async (req, res, next) => {
  const { wid } = req.query;
  if (typeof wid !== "string")
    return next(new BadRequestError({ message: "missing wid" }));

  try {
    const referrers = await prisma.viewData.groupBy({
      where: { wid },
      by: ["referrer"],
      _sum: {
        count: true,
        duration: true,
      },
      _count: {
        sessionId: true,
      },
    });

    const prettier = referrers.map(({ referrer, _sum, _count }) => ({
      referrer,
      duration: _sum.duration,
      count: _sum.count,
      sessions: _count.sessionId,
    }));

    res.json({ referrers: prettier });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/countries", async (req, res, next) => {
  const { wid } = req.query;
  if (typeof wid !== "string")
    return next(new BadRequestError({ message: "missing wid" }));

  try {
    const cData = await prisma.session.groupBy({
      by: ["country"],
      where: {
        wid,
      },
      _count: {
        _all: true,
      },
    });

    const countrySessionMap = cData.reduce((accu, item) => {
      accu[item.country ?? ""] = item._count._all;
      return accu;
    }, Object.assign({}));
    const data = await prisma.viewData.findMany({
      where: { wid },
      select: {
        count: true,
        duration: true,
        viewer: {
          select: {
            country: true,
          },
        },
      },
    });

    const countriesObj = data.reduce((acc, item) => {
      if (item.viewer.country != null) {
        acc[item.viewer.country] = {
          count: (acc[item.viewer.country]?.count ?? 0) + item.count,
          duration: (acc[item.viewer.country]?.duration ?? 0) + item.duration,
          sessions: countrySessionMap[item.viewer.country] ?? 0,
        };
      }
      return acc;
    }, Object.assign({}));

    const countries = Object.keys(countriesObj).map((key) => ({
      country: key,
      ...countriesObj[key],
    }));

    res.json({ countries });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/uv", async (req, res, next) => {
  const { wid, filter } = req.query;
  if (typeof wid !== "string")
    return next(new BadRequestError({ message: "missing wid" }));

  try {
    const dateRange = deteRangeByFilter(filter);
    const data = await prisma.session.findMany({
      where: {
        wid,
        createdAt: {
          gte: dateRange ? new Date(dateRange[0]) : undefined,
          lte: dateRange ? new Date(dateRange[1]) : undefined,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const uvObj = data.reduce((acc, item) => {
      const key = dayjs(item.createdAt).format("YYYY-MM-DD HH:00:00");
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, Object.assign({}));

    const uv = Object.keys(uvObj).map((key) => {
      return {
        timestamp: new Date(key).getTime(),
        count: uvObj[key],
      };
    });

    res.json({ uv });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/pv", async (req, res, next) => {
  const { wid, filter } = req.query;
  if (typeof wid !== "string")
    return next(new BadRequestError({ message: "missing wid" }));

  try {
    const dateRange = deteRangeByFilter(filter);
    const data = await prisma.viewData.groupBy({
      where: {
        wid,
        createdAt: {
          gte: dateRange ? new Date(dateRange[0]) : undefined,
          lte: dateRange ? new Date(dateRange[1]) : undefined,
        },
      },
      by: ["createdAt"],
      _sum: {
        count: true,
        duration: true,
      },
      _count: {
        sessionId: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // stash
    // const pvObj = data.reduce((acc, item) => {
    //   const key = dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss");
    //   acc[key] = {
    //     count: (acc[key]?.count ?? 0) + item._sum.count,
    //     duration: (acc[key]?.duration ?? 0) + item._sum.duration,
    //     sessions: (acc[key]?.sessions ?? 0) + item._count.sessionId,
    //   };
    //   return acc;
    // }, Object.assign({}));

    // const pv = Object.keys(pvObj).map((key) => {
    //   return {
    //     count: pvObj[key].count,
    //     duration: pvObj[key].duration,
    //     sessions: pvObj[key].sessions,
    //     date: key,
    //   };
    // });

    const pv = data.map((item) => {
      return {
        count: item._sum.count,
        duration: item._sum.duration,
        sessions: item._count.sessionId,
        timestamp: item.createdAt.getTime(),
      };
    });

    res.json({ pv });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/charts", async (req, res, next) => {
  const { wid, filter } = req.query;
  if (typeof wid !== "string")
    return next(new BadRequestError({ message: "missing wid" }));

  try {
    const dateRange = getDateRange(filter);

    // uv
    let uv;
    if (dateRange) {
      uv = await prisma.$queryRaw`
      SELECT strftime('%Y-%m-%d %H:00:00', datetime(createdAt/1000, 'unixepoch')) AS timestamp,
       COUNT(*) AS amt 
      FROM Session 
      WHERE strftime('%Y-%m-%d %H:00:00', datetime(createdAt/1000, 'unixepoch')) 
            BETWEEN ${dateRange[0]} AND ${dateRange[1]}
            AND wid = ${wid}
      GROUP BY timestamp;
      `;
    } else {
      uv = await prisma.$queryRaw`
      SELECT strftime('%Y-%m-%d %H:00:00', datetime(createdAt/1000, 'unixepoch')) AS timestamp,
       COUNT(*) AS amt 
      FROM Session 
      WHERE wid = ${wid}
      GROUP BY timestamp;
      `;
    }

    // pv
    let pv;
    if (dateRange) {
      pv = await prisma.$queryRaw`
         SELECT strftime('%Y-%m-%d %H:00:00', datetime(createdAt/1000, 'unixepoch')) AS timestamp,
          COUNT(*) AS amt,
          SUM(count) AS count,
          SUM(duration) AS duration
         FROM ViewData
         WHERE strftime('%Y-%m-%d %H:00:00', datetime(createdAt/1000, 'unixepoch')) 
               BETWEEN ${dateRange[0]} AND ${dateRange[1]}
               AND wid = ${wid}
         GROUP BY timestamp;
         `;
    } else {
      pv = await prisma.$queryRaw`
         SELECT strftime('%Y-%m-%d %H:00:00', datetime(createdAt/1000, 'unixepoch')) AS timestamp,
          COUNT(*) AS amt,
          SUM(count) AS count,
          SUM(duration) AS duration
         FROM ViewData
         WHERE wid=${wid}
         GROUP BY timestamp;
         `;
    }

    res.json({ uv, pv });
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
    const { wid, filter } = req.query;
    if (typeof wid !== "string")
      return next(new BadRequestError({ message: "missing wid" }));
    const dateRange = deteRangeByFilter(filter);

    const uniqueVisitors = await prisma.session.count({
      where: {
        wid,
        createdAt: {
          gte: dateRange ? new Date(dateRange[0]) : undefined,
          lte: dateRange ? new Date(dateRange[1]) : undefined,
        },
      },
    });

    const totalVisits = await prisma.viewData.count({
      where: {
        wid,
        createdAt: {
          gte: dateRange ? new Date(dateRange[0]) : undefined,
          lte: dateRange ? new Date(dateRange[1]) : undefined,
        },
      },
    });

    const viewpages = await prisma.viewData.aggregate({
      where: {
        wid,
        createdAt: {
          gte: dateRange ? new Date(dateRange[0]) : undefined,
          lte: dateRange ? new Date(dateRange[1]) : undefined,
        },
      },
      _sum: {
        count: true,
      },
    });

    const totalPageViews = viewpages._sum.count ?? 0;

    const viewsPerVisit = totalPageViews / totalVisits || 0;

    const duration = await prisma.viewData.aggregate({
      _avg: {
        duration: true,
      },
      where: {
        wid,
        createdAt: {
          gte: dateRange ? new Date(dateRange[0]) : undefined,
          lte: dateRange ? new Date(dateRange[1]) : undefined,
        },
      },
    });

    const avgVisitDuration = duration._avg.duration ?? 0;

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

  // mock ips
  // const ips = [
  //   "67.72.64.195",
  //   "127.50.157.183",
  //   "221.133.81.195",
  //   "115.184.179.162",
  //   "72.231.199.205",
  // ];
  // const ip = ips[Math.floor(Math.random() * ips.length)];

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
          device: device.model ?? "",
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
          device: device.model ?? "",
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
      await prisma.viewData.create({
        data: {
          wid,
          sessionId: session.id,
          pathname,
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

router.post("/website", async (req, res, next) => {
  const { domain } = req.body;
  try {
    const website = await prisma.website.create({
      data: {
        domain: domain,
      },
    });

    res.send(website.id);
  } catch (error) {
    next(error);
  }
});

router.get("/website", async (req, res, next) => {
  try {
    const website = await prisma.website.findMany({
      select: {
        id: true,
        domain: true,
      },
    });

    res.send(website);
  } catch (error) {
    next(error);
  }
});

export { router as analyticsRouter };
