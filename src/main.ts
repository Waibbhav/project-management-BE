import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import * as session from "express-session";
import * as flash from "connect-flash";
import * as cookieParser from "cookie-parser";
import * as compression from "compression";
import { ValidationPipe } from "@nestjs/common/pipes";
import { NextFunction, Request, Response } from "express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { EntityNotFoundExceptionFilter, UtilsService } from "./helpers";

const onError = (error) => {
  const port = process.env.PORT;
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(0);
      break;
    default:
      throw error;
  }
};

declare module "express-serve-static-core" {
  export interface Request {
    flash: any;
  }
}

async function main() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    global.moment = require("moment");
    global._ = require("underscore");
    global.project_description = process.env.PROJECT_DESCRIPTION;
    global.project_name = process.env.PROJECT_NAME;
    global.layout_dir = __dirname;
    global.utils = new UtilsService();

    // Enable CORS for all origins
app.enableCors({
  origin: "*", // Allow all origins
  methods: "GET,POST,PUT,DELETE", // Allow specific methods
  allowedHeaders: "*", // Allow all headers
  credentials: true, // Allow credentials (cookies, etc.)
});

    app.use(compression());
    app.use(
      session({
        secret: "nestjs@secret@#",
        resave: true,
        saveUninitialized: true,
      })
    );
    app.use(cookieParser());
    app.use(flash());
    app.useStaticAssets(join(__dirname, "..", "public"));
    app.setBaseViewsDir(join(__dirname, "..", "views", "modules"));
    app.engine("ejs", require("ejs-locals"));
    app.set("view engine", "ejs");

    app.use(function (req: Request, res: Response, next: NextFunction) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      res.header("Cache-Control", "private, no-cache, max-age=3600");
      res.header("Expires", "-1");
      res.header("Pragma", "no-cache");
      res.locals.messages = req.flash();
      // for Admin Panel
      req.session["token"] &&
        req.session["token"] != null &&
        (req.headers["token"] = req.session["token"]);
      // for webservices
      req.headers["x-access-token"] &&
        req.headers["x-access-token"] != null &&
        (req.headers["token"] = req.headers["x-access-token"]);
      next();
    });

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    const config = new DocumentBuilder()
      .setTitle(process.env.PROJECT_NAME + " APIDOC")
      .setDescription(process.env.PROJECT_NAME + " API Documentations")
      .setVersion("0.0.1")
      .addServer(
        process.env.DEVELOPMENT_SERVER_BASE_URL,
        "Use this for development purpose on local machines."
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("apidoc", app, document);

    await app.listen(process.env.PORT);
    console.log("Server started on port", process.env.PORT);
  } catch (error) {
    console.error(error);
    onError(error);
  }
}

main();
