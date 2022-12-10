import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Header, Icon } from 'semantic-ui-react';

export interface FileType extends File {
  preview?: string;
}

const dzStyles = {
  border: 'dashed 3px #eee',
  borderColor: '#eee',
  borderRadius: '5px',
  paddingTop: '30px',
  textAlign: 'center' as 'center',
  height: 200,
};

const dzActive = {
  borderColor: 'green',
};

interface Props {
  setFiles: (files: FileType[]) => void;
}
export default function ImageUpload({ setFiles }: Props) {
  const onDrop = useCallback(
    (acceptedFiles: FileType[]) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setFiles]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={isDragActive ? { ...dzStyles, ...dzActive } : dzStyles}
    >
      <input {...getInputProps()} />
      <Icon name='upload' size='huge' />
      <Header content='Drop image here' />
    </div>
  );
}
