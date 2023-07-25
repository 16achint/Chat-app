import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { auth, database } from '../../../misc/firebase';
import { transformToArrayWithId } from '../../../misc/helpers';
import MessageItem from './MessageItem';
import { Alert } from 'rsuite';

const Messages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  useEffect(() => {
    const messagesRef = database.ref('/messages');

    messagesRef
      .orderByChild('roomId')
      .equalTo(chatId)
      .on('value', snap => {
        const data = transformToArrayWithId(snap.val());
        setMessages(data);
      });

    return () => {
      messagesRef.off('value');
    };
  }, [chatId]);

  const handleAdmin = useCallback(
    async uid => {
      const adminsRef = database.ref(`/rooms/${chatId}/admins`);
      let alertMsg;
      await adminsRef.transaction(admins => {
        if (admins) {
          if (admins[uid]) {
            admins[uid] = null;
            alertMsg = 'Admin permission removed';
          } else {
            admins[uid] = true;
            alertMsg = 'Admin permission granted';
          }
        }
        return admins;
      });
      Alert.info(alertMsg, 4000);
    },
    [chatId]
  );

  const handleLike = useCallback(async msgId => {
    const { uid } = auth.currentUser;
    const messageRef = database.ref(`/messages/${msgId}`);
    await messageRef.transaction(msg => {
      if (msg) {
        if (!msg.likes) {
          msg.likes = {};
        }

        if (isNaN(msg.likeCount) || typeof msg.likeCount !== 'number') {
          msg.likeCount = 0;
        }

        if (msg.likes[uid]) {
          msg.likeCount -= 1;
          msg.likes[uid] = null;
        } else {
          msg.likeCount += 1;
          msg.likes[uid] = true;
        }
      }
      return msg;
    });
  }, []);

  const handleDelete = useCallback(
    async msgId => {
      if (!window.confirm('Delete this message?')) {
        return;
      }

      const currentUser = auth.currentUser; // Assuming you have access to the current user data

      // Check if the message belongs to the current user (user's own message)
      const isOwnMessage = messages.find(
        msg => msg.id === msgId && msg.userId === currentUser.uid
      );

      // Check if the current user is an admin
      const isAdmin = currentUser.isAdmin; // Assuming you have an 'isAdmin' property in the user data

      // If the user is an admin, they can only delete their own messages
      if (isAdmin && !isOwnMessage) {
        Alert.error("Admins cannot delete other users' messages");
        return;
      }
      // If the user is not an admin or the message belongs to the current user, proceed with the deletion
      const isLast = messages[messages.length - 1].id === msgId;
      const updates = {};
      updates[`/messages/${msgId}`] = null;

      if (isLast && messages.length > 1) {
        updates[`/rooms/${chatId}/lastMessages`] = {
          ...messages[messages.length - 2],
          msgId: messages[messages.length - 2].id,
        };
      }

      if (isLast && messages.length === 1) {
        updates[`/rooms/${chatId}/lastMessages`] = null;
      }

      try {
        await database.ref().update(updates);
        Alert.info('Message has been deleted');
      } catch (error) {
        Alert.error(error.message);
      }
    },
    [chatId, messages]
  );

  return (
    <ul className="msg-list custom-scroll">
      {isChatEmpty && <li>No messages</li>}
      {canShowMessages &&
        messages.map(msg => (
          <MessageItem
            key={msg.id}
            message={msg}
            handleAdmin={handleAdmin}
            handleLike={handleLike}
            handleDelete={handleDelete}
          />
        ))}
    </ul>
  );
};

export default Messages;
