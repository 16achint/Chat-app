import { useCrrentRoom } from '../../../context/current.room.context';
import { Button, Modal } from 'rsuite';
import { useModalState } from '../../../misc/custom-hooks';

const RoomInfoBtnModel = () => {
  const { isOpen, close, open } = useModalState();
  const description = useCrrentRoom(v => v.description);
  const name = useCrrentRoom(v => v.name);

  return (
    <>
      <Button appearance="link" className="px-0" onClick={open}>
        Room information
      </Button>
      <Modal show={isOpen} onHide={close}>
        <Modal.Title>About {name}</Modal.Title>
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <h6 className="mb-1">Description</h6>
          <p>{description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button block onClick={close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RoomInfoBtnModel;
