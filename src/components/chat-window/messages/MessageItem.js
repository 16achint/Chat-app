import ProfileAvatar from '../../ProfileAvatar';
import TimeAgo from 'timeago-react';
import ProfileInfoBtnModel from './ProfileInfoBtnModel';
import PresenceDot from '../../PresenceDot';
import { useCurrentRoom } from '../../../context/current-room.context';
import { memo } from 'react';
import { auth } from '../../../misc/firebase';
import { Button } from 'rsuite';

const MessageItem = ({ message, handleAdmin }) => {
  const { author, createdAt, text } = message;
  const isAdmin = useCurrentRoom(v => v.isAdmin);
  const admins = useCurrentRoom(v => v.admins);

  const isMsgAuthorAdmin = admins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;

  const canGrantAdmin = isAdmin && !isAuthor;

  return (
    <li className="padded mb-1">
      <div className="d-flex align-items-center font-bolder mb-1">
        <PresenceDot uid={author.uid} />
        <ProfileAvatar
          src={author.avatar}
          name={author.name}
          className="ml-1"
          size="xs"
        />
        <ProfileInfoBtnModel
          profile={author}
          appearance="link"
          className="p-0 ml-1 text-black"
        >
          {canGrantAdmin && (
            <Button block onClick={() => handleAdmin(author.uid)} color="blue">
              {isMsgAuthorAdmin
                ? 'Remove admin permission'
                : 'Give admin in this room'}
            </Button>
          )}
        </ProfileInfoBtnModel>
        <TimeAgo
          datetime={createdAt}
          className="font-normal text-black-45 ml-2"
        />
      </div>
      <div>
        <span className="word-break-all ">{text}</span>
      </div>
    </li>
  );
};

export default memo(MessageItem);
