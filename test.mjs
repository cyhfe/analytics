// eslint-disable-next-line @typescript-eslint/no-var-requires
import dayjs from "dayjs";

const data = [
  { createdAt: "2023-12-04T14:50:26.025Z", duration: 5418 },
  { createdAt: "2023-12-04T14:50:26.033Z", duration: 4794 },
  { createdAt: "2023-12-04T14:50:30.882Z", duration: 3495 },
  { createdAt: "2023-12-04T14:50:35.931Z", duration: 3177 },
  { createdAt: "2023-12-04T14:50:49.272Z", duration: 2524 },
  { createdAt: "2023-12-04T14:51:18.527Z", duration: 1528 },
  { createdAt: "2023-12-04T14:51:22.365Z", duration: 2727 },
  { createdAt: "2023-12-04T14:51:29.466Z", duration: 5924 },
  { createdAt: "2023-12-04T14:51:55.779Z", duration: 4986 },
  { createdAt: "2023-12-04T14:51:55.833Z", duration: 111 },
  { createdAt: "2023-12-04T14:51:58.441Z", duration: 1670 },
  { createdAt: "2023-12-04T14:52:04.817Z", duration: 5424 },
  { createdAt: "2023-12-04T14:52:27.964Z", duration: 1666 },
  { createdAt: "2023-12-04T14:53:33.601Z", duration: 912 },
  { createdAt: "2023-12-04T14:53:38.830Z", duration: 4268 },
  { createdAt: "2023-12-04T14:53:43.801Z", duration: 4153 },
  { createdAt: "2023-12-04T14:53:51.160Z", duration: 3876 },
  { createdAt: "2023-12-04T14:54:01.188Z", duration: 9572 },
  { createdAt: "2023-12-04T14:54:03.458Z", duration: 1732 },
  { createdAt: "2023-12-04T14:54:08.289Z", duration: 3740 },
  { createdAt: "2023-12-04T14:54:19.906Z", duration: 10923 },
  { createdAt: "2023-12-04T14:55:30.019Z", duration: 5399 },
  { createdAt: "2023-12-04T14:56:42.842Z", duration: 4162 },
  { createdAt: "2023-12-04T14:56:42.849Z", duration: 822 },
  { createdAt: "2023-12-04T14:56:42.854Z", duration: 814 },
  { createdAt: "2023-12-04T14:56:42.859Z", duration: 3284 },
  { createdAt: "2023-12-04T14:57:54.469Z", duration: 4735 },
  { createdAt: "2023-12-04T14:57:54.472Z", duration: 833 },
  { createdAt: "2023-12-04T14:57:54.475Z", duration: 1060 },
  { createdAt: "2023-12-04T14:57:54.479Z", duration: 2151 },
  { createdAt: "2023-12-04T15:08:33.243Z", duration: 1212 },
  { createdAt: "2023-12-04T15:16:41.643Z", duration: 2136 },
  { createdAt: "2023-12-04T15:28:27.029Z", duration: 646 },
  { createdAt: "2023-12-04T15:30:43.467Z", duration: 1444 },
  { createdAt: "2023-12-04T15:30:50.969Z", duration: 3517 },
  { createdAt: "2023-12-04T15:31:05.930Z", duration: 14598 },
  { createdAt: "2023-12-04T15:31:39.804Z", duration: 26179 },
  { createdAt: "2023-12-04T15:32:16.971Z", duration: 17541 },
  { createdAt: "2023-12-04T15:34:12.696Z", duration: 78147 },
  { createdAt: "2023-12-04T15:37:16.562Z", duration: 140270 },
  { createdAt: "2023-12-04T15:37:20.479Z", duration: 1285 },
  { createdAt: "2023-12-04T15:39:23.589Z", duration: 122264 },
  { createdAt: "2023-12-04T15:48:03.325Z", duration: 504502 },
  { createdAt: "2023-12-04T15:48:07.579Z", duration: 3867 },
];

const date = "2023-12-04T15:48:07.579Z";

const str = dayjs(date).format("YYYY-MM-DD HH:00:00");

const r = new Date(str);
console.log(r);
