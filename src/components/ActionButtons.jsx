

function ActionButtons({ onStart, onEnd, onAllEnd,onOpenMaster,onOpenWorkMaster }) {
  const btnStyle = {
    fontSize: "18px",
    padding: "16px",
    minHeight: "60px",
    borderRadius: "10px"
  }
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:"16px" }}>
      <button style={btnStyle} onClick={onStart}>作業開始</button>
      <button style={btnStyle} onClick={onEnd}>作業終了</button>
      <button style={btnStyle} onClick={onAllEnd}>一括終了</button>
      <button style={btnStyle} onClick={onOpenMaster}>ユーザマスタ編集</button>
      <button style={btnStyle} onClick={onOpenWorkMaster}>作業項目編集</button>
    </div>
  );
}

export default ActionButtons;