import React from 'react';
import { Tag, Input, Tooltip, Form, Select, Button } from 'antd';
import {
    PlusOutlined,
    FilterFilled,
    CloseCircleOutlined
} from '@ant-design/icons';
import FilterQuery from "../../FilterQuery";
import FieldType from "../../FieldType";


type Props = {
    onApplyFilters: (filters: FilterQuery.Filter[]) => Promise<any> | undefined
    onDeleteFilter: (filters: FilterQuery.Filter) => Promise<any> | undefined
    columns: any
}

type State = {
    filters: FilterQuery.Filter[],
    inputVisible: boolean,
    operators: any[];
}

class TableFilter extends React.Component<Props, State> {
    state: State = {
        filters: [],
        inputVisible: false,
        operators: [{sym: "="}]
    };

    input: any = null;

    formRef: React.RefObject<any> = React.createRef();

    handleClose = (removedFilter: FilterQuery.Filter) => {
        const filters = this.state.filters.filter((f: FilterQuery.Filter) => {
            return (f.key !== removedFilter.key) && (f.op !== removedFilter.op) &&
                (f.val !== removedFilter.val)
        });
        this.setState({ filters }, () => {
            console.log(filters);
            this.props.onDeleteFilter(removedFilter);
        });
    };

    showInput = () => {
        this.setState({ inputVisible: true });
    };

    handleInputConfirm = (f: any) => {
        let { filters } = this.state;
        filters.push(f);
        this.setState({
            filters,
            inputVisible: false,
        }, () => {
            return this.props.onApplyFilters(filters)
        });
    };

    render() {
        const {filters, inputVisible} = this.state;
        let opMap = this.props.columns.reduce((acc: any, curr: any) => {
            acc[curr.dataIndex] = curr.dataType;
            return acc;
        }, {});

        // @ts-ignore
        return (
            <>
                <FilterFilled/>
                <span style={{marginLeft:"6px"}}/>

                {filters.map((f: FilterQuery.Filter, index: number) => {
                    const isLongTag = f.val.length > 20;
                    let v=  isLongTag ? `${f.val.slice(0, 20)}...` : f.val;

                    const tagElem = (
                        <Tag key={f.key}
                             closable={true}
                             onClose={() => this.handleClose(f)}>
                            <span> {`${f.key}${f.op}${v}`} </span>
                        </Tag>
                    );
                    return isLongTag ? (
                        <Tooltip title={f.val} key={f.key}>
                            {tagElem}
                        </Tooltip>
                    ) : (
                        tagElem
                    );
                })}
                {inputVisible && (
                    <Form size="small" ref={this.formRef}
                          style={{display:"inline-block"}}
                          layout="inline"
                          initialValues={{
                              key: this.props.columns[0].dataIndex,
                              op:"=",
                              val:""
                          }}
                          onValuesChange={(changedValues, values) => {
                              if (typeof changedValues.key !== 'undefined') {
                                  this.setState({
                                      operators: TableFilter.getOp(opMap[changedValues.key])
                                  })
                              }
                          }}
                          onFinish={values => {
                              this.handleInputConfirm(values)
                          }}>
                        <Input.Group compact >
                            <Form.Item noStyle name="key">
                                <Select showSearch style={{minWidth: "120px"}}>
                                    {this.props.columns.map((c: any,i: number) => {
                                        return <Select.Option key={i} value={c.dataIndex}>{c.title}</Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item noStyle name="op">
                                <Select>
                                    {this.state.operators.map((op,i) => {
                                        return <Select.Option key={i} value={op.sym}>{op.sym}</Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item noStyle name="val">
                                <Input
                                    style={{ width: '100px' }}
                                    onPressEnter={() => {
                                        this.formRef.current.submit()
                                    }}
                                    onKeyDown={e => {
                                        // ESC
                                        if (e.keyCode === 27) {
                                            this.setState({inputVisible: false})
                                        }
                                    }}
                                    suffix={<CloseCircleOutlined onClick={e => {
                                        this.setState({inputVisible: false})
                                    }}/>}
                                />
                            </Form.Item>
                        </Input.Group>
                    </Form>
                )}
                {!inputVisible && (
                    <Tag style={{border: "1px dashed #e1e1e1"}} className="site-tag-plus" onClick={this.showInput}>
                        <PlusOutlined /> New Filter
                    </Tag>
                )}
            </>
        );
    }

    static getOp(typeName: string): any[] {
        let m: any = FieldType.asObject();
        return m[typeName].op;
    }
}

export default TableFilter