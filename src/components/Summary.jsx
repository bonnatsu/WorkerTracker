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
  const [mode, setMode] = useState("")

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


  const convertToCsv = (data) => {
    if (!data.length) return "";
    let headers = [];
    let rows = [];

    if (mode === "summary") {
      headers = [
        "日付",
        "カテゴリ",
        "サブカテゴリ",
        "作業時間(分)"
      ];

      rows = data.map(item => [
        item.work_date,
        item.category,
        item.subcategory,
        item.total_time
      ]);
    } else if (mode === "summaryUser") {
      headers = [
        "日付",
        "ユーザID",
        "ユーザ名",
        "カテゴリ",
        "サブカテゴリ",
        "作業時間(分)"
      ];

      rows = data.map(item => [
        item.work_date,
        item.employee_id,
        item.employee_name,
        item.category,
        item.subcategory,
        item.total_time
      ]);
    }

    return [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");
  };

  const downloadCSV = () => {
    if (!summary.length) return;

    const csv = convertToCsv(summary);

    const blob = new Blob(
      ["\uFEFF" + csv], //excelの文字化け防止
      { type: "text/csv;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `summary_${startDate}_${endDate}.csv`;
    link.click();


    URL.revokeObjectURL(url);
  };

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

      <button onClick={() => {
        fetchSummary();
        setMode("summary");
      }}>
        集計
      </button>

      <button onClick={() => {
        fetchSummaryUser();
        setMode("summaryUser");
      }}>
        ユーザごと集計
      </button>

      <button onClick={downloadCSV}>
        CSV出力
      </button>


      <button onClick={onBack}>戻る</button>

      {Object.entries(grouped).map(([date, items]) => {
        const total = items.reduce((sum, i) => sum + i.total_time, 0);

        return (
          <div key={formatDateJST(date)} className="summary-day">
            <h3>{formatDateJST(date)}（合計：{total.toFixed(1)}h）</h3>

            {items.map((item, index) => (
              <div key={index} className="summary-row">
                <span>
                  {mode === "summaryUser"
                    ? `${item.employee_name} (${item.employee_id}) - ${item.category} -${item.subcategory}`
                    : `${item.category} - ${item.subcategory}`
                  }
                </span>
                <span>{item.total_time.toFixed(1)}h</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default Summary;