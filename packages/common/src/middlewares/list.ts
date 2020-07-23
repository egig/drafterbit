type QueryExt = (p: any) => any
import FilterQuery from "../FilterQuery";

export default function list(typeName: string, queryExt: QueryExt = (q) => q ) {
    return async (ctx: any, next: any) => {

        let page = Number(ctx.query.page) || 1;
        let sortBy = ctx.query.sort_by;
        let sortDir = ctx.query.sort_dir || 'ascend';
        const pageSize = Number(ctx.query.page_size) || 10;

        let filterObj = FilterQuery.fromString(ctx.query.fq).toODMFilters();
        let m = ctx.app.model(typeName);

        let selectFields = ['-__v'];
        ctx.app.plugins().map((m: any) => {
            if (m.selectFields) {
                selectFields = m.selectFields[typeName];
            }
        });

        let [list, count, offset, max] = await m.getList(selectFields, filterObj, sortBy, sortDir,
            page, pageSize, queryExt);

        ctx.set('Content-Range',`resources ${offset}-${offset+max - (max-count)}/${count}`);
        ctx.body = list;
    };
};
