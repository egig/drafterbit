class FilterQuery {
    constructor(filters = []) {
        this.filters = filters;
    }

    addFilter(k, v) {
        this.filters.push({k,v});
    }

    removeFilter(k, v) {
        this.filters = this.filters.filter(f => {
            return !(f.k === k && f.v === v);
        });
    }

    getFilters() {
        return this.filters;
    }

    toMap() {
        return this.filters.reduce((acc, curr) => {
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

    static fromString(fqStr = ''){

        if (!fqStr) {
            return new FilterQuery();
        }

        let fqObjs = [];
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

module.exports = FilterQuery;