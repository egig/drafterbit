import React from 'react';
import { Tag, Input, Tooltip, Form, Select, Button } from 'antd';
import {
    PlusOutlined,
    FilterFilled,
    CloseCircleOutlined
} from '@ant-design/icons';

type Props = {
    onApplyFilters: any
    columns: any
}

type State = {
    filters: any[],
    inputVisible: boolean
    inputValue: any
    editInputValue: any
    tags: any
    editInputIndex: number
}

class TableFilter extends React.Component<Props, State> {
    state: State = {
        filters: [],
        inputVisible: false,
        inputValue: null,
        editInputValue: null,
        tags: null,
        editInputIndex: 0
    };

    input: any = null;
    editInput: any = null;

    formRef: React.RefObject<any> = React.createRef();

    handleClose = (removedFilter: any) => {
        const filters = this.state.filters.filter((f: any) => f.key !== removedFilter.key);
        this.setState({ filters });
    };

    showInput = () => {
        this.setState({ inputVisible: true });
    };

    handleInputChange = (e: any) => {
        this.setState({ inputValue: e.target.value });
    };

    handleInputConfirm = (f: any) => {
        let { filters } = this.state;
        filters.push(f);
        this.setState({
            filters,
            inputVisible: false,
        }, () => {
            this.props.onApplyFilters(filters)
        });
    };

    handleEditInputChange = (e: any) => {
        this.setState({ editInputValue: e.target.value });
    };

    handleEditInputConfirm = () => {
        this.setState(({ tags, editInputIndex, editInputValue }) => {
            const newTags = [...tags];
            newTags[editInputIndex] = editInputValue;

            return {
                tags: newTags,
                editInputIndex: -1,
                editInputValue: '',
            };
        });
    };

    saveInputRef = (input: any) => {
        this.input = input;
    };

    saveEditInputRef = (input: any) => {
        this.editInput = input;
    };

    render() {
        const { tags, filters, inputVisible, inputValue, editInputIndex, editInputValue } = this.state;
        // @ts-ignore
        return (
            <>
                <FilterFilled/>
                <span style={{marginLeft:"6px"}}/>

                {filters.map((f, index) => {

                    const isLongTag = f.v.length > 20;
                    let v=  isLongTag ? `${f.v.slice(0, 20)}...` : f.v

                    const tagElem = (
                        <Tag
                            key={f.key}
                            closable={true}
                            onClose={() => this.handleClose(f)}
                        >
                            <span
                                onDoubleClick={e => {
                                    if (index !== 0) {
                                        this.setState({ editInputIndex: index, editInputValue: tags }, () => {
                                            this.editInput.focus();
                                        });
                                        e.preventDefault();
                                    }
                                }}
                            >
                                {`${f.key}${f.op}${v}`}
                            </span>
                        </Tag>
                    );
                    return isLongTag ? (
                        <Tooltip title={f.value} key={f.key}>
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
                              v:""
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
                                    {["=", "=~", ">", "<"].map((op,i) => {
                                        return <Select.Option key={i} value={op}>{op}</Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item noStyle name="v">
                                <Input
                                    style={{ width: '100px' }}
                                    onPressEnter={e => {
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
                    <Tag className="site-tag-plus" onClick={this.showInput}>
                        <PlusOutlined /> New Filter
                    </Tag>
                )}
            </>
        );
    }
}

export default TableFilter