import CreateRoomBtnModel from './CreateRoomBtnModal';
import DashboardToggle from './dashboard/DashboardToggle';
const Sidebar = () => {
  return (
    <div className="h-100 pt-2">
      <div>
        <DashboardToggle />
        <CreateRoomBtnModel />
      </div>
      bottom
    </div>
  );
};

export default Sidebar;
