import ChatList from "./ChatList";
import NavBar from "./NavBar";
import SearchChat from "./SearchChat";

export default function SideBar() {
  return (
    <div className="side_bar relative border border-slate-700 pb-2 h-screen">
      <NavBar />
      <SearchChat />
      <div className="chat_list">
        <ChatList />
      </div>
    </div>
  );
}
