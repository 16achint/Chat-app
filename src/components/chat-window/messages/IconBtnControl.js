import { Badge, Icon, IconButton, Tooltip, Whisper } from 'rsuite';

const ConditionalBadge = ({ condition, children }) => {
  return condition ? <Badge content={condition}>{children}</Badge> : children;
};

const IconBtnControl = ({
  isVisible,
  IconName,
  tooltip,
  onClick,
  badgeContent,
  ...Props
}) => {
  return (
    <div
      className="ml-2"
      style={{ visibility: isVisible ? 'visible' : 'hidden' }}
    >
      <ConditionalBadge condition={badgeContent}>
        <Whisper
          placement="top"
          delay={0}
          delayHide={0}
          delayShow={0}
          trigger="hover"
          speaker={<Tooltip>{tooltip}</Tooltip>}
        >
          <IconButton
            {...Props}
            onClick={onClick}
            circle
            size="xs"
            icon={<Icon icon={IconName} />}
          />
        </Whisper>
      </ConditionalBadge>
    </div>
  );
};

export default IconBtnControl;
