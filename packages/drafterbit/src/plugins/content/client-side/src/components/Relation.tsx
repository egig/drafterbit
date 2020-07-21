import React, { useContext, useEffect, useState } from 'react';
import { Select } from 'antd';
// @ts-ignore
import DTContext from '@drafterbit/common/client-side/DTContext';
import ClientSide from "../../../../admin/client-side/src/ClientSide";

type Props = {
    multiple: boolean,
    typeName: string,
    value: any,
    onChange: any
}

const Relation = (props: Props) => {

    let {multiple, typeName, value, onChange} = props;

    let [contents, setContents] = useState([]);
    let $dt: ClientSide = useContext(DTContext);
    useEffect(() => {
        $dt.getApiClient().getEntries(typeName)
            .then((res: any) => {
                setContents(res.data);
            });
    }, []);

    const options = contents.map((c: any) => {
        return {
            value: c._id,
            label: c.name,
        }
    });

    let mode:"multiple"|"tags"|undefined =  multiple ? "multiple" : undefined;
    return(
        <Select
            mode={mode}
            style={{ width: '100%' }}
            placeholder="Please select"
            defaultValue={value}
            onChange={onChange}
            options={options}
        />
    )
};

export default Relation;