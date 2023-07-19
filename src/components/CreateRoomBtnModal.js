import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Icon,
  Modal,
  Schema,
} from 'rsuite';
import firebase from 'firebase/app';
import { useModalState } from '../misc/custom-hooks';
import { database } from '../misc/firebase';

const { StringType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired('Chat Name is required'),
  description: StringType().isRequired('description is required'),
});
const INITIAL_FORM = {
  name: '',
  description: '',
};

const CreateRoomBtnModel = () => {
  const { isOpen, open, close } = useModalState();
  const [formValue, setFormValue] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const fromRef = useRef();

  const onFormChange = useCallback(value => {
    setFormValue(value);
  }, []);

  const onSubmit = async () => {
    if (!fromRef.current.check()) {
      return;
    }
    setIsLoading(true);
    const newRoomdata = {
      ...formValue,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
    };
    try {
      await database.ref('rooms').push(newRoomdata);
      setIsLoading(false);
      setFormValue(INITIAL_FORM);
      close();
      Alert.info(`${formValue.name} has been created`, 4000);
    } catch (error) {
      setIsLoading(false);
      Alert.error(error.message, 4000);
    }
  };

  return (
    <div className="mt-1">
      <Button block color="green" onClick={open}>
        <Icon icon="creative" /> create new chat Room
      </Button>

      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>New Chat Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            fluid
            onChange={onFormChange}
            formValue={formValue}
            model={model}
            ref={fromRef}
          >
            <FormGroup>
              <ControlLabel>Room Name</ControlLabel>
              <FormControl name="name" placeholder="Enter chat Room name..." />
            </FormGroup>

            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl
                componentClass="textarea"
                rows={5}
                name="description"
                placeholder="Enter Room Description..."
              />
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            block
            appearance="primary"
            onClick={onSubmit}
            disabled={isLoading}
          >
            Create new chat room
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateRoomBtnModel;
