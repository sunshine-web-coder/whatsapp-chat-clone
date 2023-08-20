import SideBar from "./SideBar";
import MessageBox from "./messageBox/MessageBox";

export default function ChatRoom() {
  return (
    <div className="h-screen">
      <div className="flex rounded shadow-lg h-full">
        {/* Left */}
        <SideBar />
        {/* Right */}
        <MessageBox />
      </div>
    </div>
  );
}
