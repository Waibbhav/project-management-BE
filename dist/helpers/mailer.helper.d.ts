export declare class MailerService {
    sendMail(from: string, to: string, subject: string, tplName: string, locals: any): Promise<boolean>;
}
