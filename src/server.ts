// create two servers
// one for iframe content, created from twig template - hosted on localhost://9998
// other for iframe, that projects content from localhost:9998 hosted on localhost:4100

import express, { Express, Request, Response } from "express";
import * as livereload from "livereload";
import connectLiveReload from "connect-livereload";
import path from "path";

const twigTemplateDir = path.join(__dirname, 'views');
const iframeTestDir = path.join(__dirname, 'iframe-test');

const liveReloadServer = livereload.createServer({extraExts: ['twig']});
liveReloadServer.watch(twigTemplateDir);
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

const app: Express = express();
const port = 9998;

app.set('views', __dirname + '/views');
app.set('iframe-test', __dirname + '/iframe-test');

app.set('view engine', 'twig');
app.set("twig options", {
  allowAsync: true,
  strict_variables: false
});

app.use(connectLiveReload());

// for editing twig file
app.get("/", (req: Request, res: Response) => {
  res.render('google-widget.html.twig', {
    // todo: create separate files for data used in twig file
    reviews : [],
    config: {businessName: 'Google Recenzije'},
    location: {}
  });
});

// for testing iframe and content from twig file
app.get("/test", (req: Request, res: Response) => {
  res.render('iframe-test.html.twig');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
