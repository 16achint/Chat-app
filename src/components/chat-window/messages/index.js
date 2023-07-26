import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { auth, database } from '../../../misc/firebase';
import { groupBy, transformToArrayWithId } from '../../../misc/helpers';
import MessageItem from './MessageItem';
import { Alert, Button } from 'rsuite';

const PAGE_SIZE = 15;

const messagesRef = database.ref('/messages');

function ShouldScrollToBottom(node, threshold = 30) {
  const percentage =
    (100 * node.scrollTop) / (node.scrollHeight - node.clientHeight) || 0;

  return percentage > threshold;
}
const Messages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const selfRef = useRef();

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  const loadMessages = useCallback(
    limitToLast => {
      const node = selfRef.current;
      messagesRef.off();
      messagesRef
        .orderByChild('roomId')
        .equalTo(chatId)
        .limitToLast(limitToLast || PAGE_SIZE)
        .on('value', snap => {
          const data = transformToArrayWithId(snap.val());
          setMessages(data);
          if (ShouldScrollToBottom(node)) {
            node.scrollTop = node.scrollHeight;
          }
        });
      setLimit(p => p + PAGE_SIZE);
    },
    [chatId]
  );

  const onLoadMore = useCallback(() => {
    const node = selfRef.current;
    const oldHeight = node.scrollHeight;

    loadMessages(limit);

    setLimit(() => {
      const newHeight = node.scrollHeight;
      node.scrollTop = newHeight - oldHeight;
    }, 200);
  }, [loadMessages, limit]);

  useEffect(() => {
    const node = selfRef.current;
    loadMessages();

    setTimeout(() => {
      node.scrollTop = node.scrollHeight;
    }, 200);

    return () => {
      messagesRef.off('value');
    };
  }, [loadMessages]);

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

  const renderMessage = () => {
    const groups = groupBy(messages, item =>
      new Date(item.createdAt).toDateString()
    );

    const items = [];

    Object.keys(groups).forEach(date => {
      items.push(
        <li key={date} className="text-center mb-1 padded">
          {date}
        </li>
      );

      const msgs = groups[date].map(msg => (
        <MessageItem
          key={msg.id}
          message={msg}
          handleAdmin={handleAdmin}
          handleLike={handleLike}
          handleDelete={handleDelete}
        />
      ));

      items.push(...msgs);
    });

    return items;
  };

  return (
    <ul ref={selfRef} className="msg-list custom-scroll">
      {messages && messages.length >= PAGE_SIZE && (
        <li className="text-center mt-2 mb-2">
          <Button onClick={onLoadMore} color="green">
            Load More
          </Button>
        </li>
      )}
      {isChatEmpty && <li>No messages</li>}
      {canShowMessages && renderMessage()}
    </ul>
  );
};

export default Messages;
