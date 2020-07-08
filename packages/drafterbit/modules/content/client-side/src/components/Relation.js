import React, { useContext, useEffect, useState } from 'react';
import { Select } from 'antd';
import DTContext from '@drafterbit/common/client-side/DTContext';

const Relation = ({multiple, typeName, value, onChange}) => {

    let [contents, setContents] = useState([]);
    let $dt = useContext(DTContext);
    useEffect(() => {
        $dt.getApiClient().getEntries(typeName)
            .then((res) => {
                setContents(res.data);
            });
    }, []);

    const options = contents.map(c => {
        return {
            value: c._id,
            label: c.name,
        }
    });

    let mode =  multiple ? "multiple" : null;
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