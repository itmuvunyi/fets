import "server-only";

import {
  createTRPCClient,
  loggerLink,
  unstable_httpBatchStreamLink,
} from "@trpc/client";
import { cookies } from "next/headers";
import SuperJSON from "superjson";
import { type AppRouter } from "@/server/api/root";
import { getUrl } from "./shared";

export const api = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === "development" ||
        (op.direction === "down" && op.result instanceof Error),
    }),
    unstable_httpBatchStreamLink({
      transformer: SuperJSON,
      url: getUrl(),
      headers: () => {
        const h = new Headers(cookies().getAll().reduce((acc, cookie) => {
          acc.append("cookie", `${cookie.name}=${cookie.value}`);
          return acc;
        }, new Headers()));
        h.set("x-trpc-source", "rsc");
        return h;
      },
    }),
  ],
});
