import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

interface Props {
  image: string;
  preview: string;
  setCropper: (cropper: Cropper) => void;
}
export default function ImageCropperWidget({
  image,
  preview,
  setCropper,
}: Props) {
  return (
    <Cropper
      src={image}
      style={{ height: 200, width: '100%' }}
      initialAspectRatio={1}
      aspectRatio={1}
      preview={preview}
      guides={false}
      viewMode={1}
      autoCropArea={1}
      background={false}
      onInitialized={(cropper) => setCropper(cropper)}
    />
  );
}
