import { Injectable } from "@nestjs/common";
import { readdir, stat } from "fs";
import { join } from "path";
import { promisify } from "util";
import * as _ from 'underscore';

@Injectable()
export class UtilsService {
    async divideArrays (array: any[], no_of_parts: number): Promise<any> {
        try {
            let finalarr = splitNParts(array);

            function splitNParts(array: any[]) {
                let num = array.length;
                let parts = +no_of_parts;
                let numbrs = [];
                let sumParts = 0;
                const val = Math.round(num / parts);
                for (let i = 0; i < parts; i++) {
                    if ((parts - 1) == i) {
                        numbrs.push(Math.round(num - sumParts));
                    } else {
                        sumParts += val;
                        numbrs.push(val);
                    }
                }
    
                let finalOBJ = {};
                let tot = 0;
    
                for (let x = 0; x<numbrs.length;x++) {
                    tot += numbrs[x];
                    let prev = numbrs[x - 1];
                    finalOBJ['arr_' + (x + 1).toString()] = array.slice((x==0?0:(x * prev)), tot);
                }
                return finalOBJ;
            }

            return finalarr;
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    numFormatter(numbers: number) {
		// Thousand(K), Million(M), Billion(B), Trillion(T), Peta(P), Exa(E)
		const num = Number(numbers);
		const si = [
		  { value: 1, symbol: '' }, // if value < 1000, nothing to do
		  { value: 1E3, symbol: 'k' }, // convert to K for number from > 1000 < 1 million 
		  { value: 1E6, symbol: 'm' }, // convert to M for number from > 1 million 
		  { value: 1E9, symbol: 'B' }, // convert to B for number greater than 1 Billion
		  { value: 1E12, symbol: 'T' }, // convert to T for number greater than 1 Trillion
		//   { value: 1E15, symbol: 'P' }, // convert to P for number greater than 1 Peta
		//   { value: 1E18, symbol: 'E' } // convert to E for number greater than 1 Exa
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

    async isDirectory(f: any) {
		return (await promisify(stat)(f)).isDirectory();
	}

	async _readdir(filePath: any) {
		const files = await Promise.all((await promisify(readdir)(filePath)).map(async f => {
			const fullPath = join(filePath, f);
			return (await this.isDirectory(fullPath)) ? this._readdir(fullPath) : fullPath;
		}))
	
		return _.flatten(files);
	}
	
	async asyncForEach(array: any[], callback: any) {
		for (let index = 0; index < array.length; index++) {
			await callback(array[index], index, array);
		}
	}

	inArray(array: any[], ch: any) {
		let obj = _.find(array, (obj) => (obj == ch.toString()))
		if (obj != undefined) {
			return true;
		} else {
			return false;
		}
	}

	inArrayObject(rules:any, findBy:any) {
		const _rules = _.findWhere(rules, findBy);
		if (!_rules) {
			return false;
		} else {
			return true;
		}
	}

	objectKeyByValue(obj:any, val:any) {
		return Object.entries(obj).find(i => i[1] === val);
	}

	toThousands(n:number) {
		return n.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	formatDollar(num:any) {
		num = Number(num);
		const p = num.toFixed(2).split(".");
		return "$" + p[0].split("").reverse().reduce((acc:any, num:any, i:any) => {
			return num == "-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
		}, "") + "." + p[1];
	}

	clone(copyobj:any){
		try {
			let tmpobj = JSON.stringify(copyobj);
			return JSON.parse(tmpobj);
		} catch (e) {
			return {};
		}
	}

	valEmail(email:string) {
		let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}

	safeparse(jsonString:string, def:any) {
		return this.safeParseJson(jsonString, def);
	}

	safeParseJson(jsonString:string, def:any) {
		try {
			let o = JSON.parse(jsonString);
			if (o) {
				return o;
			}
		} catch (e) {
			console.error(e);
		}
		return def;
	}

	evalJSON(jsonString:string) {
		try {
			let o = JSON.parse(JSON.stringify(jsonString));
			if (o && typeof o === "object") {
				return o;
			}
		} catch (e) { console.error(e); }
		return false;
	}

	toObjectId(str) {
		if (typeof str === 'string') {
			return /^[a-f\d]{24}$/i.test(str);
		} else if (Array.isArray(str)) {
			return str.every(arrStr => /^[a-f\d]{24}$/i.test(arrStr));
		}
		return false;
	}

	orderNumber() {
		let now = Date.now().toString() // '1492341545873'
		// pad with extra random digit
		now += now + Math.floor(Math.random() * 10)
		// format
		return ['ORD', now.slice(0, 14)].join('-')
	}

	betweenRandomNumber(min:number, max:number) {  
		return Math.floor(
		  Math.random() * (max - min + 1) + min
		)
	}

	isProductAttribute(array:any[], ch:any) {
		const obj = _.filter(array, (obj) => { return obj.attribute_id.toString() == ch.toString() })
		return obj;
	}

	ifBlankThenNA(value:any) {
		return (typeof value === 'string' && value) ? value : 'NA';
	}

	getKeyS3KeyUrl(str:string, to:string) {
		return str.substr(str.indexOf(to) + 0);
	}

	paginatedData(array:any[], page_size:number, page_number:number) {
		return array.slice(page_number * page_size, page_number * page_size + page_size);
	}

	getNamesFromBody(body:any) {
		if (body.fullName) {
			const splittedVal = body.fullName.split(' ');
			body.first_name = splittedVal[0];
			body.last_name = splittedVal.length>1?splittedVal[splittedVal.length - 1]:'';
		}
		if (body.first_name && body.last_name) {
			body.fullName = (body.first_name + ' ' + body.last_name).trim();
		}
		return body;
	}
}