"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const pipes_1 = require("@nestjs/common/pipes");
const swagger_1 = require("@nestjs/swagger");
const helpers_1 = require("./helpers");
const onError = (error) => {
    const port = process.env.PORT;
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
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
async function main() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        global.moment = require("moment");
        global._ = require("underscore");
        global.project_description = process.env.PROJECT_DESCRIPTION;
        global.project_name = process.env.PROJECT_NAME;
        global.layout_dir = __dirname;
        global.utils = new helpers_1.UtilsService();
        app.enableCors({
            origin: "*",
            methods: "GET,POST,PUT,DELETE",
            allowedHeaders: "*",
            credentials: true,
        });
        app.use(compression());
        app.use(session({
            secret: "nestjs@secret@#",
            resave: true,
            saveUninitialized: true,
        }));
        app.use(cookieParser());
        app.use(flash());
        app.useStaticAssets((0, path_1.join)(__dirname, "..", "public"));
        app.setBaseViewsDir((0, path_1.join)(__dirname, "..", "views", "modules"));
        app.engine("ejs", require("ejs-locals"));
        app.set("view engine", "ejs");
        app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Cache-Control", "private, no-cache, max-age=3600");
            res.header("Expires", "-1");
            res.header("Pragma", "no-cache");
            res.locals.messages = req.flash();
            req.session["token"] &&
                req.session["token"] != null &&
                (req.headers["token"] = req.session["token"]);
            req.headers["x-access-token"] &&
                req.headers["x-access-token"] != null &&
                (req.headers["token"] = req.headers["x-access-token"]);
            next();
        });
        app.useGlobalPipes(new pipes_1.ValidationPipe({ whitelist: true }));
        const config = new swagger_1.DocumentBuilder()
            .setTitle(process.env.PROJECT_NAME + " APIDOC")
            .setDescription(process.env.PROJECT_NAME + " API Documentations")
            .setVersion("0.0.1")
            .addServer(process.env.DEVELOPMENT_SERVER_BASE_URL, "Use this for development purpose on local machines.")
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup("apidoc", app, document);
        await app.listen(process.env.PORT);
        console.log("Server started on port", process.env.PORT);
    }
    catch (error) {
        console.error(error);
        onError(error);
    }
}
main();
//# sourceMappingURL=main.js.map