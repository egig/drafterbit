import FieldType from "./FieldType";
import FilterQuery from "./FilterQuery";
import * as utils from "./utils"

import list from './middlewares/list';
import validateRequest from './middlewares/validateRequest';

import withDrafterbit from "./client-side/withDrafterbit";
import translate from "./client-side/translate";
import handleAxiosError from "./client-side/handleAxiosError";
import * as cookie from "./client-side/cookie";
import TableFilter from "./client-side/TableFilter";
import TablePage from "./client-side/TablePage";
import * as fieldsToSchema from './fieldsToSchema'

let middlewares: any = {
        list,
        validateRequest
};

export {
    FieldType,
    FilterQuery,
    utils,
    withDrafterbit,
    translate,
    handleAxiosError,
    cookie,
    TableFilter,
    TablePage,
    fieldsToSchema,
    middlewares
}
