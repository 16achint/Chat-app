import { useState } from 'react';
import { auth } from '../../misc/firebase';
import { Alert, Button, Icon, Tag } from 'rsuite';
import firebase from 'firebase';

const ProviderBlock = () => {
  const [isConnected, setIsconnected] = useState({
    'google.com': auth.currentUser.providerData.some(
      data => data.providerId === 'google.com'
    ),
    'facebook.com': auth.currentUser.providerData.some(
      data => data.providerId === 'facebook.com'
    ),
  });

  const updateIsConnected = (providerId, value) => {
    setIsconnected(p => {
      return {
        ...p,
        [providerId]: value,
      };
    });
  };

  const unLink = async providerId => {
    try {
      if (auth.currentUser.providerData.length === 1) {
        throw new Error(`you can not disconnected from ${providerId}`);
      }
      await auth.currentUser.unlink(providerId);
      updateIsConnected(providerId, false);
      Alert.info(`disconnected from ${providerId}`, 2000);
    } catch (err) {
      Alert.error(err.message);
    }
  };

  const unLinkFacebook = () => {
    unLink('facebook.com');
  };
  const unLinkGoogle = () => {
    unLink('google.com');
  };

  const link = async provider => {
    try {
      await auth.currentUser.linkWithPopup(provider);
      Alert.success(`Linked to ${provider.providerId}`, 2000);
      updateIsConnected(provider.providerId, true);
    } catch (error) {
      Alert.error(error.message, 4000);
    }
  };

  const linkFacebook = () => {
    link(new firebase.auth.FacebookAuthProvider());
  };
  const linkGoogle = () => {
    link(new firebase.auth.GoogleAuthProvider());
  };

  return (
    <div>
      {isConnected['google.com'] && (
        <Tag color="green" closable onClose={unLinkGoogle}>
          <Icon icon="google" /> Connected
        </Tag>
      )}
      {isConnected['facebook.com'] && (
        <Tag color="blue" closable onClose={unLinkFacebook}>
          <Icon icon="facebook" /> Connected
        </Tag>
      )}
      <div className="mt-2">
        {!isConnected['google.com'] && (
          <Button block color="green" onClick={linkGoogle}>
            <Icon icon="google" /> Link to google
          </Button>
        )}
        {!isConnected['facebook.com'] && (
          <Button block color="blue" onClick={linkFacebook}>
            <Icon icon="facebook" /> Link to facebook
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProviderBlock;
