import { memo } from 'react';
import { useCrrentRoom } from '../../../context/current.room.context';

const Top = () => {
  const name = useCrrentRoom(v => v.name);
  return <div>{name}</div>;
};

export default memo(Top);
