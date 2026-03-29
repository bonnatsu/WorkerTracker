

function ActionButtons({ onStart, onEnd, onAllEnd,onOpenMaster,onOpenWorkMaster }) {
  const btnStyle = {
    width: "140px",
    fontSize: "18px",
    padding: "16px",
    marginBottom: "16px",
    height: "60px",
    borderRadius: "10px"
  };

  const subBtn = {
    width: "200px",
    height:"50px",
    fontSize:"16px",
    marginBottom:"12px",
    borderRadius:"10px"
  };

  const flexMenu = {
    position: "flexed",
    bottom: "20px",
    right: "20px",
    display: "flex",
    flexDirection:"column",
  };
  return (
    <div>
      <div style={{ textAlign: "center", marginTop: "16px" }}>
        <button style={btnStyle} onClick={onStart}>作業開始</button>
        <button style={btnStyle} onClick={onEnd}>作業終了</button>
      </div>
      <div style={flexMenu}>
        <button style={subBtn} onClick={onAllEnd}>一括終了</button>
        <button style={subBtn} onClick={onOpenMaster}>ユーザマスタ編集</button>
        <button style={subBtn} onClick={onOpenWorkMaster}>作業項目編集</button>
      </div>
    </div>
  );

}

export default ActionButtons;