import React from 'react';
import { Tag, Input, Tooltip, Form, Select, Button } from 'antd';
import { PlusOutlined, FilterFilled, CloseCircleOutlined } from '@ant-design/icons';

class TableFilter extends React.Component {
    state = {
        filters: [],
        inputVisible: false,
    };

    formRef = React.createRef();
    inputRef = React.createRef();

    handleClose = removedFilter => {
        const filters = this.state.filters.filter(f => f.key !== removedFilter.key);
        this.setState({ filters });
    };

    showInput = () => {
        this.setState({ inputVisible: true });
    };

    handleInputChange = e => {
        this.setState({ inputValue: e.target.value });
    };

    handleInputConfirm = (f) => {
        let { filters } = this.state;
        filters.push(f);
        this.setState({
            filters,
            inputVisible: false,
        }, () => {
            this.props.onApplyFilters(filters)
        });
    };

    handleEditInputChange = e => {
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

    saveInputRef = input => {
        this.input = input;
    };

    saveEditInputRef = input => {
        this.editInput = input;
    };

    render() {
        const { tags, filters, inputVisible, inputValue, editInputIndex, editInputValue } = this.state;
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
                                        this.setState({ editInputIndex: index, editInputValue: tag }, () => {
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
                        <Input.Group compact ref={this.inputRef} >
                            <Form.Item noStyle name="key">
                                <Select showSearch style={{minWidth: "120px"}}>
                                    {this.props.columns.map((c,i) => {
                                        return <Select.Option key={i} value={c.dataIndex}>{c.title}</Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item noStyle name="op">
                                <Select>
                                    {["=", "=~", ">", "<"].map(op => {
                                        return <Select.Option value={op}>{op}</Select.Option>
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
                                        console.log(e);
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