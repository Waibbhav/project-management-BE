"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerService = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const Email = require('email-templates');
const nodemailer = require('nodemailer');
let MailerService = class MailerService {
    async sendMail(from, to, subject, tplName, locals) {
        try {
            const templateDir = (0, path_1.join)(__dirname, "../../views/", 'email-templates', tplName + '/html');
            const email = new Email({
                views: {
                    root: templateDir,
                    options: {
                        extension: 'ejs'
                    }
                }
            });
            const getMailBody = await email.render(templateDir, locals);
            if (getMailBody) {
                let options = {
                    from: from,
                    to: to,
                    subject: subject,
                    html: getMailBody
                };
                const _transport = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.MAIL_USERNAME,
                        pass: process.env.MAIL_PASSWORD,
                    }
                });
                let mailresponse = await _transport.sendMail(options);
                if (mailresponse) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
    ;
};
MailerService = __decorate([
    (0, common_1.Injectable)()
], MailerService);
exports.MailerService = MailerService;
//# sourceMappingURL=mailer.helper.js.map