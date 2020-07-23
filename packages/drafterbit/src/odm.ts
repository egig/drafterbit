type QueryExt = (p: any) => any

async function getList(selectFields: any, filterObj: any, sortBy: string, sortDir = "ascend",
                       page = 1, pageSize = 10, queryExt: QueryExt = (q) => q) {
    let offset = (page*pageSize) - pageSize;
    let max = pageSize;

    let sortD = sortDir === 'ascend' ? 1 : -1;

    let sortObj;
    if(!!sortBy && sortBy !== '_id') {
        sortObj = {
            [sortBy]: sortD
        };
    } else {
        sortObj = {'_id': sortD};
    }

    // @ts-ignore
    let query = this.find(filterObj, null, {
        sort: sortObj
    }).select(selectFields).skip(offset).limit(max);
    query = queryExt(query);

    if(!query) {
        throw new Error("queryExt must return query object");
    }

    let list = await query.exec();
    // @ts-ignore
    let count =  await this.find(filterObj).estimatedDocumentCount();
    return [list, count, offset, max]
}

export function getListPlugin(schema: any, option: any) {
    schema.static('getList', getList)
}
