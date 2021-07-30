import {
  serve,
  ServerRequest,
} from "https://deno.land/std@0.102.0/http/server.ts";

import { Mad } from "./Mad.ts";

export class Server {
  ready = false;
  running = false;
  mad: Mad;
  constructor() {
    this.mad = new Mad();
  }
  private listener = (req: ServerRequest) => {
    //console.log(req);
    const [, symbol, minute] = req.url.split(/\//g);
    //.match(/^\/([^\/]+)\/([0-9]+)$/);
    if (!minute) {
      req.respond({ status: 200, body: "no day specified" });
    }
    const result = this.mad.getMad(symbol, parseInt(minute)) ??
      "invalid day specified";
    console.log(symbol, minute, "-->", result);
    req.respond({ status: 200, body: result });
  };
  init = async (symbols: string[]) => {
    if (this.ready) {
      return;
    }
    await this.mad.init(symbols);
    this.ready = true;
  };
  start = async (port = 8008, symbols: string[] = ["ETHUSDT"]) => {
    await this.init(symbols);
    const server = serve({ port });
    console.log("Now serving on port", port);
    for await (const req of server) {
      this.listener(req);
    }
    console.log("Listening on port", port);
  };
}
