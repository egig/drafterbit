import React from 'react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';
import ApiClient from '../ApiClient';
import withDrafterbit from '@drafterbit/common/client-side/withDrafterbit';

const getColor = (props) => {
    if (props.isDragAccept) {
        return '#00e676';
    }
    if (props.isDragReject) {
        return '#ff1744';
    }
    if (props.isDragActive) {
        return '#2196f3';
    }
    return '#eeeeee';
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${props => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border .24s ease-in-out;
`;

class DropZone extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            files: []
        };
    }

    onDrop = (files) => {
        let client = this.props.drafterbit.getApiClient();
        client.upload(files[0], this.props.path)
            .then(r => {
                this.props.fileDidUpload(r);
            })
    };

    render() {

        return (
            <Dropzone onDrop={this.onDrop}>
                {({getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject}) => (
                    <Container {...getRootProps({isDragActive, isDragAccept, isDragReject})}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop some files here, or click to select files</p>
                    </Container>
                )}
            </Dropzone>
        );
    }
}

export default withDrafterbit(DropZone);