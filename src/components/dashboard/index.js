import { Alert, Button, Divider, Drawer } from 'rsuite';
import { useProfile } from '../../context/Profile.context';
import EditableInput from '../EditableInput';
import { database } from '../../misc/firebase';
import ProviderBlock from './ProviderBlock';
import AvatarUplaodBtn from './AvatarUplaodBtn';
import { getUserUpdates } from '../../misc/helpers';

const Dashboard = ({ onSignOut }) => {
  const { profile } = useProfile();

  const onSave = async newData => {
    // const userNicknameRef = database
    //   .ref(`/profiles/${profile.uid}`)
    //   .child('name');

    try {
      // await userNicknameRef.set(newData);

      const updates = await getUserUpdates(
        profile.uid,
        'name',
        newData,
        database
      );

      console.log('update', updates);

      await database.ref().update(updates); // Error

      Alert.success('Saved Changes', 2000);
    } catch (error) {
      Alert.error(error.message, 2000);
    }
  };
  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Dashboard</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        <h3>Hey, {profile.name}</h3>
        <ProviderBlock />
        <Divider />
        <EditableInput
          name="nickname"
          initialValue={profile.name}
          onSave={onSave}
          label={<h6 className="mb-2">Nickname</h6>}
        />
        <AvatarUplaodBtn />
      </Drawer.Body>
      <Drawer.Footer>
        <Button block color="red" onClick={onSignOut}>
          Sign out
        </Button>
      </Drawer.Footer>
    </>
  );
};

export default Dashboard;
