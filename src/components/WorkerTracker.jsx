import { useState } from "react";
import UserInput from './UserInput';
import WorkSelector from './WorkSelector';
import ActionButtons from './ActionButtons';
import RecordList from './RecordList';
import { supabase } from '../lib/supabase';
import { useEffect } from "react";
import UsersMaster from "../master/UserMaster";
import WorkListMaster from "../master/WorkListMaster";
import Summary from "./Summary";
import "./Button.css"
import "./UI.css"




function WorkTracker() {
  const [employeeId, SetEmployeeId] = useState(null);
  const [employeeName, SetEmployeeName] = useState("");

  const [category, Setcategory] = useState("");
  const [subcategory, Setsubcategory] = useState("");

  const [records, SetRecords] = useState([]);
  const [worklist,SetWorklist] = useState({});
  const [mode,setMode] = useState("main");

  //ここ追加
  const [selectedCategory,setSelectedCategory] = useState(null);
  const [selectedSubCategory,setSelectedSubCategory] = useState(null);
  const [showModal,setShowModal] = useState(false);
  




  const handleCheckUser = async() => {
    const user = await fetchUsers(employeeId);

    if (!user) {
      alert("存在しない社員IDです")
    }

    SetEmployeeName(user.name);
    fetchRecords();
  };


    const fetchUsers = async (id) => {
      const { data, error } = await supabase
        .from('users')
        .select("*")
        .eq("id",Number(id));
        console.log(data);
        console.log(id);

      if(error) {
        console.error(error);
        return null;
      } else {
        return data[0] || null;
      }
    };



    const fetchRecords = async () => {
      const { data,error} = await supabase
        .from('worktracker')
        .select("*")
        .eq("employee_id",Number(employeeId))
        .order('start_time', {ascending: false});

      if (error) {
        console.error(error);
      } else {
        SetRecords(data);
      }
    };



  useEffect (() => {
    const fetchWorklist = async () => {
      const { data:catData, error:catError } = await supabase
        .from("categories")
        .select("*");

      const {data:subData, error: subError} = await supabase
        .from("subcategories")
        .select("*");

      if (catError || subError) {
        console.error(catError || subError);
        return;
      }

      const grouped = {};

      catData.forEach((cat) => {
          grouped[cat.category] = subData
            .filter((sub) => sub.category_id === cat.id)
            .map((sub) => sub.subcategory);
      });

      SetWorklist(grouped);
    };

    fetchWorklist();
  }, []);


  //既存作業の完了
  const handleStart = async () => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    const {data:openRecords} = await supabase
      .from("worktracker")
      .select("*")
      .eq("employee_id",employeeId)
      .is("end_time",null)
      .order("start_time",{ascending:false})
      .limit(1);

    const open = openRecords?.[0];

    //同日作業の場合のみ終了
    if (open && open.work_date === today) {
      await supabase
        .from("worktracker")
        .update({end_time:now})
        .eq("id",open.id);
    }


  //新規作業開始
  const { error } = await supabase
    .from('worktracker')
    .insert([
      {
      employee_id: employeeId,
      employee_name: employeeName,
      category,
      subcategory,
      start_time: now,
      work_date: now.toISOString().split("T")[0] 
        }
    ]);

    if (error) {
      console.error(error);
      alert("登録失敗");
    } else {
      alert("作業開始");
    }
    await fetchRecords();
  };

  const handleEnd = async () => {
    const now = new Date();

    const { error } = await supabase
      .from('worktracker')
      .update({ end_time:now })
      .eq('employee_id',employeeId)
      .is('end_time',null);
    if (error) {
      console.error(error);
      alert("終了失敗");
    } else {
      alert("作業終了")
    }
    await fetchRecords();
  };

  const handleAllEnd = async () => {
    const now = new Date();

    const { error } = await supabase
      .from('worktracker')
      .update ({ end_time:now})
      .is('end_time',null)
    await fetchRecords();
  };



return (
  <div className="layout">
    <h2>作業時間管理</h2>

      <div className="main">

      {mode === "main" && !selectedCategory && (
        <>
          <div>
            <h3>カテゴリ選択</h3>
          </div>

          <div className="grid">
            {Object.keys(worklist).map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}>
                {cat}
              </button>

            ))}
          </div>
        </>
      )}

      {selectedCategory && (
        <div className="grid">
          {worklist[selectedCategory].map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubCategory(sub)}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {selectedSubCategory && (
        <div className="input-area">
            <input
              placeholder="社員IDを入力してください"
              value={employeeId}
              onChange={(e) => SetEmployeeId(e.target.value)}
            />

            <button onClick={() => setShowModal(true)}>
              登録
            </button>

            <button onClick={() => setSelectedCategory(null)}>
              ← 戻る
            </button>
        </div>
      )}

      {showModal && (
        <div>
          <p>{selectedCategory} - {selectedSubCategory}</p>
          <p>{employeeId}</p>

          <button onClick={handleStart}>登録</button>
          <button onClick={() => setShowModal(false)}>キャンセル</button>
        </div>
      )}

      {mode === "master" && (
        <UsersMaster onBack={() => setMode("main")} />
      )}

      {mode === "worklistmaster" && (
        <WorkListMaster onBack={() => setMode("main")} />
      )}

      {mode === "summary" && (
        <Summary onBack={() => setMode("main")} />
      )}
    </div>
  </div>
);
}

export default WorkTracker;