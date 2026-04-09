import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "../App.css";




const formatDateJST = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
};

function Summary({ onBack }) {
  const [summary, setSummary] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchSummary = async () => {
    if (!startDate || !endDate) return;
    const { data, error } = await supabase.rpc(
      "get_work_summary",
      {
        start_date: startDate,
        end_date: endDate
      }
    );

    if (error) {
      console.error(error);
    } else {
      setSummary(data);
    }
  };

    const fetchSummaryUser = async () => {
    if (!startDate || !endDate) return;
    const { data, error } = await supabase.rpc(
      "get_work_summary_users",
      {
        start_date: startDate,
        end_date: endDate
      }
    );

    if (error) {
      console.error(error);
    } else {
      setSummary(data);
    }
  };


  const grouped = summary.reduce((acc, item) => {
    if (!acc[item.work_date]) {
      acc[item.work_date] = [];
    }
    acc[item.work_date].push(item);
    return acc;
  }, {});

  return (
    <div>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

      <button onClick={fetchSummary}>
        集計
      </button>

      <button onClick={fetchSummary}>
        ユーザごと集計
      </button>


      <button onClick={onBack}>戻る</button>

      {Object.entries(grouped).map(([date, items]) => {
        const total = items.reduce((sum, i) => sum + i.work_hours, 0);

        return (
          <div key={formatDateJST(date)} className="summary-day">
            <h3>{formatDateJST(date)}（合計：{total.toFixed(1)}h）</h3>

            {items.map((item, index) => (
              <div key={index} className="summary-row">
                <span>
                  {item.category} - {item.subcategory}
                </span>
                <span>{item.work_hours.toFixed(1)}h</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default Summary;