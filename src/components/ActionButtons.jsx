function ActionButtons({ onStart, onEnd, onAllEnd }) {
  return (
    <div style={{ marginTop: "1rem" }}>
      <button onClick={onStart}>作業開始</button>
      <button onClick={onEnd}>作業終了</button>
      <button onClick={onAllEnd}>一括終了</button>
    </div>
  );
}

export default ActionButtons;