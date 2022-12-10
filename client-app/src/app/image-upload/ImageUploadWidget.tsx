import { useEffect, useState } from 'react';
import { Button, Grid, Header } from 'semantic-ui-react';
import ImageCropperWidget from './ImageCropperWidget';
import ImageUpload, { FileType } from './ImageUpload';

interface Props {
  loading: boolean;
  handlePhotoUpload: (file: Blob) => void;
}
export default function ImageUploadWidget({
  loading,
  handlePhotoUpload,
}: Props) {
  const [files, setFiles] = useState<FileType[]>([]);
  const [cropper, setCropper] = useState<Cropper>();

  function submitFile() {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => handlePhotoUpload(blob!));
    }
  }

  useEffect(() => {
    return () => {
      files.forEach(
        (file) => file.preview && URL.revokeObjectURL(file.preview)
      );
    };
  }, [files]);

  return (
    <Grid>
      <Grid.Column width={4}>
        <Header sub color='teal' content='Step 1 - Add Image' />
        <ImageUpload setFiles={setFiles} />
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={5}>
        <Header sub color='teal' content='Step 2 - Resize Image' />
        {files?.length > 0 && (
          <ImageCropperWidget
            image={files[0].preview!}
            setCropper={setCropper}
            preview='.img-preview'
          />
        )}
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={4}>
        <Header sub color='teal' content='Step 3 - Preview & Upload' />
        {files?.length > 0 && (
          <>
            <div
              className='img-preview'
              style={{ minHeight: 200, width: '100%', overflow: 'hidden' }}
            />
            <Button.Group widths={2}>
              <Button
                onClick={submitFile}
                positive
                icon='check'
                loading={loading}
                disabled={loading}
              />
              <Button
                onClick={() => setFiles([])}
                icon='close'
                disabled={loading}
              />
            </Button.Group>
          </>
        )}
      </Grid.Column>
    </Grid>
  );
}
