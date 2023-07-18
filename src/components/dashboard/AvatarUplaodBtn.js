import { useState } from 'react';
import { Alert, Button, Modal } from 'rsuite';
import ModalBody from 'rsuite/lib/Modal/ModalBody';
import ModalFooter from 'rsuite/lib/Modal/ModalFooter';
import ModalHeader from 'rsuite/lib/Modal/ModalHeader';
import { useModalState } from '../../misc/custom-hooks';
import ModalTitle from 'rsuite/lib/Modal/ModalTitle';
import AvatarEditor from 'react-avatar-editor';

const fileInputTypes = '.png, .jpeg, .jpg, .avif';
const acceptedFileTypes = [
  'image/png',
  'image/jpeg',
  'image/pjpeg',
  'image/avif',
];
const isValidFile = file => acceptedFileTypes.includes(file.type);
const AvatarUplaodBtn = () => {
  const [img, setImg] = useState(null);
  const { isOpen, open, close } = useModalState();

  const onFileInputChanged = ev => {
    const currFiles = ev.target.files;
    if (currFiles.length === 1) {
      const file = currFiles[0];
      if (isValidFile(file)) {
        setImg(file);
        open();
      } else {
        Alert.warning(`Wrong file type ${file.type}`, 4000);
      }
    }
  };
  return (
    <div className="mt-3 text-center">
      <div>
        <label
          htmlFor="avatar-upload"
          className="d-block cursor-pointer padded"
        >
          Select new Avatar
          <input
            id="avatar-upload"
            type="file"
            className="d-none"
            accept={fileInputTypes}
            onChange={onFileInputChanged}
          />
        </label>
        <Modal show={isOpen} onHide={close}>
          <ModalTitle>Adjust and upload new Avatar</ModalTitle>
          <ModalHeader></ModalHeader>
          <ModalBody>
            <div className="d-flex justify-content-center align-item-center h-100">
              {img && (
                <AvatarEditor
                  image={img}
                  width={200}
                  height={200}
                  border={10}
                  borderRadius={100}
                />
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button block appearance="ghost">
              upload new avatar
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
};

export default AvatarUplaodBtn;
