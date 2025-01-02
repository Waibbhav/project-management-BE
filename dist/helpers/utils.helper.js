"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilsService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
const util_1 = require("util");
const _ = require("underscore");
let UtilsService = class UtilsService {
    async divideArrays(array, no_of_parts) {
        try {
            let finalarr = splitNParts(array);
            function splitNParts(array) {
                let num = array.length;
                let parts = +no_of_parts;
                let numbrs = [];
                let sumParts = 0;
                const val = Math.round(num / parts);
                for (let i = 0; i < parts; i++) {
                    if ((parts - 1) == i) {
                        numbrs.push(Math.round(num - sumParts));
                    }
                    else {
                        sumParts += val;
                        numbrs.push(val);
                    }
                }
                let finalOBJ = {};
                let tot = 0;
                for (let x = 0; x < numbrs.length; x++) {
                    tot += numbrs[x];
                    let prev = numbrs[x - 1];
                    finalOBJ['arr_' + (x + 1).toString()] = array.slice((x == 0 ? 0 : (x * prev)), tot);
                }
                return finalOBJ;
            }
            return finalarr;
        }
        catch (e) {
            console.error(e);
            return [];
        }
    }
    numFormatter(numbers) {
        const num = Number(numbers);
        const si = [
            { value: 1, symbol: '' },
            { value: 1E3, symbol: 'k' },
            { value: 1E6, symbol: 'm' },
            { value: 1E9, symbol: 'B' },
            { value: 1E12, symbol: 'T' },
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        let i = 0;
        for (i = si.length - 1; i > 0; i--) {
            if (num >= si[i].value) {
                break;
            }
        }
        return (num / si[i].value).toFixed(2).replace(rx, '$1') + si[i].symbol;
    }
    async isDirectory(f) {
        return (await (0, util_1.promisify)(fs_1.stat)(f)).isDirectory();
    }
    async _readdir(filePath) {
        const files = await Promise.all((await (0, util_1.promisify)(fs_1.readdir)(filePath)).map(async (f) => {
            const fullPath = (0, path_1.join)(filePath, f);
            return (await this.isDirectory(fullPath)) ? this._readdir(fullPath) : fullPath;
        }));
        return _.flatten(files);
    }
    async asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }
    inArray(array, ch) {
        let obj = _.find(array, (obj) => (obj == ch.toString()));
        if (obj != undefined) {
            return true;
        }
        else {
            return false;
        }
    }
    inArrayObject(rules, findBy) {
        const _rules = _.findWhere(rules, findBy);
        if (!_rules) {
            return false;
        }
        else {
            return true;
        }
    }
    objectKeyByValue(obj, val) {
        return Object.entries(obj).find(i => i[1] === val);
    }
    toThousands(n) {
        return n.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    formatDollar(num) {
        num = Number(num);
        const p = num.toFixed(2).split(".");
        return "$" + p[0].split("").reverse().reduce((acc, num, i) => {
            return num == "-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
        }, "") + "." + p[1];
    }
    clone(copyobj) {
        try {
            let tmpobj = JSON.stringify(copyobj);
            return JSON.parse(tmpobj);
        }
        catch (e) {
            return {};
        }
    }
    valEmail(email) {
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    safeparse(jsonString, def) {
        return this.safeParseJson(jsonString, def);
    }
    safeParseJson(jsonString, def) {
        try {
            let o = JSON.parse(jsonString);
            if (o) {
                return o;
            }
        }
        catch (e) {
            console.error(e);
        }
        return def;
    }
    evalJSON(jsonString) {
        try {
            let o = JSON.parse(JSON.stringify(jsonString));
            if (o && typeof o === "object") {
                return o;
            }
        }
        catch (e) {
            console.error(e);
        }
        return false;
    }
    toObjectId(str) {
        if (typeof str === 'string') {
            return /^[a-f\d]{24}$/i.test(str);
        }
        else if (Array.isArray(str)) {
            return str.every(arrStr => /^[a-f\d]{24}$/i.test(arrStr));
        }
        return false;
    }
    orderNumber() {
        let now = Date.now().toString();
        now += now + Math.floor(Math.random() * 10);
        return ['ORD', now.slice(0, 14)].join('-');
    }
    betweenRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    isProductAttribute(array, ch) {
        const obj = _.filter(array, (obj) => { return obj.attribute_id.toString() == ch.toString(); });
        return obj;
    }
    ifBlankThenNA(value) {
        return (typeof value === 'string' && value) ? value : 'NA';
    }
    getKeyS3KeyUrl(str, to) {
        return str.substr(str.indexOf(to) + 0);
    }
    paginatedData(array, page_size, page_number) {
        return array.slice(page_number * page_size, page_number * page_size + page_size);
    }
    getNamesFromBody(body) {
        if (body.fullName) {
            const splittedVal = body.fullName.split(' ');
            body.first_name = splittedVal[0];
            body.last_name = splittedVal.length > 1 ? splittedVal[splittedVal.length - 1] : '';
        }
        if (body.first_name && body.last_name) {
            body.fullName = (body.first_name + ' ' + body.last_name).trim();
        }
        return body;
    }
};
UtilsService = __decorate([
    (0, common_1.Injectable)()
], UtilsService);
exports.UtilsService = UtilsService;
//# sourceMappingURL=utils.helper.js.map