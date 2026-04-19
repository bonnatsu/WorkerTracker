function RecordList({ records }) {
  return (
    <div>
      <h3>履歴</h3>
      <ul>
        {records.map((r) => (
          <li key={r.id}>
            {r.employee_name} / {r.category}-{r.subcategory}：
            {new Date(r.start_time).toLocaleTimeString()} 〜{" "}
            {r.end_time ? new Date(r.end_time).toLocaleTimeString() : "作業中"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecordList;