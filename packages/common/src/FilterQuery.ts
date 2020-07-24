declare namespace FilterQuery {
    type Filter= {
        key: string,
        op: string,
        val:string
    }
}

class FilterQuery {
    private filters: FilterQuery.Filter[];

    constructor(filters: FilterQuery.Filter[] = []) {
        this.filters = filters;
    }

    /**
     *
     * @param key
     * @param op
     * @param val
     */
    addFilter(key: string, op: string, val: any) {
        this.filters.push({
            key,
            op,
            val
        });
    }

    /**
     *
     * @param key
     * @param op
     * @param val
     */
    removeFilter(key: string, op: string, val: any) {
        this.filters = this.filters.filter((f: any) => {
            return !(f.key === key && f.val === val && f.op === op);
        });
    }

    /**
     *
     */
    getFilters(): FilterQuery.Filter[] {
        return this.filters;
    }

    /**
     *
     */
    toMap() {
        return this.filters.reduce((acc: any, curr: FilterQuery.Filter) => {
            if (typeof acc[curr.key] !== 'undefined' ) {
                acc[curr.key] = [acc[curr.key]];
                acc[curr.key].push({ op: curr.op, val: curr.val});
            } else {
                acc[curr.key] = {op: curr.op, val: curr.val};
            }

            return acc;
        }, {});
    }


    /**
     *
     */
    toString(): string {
        let m = this.toMap();
        return Object.keys(m).map(k => {
            let v = m[k];
            let opV = `${v.op}${v.val}`;
            if (Array.isArray(v)) {
                opV = v.map(val => (`${val.op}${val.val}`)).join(',');
            }
            return `${k}:${opV}`;
        }).join(';');
    }

    /**
     *
     * @param fqStr
     */
    static fromString(fqStr: string){

        if (!fqStr) {
            return new FilterQuery();
        }

        let fqObjs: FilterQuery.Filter[] = [];
        fqStr.split(';').map((s: string) => {
            let t = s.split(':');
            let key = t[0];
            let vList = t[1].split(',');
            vList.map((val:string) => {

                let op: string = "=";
                const regex = /^=(~|>|<)*/gm;
                let matches: string[] | null = val.match(regex);
                if (matches != null) {
                    op = matches[0];
                    val = val.replace(regex, "").trim();
                }

                let f = {
                    key,
                    op,
                    val
                };

                fqObjs.push(f);
            });
        });
        return new FilterQuery(fqObjs);
    }

    toODMFilters() {
        let odmFilter: any = {};
        let m = this.toMap();
        Object.keys(m).map(k => {
            let v = m[k];
            if (Array.isArray(v)) {
                odmFilter["$or"] = v.map(val => {
                    return {
                        [k]: FilterQuery._odmFilter(val.op, val.val)
                    }
                });
            } else {
                odmFilter[k] = FilterQuery._odmFilter(v.op, v.val);
            }
        });
        return odmFilter;
    }

    private static _odmFilter(opSym: string, val: string|number) {
        // @ts-ignore;
        if (!isNaN(val)) {
            val = Number(val);
        }

        let d: any = {
            "=": "$eq",
            "=>": "$gt",
            "=<": "$lt",
            "=~": "$regex",
        };

        let op: any = d[opSym];
        if (op == "$regex") {
            val = `.*${val}.*`
        }

        return {
            [op]: val
        }
    }

    pop() {
        this.filters.pop();
    }
}

export default FilterQuery;