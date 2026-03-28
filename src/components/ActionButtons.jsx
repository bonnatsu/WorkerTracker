import UsersMaster from "../master/UserMaster";

function ActionButtons({ onStart, onEnd, onAllEnd,onOpenMaster }) {
  return (
    <div style={{ marginTop: "1rem" }}>
      <button onClick={onStart}>作業開始</button>
      <button onClick={onEnd}>作業終了</button>
      <button onClick={onAllEnd}>一括終了</button>
      <button onClick={onOpenMaster}>ユーザマスタ編集</button>
    </div>
  );
}

export default ActionButtons;