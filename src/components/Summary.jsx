import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "../App.css";

function Summary({ onBack }) {
  const [summary, setSummary] = useState([]);

  const fetchSummary = async () => {
    const { data, error } = await supabase
      .from("work_summary")
      .select("*")
      .order("work_date", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setSummary(data);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const grouped = summary.reduce((acc, item) => {
    if (!acc[item.work_date]) {
      acc[item.work_date] = [];
    }
    acc[item.work_date].push(item);
    return acc;
  }, {});

  return (
    <div className="summary">
      <button onClick={onBack}>戻る</button>

      {Object.entries(grouped).map(([date, items]) => {
        const total = items.reduce((sum, i) => sum + i.work_hours, 0);

        return (
          <div key={date} className="summary-day">
            <h3>{date}（合計：{total.toFixed(1)}h）</h3>

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