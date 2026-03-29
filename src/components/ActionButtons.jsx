import "./ActionButtons.css";

function ActionButtons({ onStart, onEnd, onAllEnd,onOpenMaster,onOpenWorkMaster }) {

  return (
    <>
      { /*作業ボタン */ }
      <div className="action-buttons">
        <button onClick={onStart}>作業開始</button>
        <button onClick={onEnd}>作業終了</button>
      </div>

      { /*作業ボタン */ }
      <div className="admin-buttons">
        <button onClick={onAllEnd}>一括終了</button>
        <button onClick={onOpenMaster}>ユーザマスタ編集</button>
        <button onClick={onOpenWorkMaster}>作業項目編集</button>
      </div>
    </>

  )
}

export default ActionButtons;