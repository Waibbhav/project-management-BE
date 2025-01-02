export declare class UtilsService {
    divideArrays(array: any[], no_of_parts: number): Promise<any>;
    numFormatter(numbers: number): string;
    isDirectory(f: any): Promise<boolean>;
    _readdir(filePath: any): any;
    asyncForEach(array: any[], callback: any): Promise<void>;
    inArray(array: any[], ch: any): boolean;
    inArrayObject(rules: any, findBy: any): boolean;
    objectKeyByValue(obj: any, val: any): [string, unknown];
    toThousands(n: number): string;
    formatDollar(num: any): string;
    clone(copyobj: any): any;
    valEmail(email: string): boolean;
    safeparse(jsonString: string, def: any): any;
    safeParseJson(jsonString: string, def: any): any;
    evalJSON(jsonString: string): any;
    toObjectId(str: any): boolean;
    orderNumber(): string;
    betweenRandomNumber(min: number, max: number): number;
    isProductAttribute(array: any[], ch: any): any[];
    ifBlankThenNA(value: any): string;
    getKeyS3KeyUrl(str: string, to: string): string;
    paginatedData(array: any[], page_size: number, page_number: number): any[];
    getNamesFromBody(body: any): any;
}
