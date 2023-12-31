import { usePresence } from '../misc/custom-hooks';
import { Badge, Tooltip, Whisper } from 'rsuite';

const getColor = presence => {
  if (!presence) {
    return 'grey';
  }
  switch (presence.state) {
    case 'online':
      return 'green';
    case 'offline':
      return 'red';
    default:
      return 'grey';
  }
};

const getText = presence => {
  if (!presence) {
    return 'Unknow state';
  }

  return presence.state === 'online'
    ? 'Online'
    : `Last online ${new Date(presence.last_changed).toLocaleDateString()}`;
};

const PresenceDot = ({ uid }) => {
  const presence = usePresence(uid);
  return (
    <Whisper
      placement="top"
      controlId="control-id-click"
      trigger="click"
      speaker={<Tooltip>{getText(presence)}</Tooltip>}
    >
      <Badge
        className="cursor-pointer"
        style={{ backgroundColor: getColor(presence) }}
      />
    </Whisper>
  );
};

export default PresenceDot;
