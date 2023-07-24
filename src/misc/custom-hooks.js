/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState, useEffect, useRef } from 'react';
import { database } from './firebase';

export function useModalState(defaultValue = false) {
  const [isOpen, setIsOpen] = useState(defaultValue);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, open, close };
}

export const useMediaQuery = query => {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const queryList = window.matchMedia(query);
    setMatches(queryList.matches);

    const listener = evt => setMatches(evt.matches);

    queryList.addListener(listener);
    return () => queryList.removeListener(listener);
  }, [query]);

  return matches;
};

export function usePresence(uid) {
  const [presence, setPresence] = useState(null);

  useEffect(() => {
    const userStatusRef = database.ref(`/status/${uid}`);

    console.log(`userStatusRef, ${userStatusRef}`); // printing the link of my db where status is online
    userStatusRef.on('value', snap => {
      if (snap.exists()) {
        const data = snap.val();
        console.log('Data' + data); // does not print anything or userStatusRef not running
        setPresence(data);
      }
    });

    return () => {
      userStatusRef.off();
    };
  }, [uid]);

  return presence;
}

export const useHover = () => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseOver = () => setIsHovering(true);
  const handleMouseOut = () => setIsHovering(false);

  const nodeRef = useRef();

  useEffect(() => {
    const node = nodeRef.current;
    if (node) {
      node.addEventListener('mouseover', handleMouseOver);
      node.addEventListener('mouseout', handleMouseOut);
    }
    return () => {
      node.removeEventListener('mouseover', handleMouseOver);
      node.removeEventListener('mouseout', handleMouseOut);
    };
  }, [nodeRef.current]);

  return [nodeRef, isHovering];
};
