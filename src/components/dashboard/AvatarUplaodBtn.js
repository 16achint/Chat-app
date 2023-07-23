import { useState, useRef } from 'react';
import { Alert, Button, Modal } from 'rsuite';
import ModalBody from 'rsuite/lib/Modal/ModalBody';
import ModalFooter from 'rsuite/lib/Modal/ModalFooter';
import ModalHeader from 'rsuite/lib/Modal/ModalHeader';
import { useModalState } from '../../misc/custom-hooks';
import ModalTitle from 'rsuite/lib/Modal/ModalTitle';
import AvatarEditor from 'react-avatar-editor';
import { useProfile } from '../../context/Profile.context';
import { database, storage } from '../../misc/firebase';
import ProfileAvatar from '../ProfileAvatar';
import { getUserUpdates } from '../../misc/helpers';

const fileInputTypes = '.png, .jpeg, .jpg, .avif';
const acceptedFileTypes = [
  'image/png',
  'image/jpeg',
  'image/pjpeg',
  'image/avif',
];
const isValidFile = file => acceptedFileTypes.includes(file.type);

const getBlob = canvas => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('File Process Error'));
      }
    });
  });
};

const AvatarUplaodBtn = () => {
  const [img, setImg] = useState(null);
  const { profile } = useProfile();
  const { isOpen, open, close } = useModalState();
  const [isLoading, setIsLoading] = useState(false);
  const avatarEditorRef = useRef();

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

  const onUploadClick = async () => {
    const canvas = avatarEditorRef.current.getImageScaledToCanvas();

    setIsLoading(true);
    try {
      const blob = await getBlob(canvas);
      const avatarFileRef = storage
        .ref(`/profile/${profile.uid}`)
        .child('avatar');
      const uploadAvatarResult = await avatarFileRef.put(blob, {
        cacheControl: `public,max-age=${3600 * 24 * 3}`,
      });
      const downloadUrl = await uploadAvatarResult.ref.getDownloadURL();

      const updates = await getUserUpdates(
        profile.uid,
        'avatar',
        downloadUrl,
        database
      );
      await database.ref().update(updates);
      setIsLoading(false);
      Alert.info('Avatar has been uploaded', 2000);
    } catch (error) {
      setIsLoading(false);
      Alert.error(error.message, 10000);
    }
  };
  return (
    <div className="mt-3 text-center">
      <ProfileAvatar
        src={profile.avatar}
        name={profile.name}
        className="width-200 height-200 img-fullsize font-huge"
      />
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
                  ref={avatarEditorRef}
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
            <Button
              block
              appearance="ghost"
              onClick={onUploadClick}
              disabled={isLoading}
            >
              upload new avatar
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
};

export default AvatarUplaodBtn;
