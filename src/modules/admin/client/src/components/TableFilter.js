import styled from 'styled-components'
import React from 'react'

const Container = styled.div`
    border: 1px solid #ccc;
    border-radius: 2px;
    padding: 5px;
    margin-bottom: 10px;
`;

const ListContainer = styled.div`
    padding: 5px 0;
    border: 1px solid #d1d1d1;
    position: absolute;
    background-color: #ffffff;
`;

const ListItem = styled.div`
  cursor: pointer;
  padding: 5px;
   &:hover {
    background-color: #e1e1e1;
  }
`;

const FilterItemContainer = styled.div`
    display: inline-block;
`;

const FilterItem = styled.div`
    display: inline-block;
    background-color: #e1e1e1;
    font-size: 0.9em;
    border: 1px solid #c1c1c1;
    border-radius: 2px;
    margin-right: 4px;
    padding: 2px 4px;
`;

// TODO clickable effect / inset text shadow
const FilterRemover = styled.span`
    cursor: pointer;
`;

const FilterQInput = styled.input`
    border: none;
    outline: none;
`;

class TableFilter extends React.Component {

    render() {
        let {
            filterObjects
        } = this.props;

        return (
            <Container>
                <FilterItemContainer>
                    {filterObjects.map((o,i) => {
                    return <FilterItem key={i}>{o.k}={o.v} <FilterRemover onClick={e => {
                        this.props.deleteFilter(o.k, o.v);
                    }}>&times;</FilterRemover></FilterItem>
                })}
                </FilterItemContainer>
                <FilterQInput value={this.props.typedQ} type="text" placeholder="Filter" className="" onChange={this.props.onFilterChange} onKeyUp={this.props.onFilterKeyUp}/>
                {this.props.typedQ &&
                <ListContainer>
                    {this.props.columns.map((c,i) => {
                        let fStr = `${c.text}:${this.props.typedQ}`;
                        return <ListItem key={i} onClick={e => {
                            this.props.onApplyFilter(c.text, this.props.typedQ);
                        }}>{fStr}</ListItem>
                    })}
                </ListContainer>
                }
            </Container>
        )
    }
}

TableFilter.defaultProps = {
    typedQ: "",
    columns: [],
    filterObjects: [],
    onApplyFilter: () => {},
    onFilterChange: () => {},
    onFilterKeyUp: () => {},
    deleteFilter: () => {}
};

export default TableFilter