export default function PopOverMenu1({ handleLogout }) {
  return (
    <div className="menu_list">
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
