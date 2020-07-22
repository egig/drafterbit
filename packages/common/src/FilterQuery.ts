class FilterQuery {
    private filters: any;

    constructor(filters: Object[] = []) {
        this.filters = filters;
    }

    addFilter(k: string, v: any) {
        this.filters.push({k,v});
    }

    removeFilter(k: string, v: any) {
        this.filters = this.filters.filter((f: any) => {
            return !(f.k === k && f.v === v);
        });
    }

    getFilters() {
        return this.filters;
    }

    toMap() {
        return this.filters.reduce((acc: any, curr: any) => {
            if (typeof acc[curr.k] !== 'undefined' ) {
                acc[curr.k] = [acc[curr.k]];
                acc[curr.k].push(curr.v);
            } else {
                acc[curr.k] = curr.v;
            }

            return acc;
        }, {});
    }

    toString() {
        let m = this.toMap();
        return Object.keys(m).map(k => {
            let v = m[k];
            if (Array.isArray(v)) {
                v = v.join(',');
            }
            return `${k}:${v}`;
        }).join(';');
    }

    static fromString(fqStr: string = ''){

        if (!fqStr) {
            return new FilterQuery();
        }

        let fqObjs: Object[] = [];
        fqStr.split(';').map((s) => {
            let t = s.split(':');
            let k = t[0];
            let vList = t[1].split(',');
            vList.map(v => {
                fqObjs.push({ k, v });
            });
        });
        return new FilterQuery(fqObjs);
    }

    pop() {
        this.filters.pop();
    }
}

export default FilterQuery;