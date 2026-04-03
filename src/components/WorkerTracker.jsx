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

  const [records, SetRecords] = useState([]);
  const [worklist,SetWorklist] = useState({});
  const [mode,setMode] = useState("main");

  //ここ追加
  const [selectedCategory,setSelectedCategory] = useState(null);
  const [selectedSubCategory,setSelectedSubCategory] = useState(null);
  const [showModal,setShowModal] = useState(null);
  const [activeWorks,setActiveWorks] = useState([]);
  

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
    const { data:catData } = await supabase.from("categories").select("*");
    const { data:subData } = await supabase.from("subcategories").select("*");

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

  //作業中一覧取得
  const fetchActiveWorks = async () => {
    const { data,error} = await supabase
    .from("worktracker")
    .select("*")
    .is("end_time",null)
    .order("start_time",{ascending:false});

    if (error) {
      console.error(error);
    } else {
      setActiveWorks(data);
    }
  };

  useEffect(() => {
    fetchActiveWorks();
  },[]);
 

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
      category:selectedCategory,
      subcategory:selectedSubCategory,
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

    SetEmployeeId("")
    SetEmployeeName("")
    setShowModal(false)
    setSelectedCategory(null)
    setSelectedSubCategory(null)
    setMode("main")
    fetchActiveWorks()
  };

  const handleAllEnd = async () => {
    const now = new Date();

    const { error } = await supabase
      .from('worktracker')
      .update ({ end_time:now})
      .is('end_time',null)
    await fetchRecords();
    await fetchActiveWorks()
  };

const handleCheckUser = async () => {
  if (!employeeId) {
    alert("社員ID入力してや");
    return;
  }

  const user = await fetchUsers(employeeId);

  if (!user) {
    alert("存在しない社員IDです");
    SetEmployeeId(""); // リセット
    return;
  }

  SetEmployeeName(user.name);
  setShowModal(true); // OKならモーダル出す
};

const handleEndByUser = async () => {
  if (!employeeId) {
    alert("社員ID入力してや");
    return;
  }

  const now = new Date();

  const { error } = await supabase
    .from("worktracker")
    .update({ end_time: now })
    .eq("employee_id", Number(employeeId))
    .is("end_time", null);

  if (error) {
    console.error(error);
    alert("終了失敗");
  } else {
    alert("作業終了したで");
    SetEmployeeId("");
    SetEmployeeName("")
    setMode("main");
    fetchActiveWorks()
  }
};



return (
  <div className="layout">
    <h2>作業時間管理</h2>

      <div className="side">
        <button onClick={() => setMode("end")}>作業終了</button>
        <button onClick={handleAllEnd}>一括終了</button>
        <button onClick={() => setMode("master")}>社員マスタ</button>
        <button onClick={() => setMode("worklistmaster")}>作業マスタ</button>
        <button onClick={() => setMode("summary")}>集計</button>
      </div>

      <div className="main">

        {/* 選択状態表示 */}
        {selectedCategory && (
          <div className="selected-info">
            選択中: {selectedCategory}
            {selectedSubCategory && ` > ${selectedSubCategory}`}
          </div>
        )}

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

            {activeWorks.length > 0 && (
              <div className="active_list">
                <h3>作業中一覧</h3>

                {activeWorks.map((work) => (
                  <div key={work.id} className="active-item">
                    {work.employee_name}:{work.category} ＞ {work.subcategory}　開始時間：{work.start_time.split("T") [0]}
                  </div>
                ))}
              </div>
            )} 
        </>
      )}

      {mode === "end" && (
        <div className="input-area">
          <input
            placeholder="社員ID"
            value={employeeId}
            onChange={(e) => SetEmployeeId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleEndByUser();
              }
            }}
          />

          <button onClick={handleEndByUser}>
            終了する
          </button>

          <button onClick={() => {
            setMode("main");
            SetEmployeeId("");
            SetEmployeeName("")
          }}>
            ← 戻る
          </button>
        </div>
)}

      {selectedCategory && !selectedSubCategory && (
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCheckUser();
                }
              }}
            />

            <button onClick={() =>  {
              setSelectedCategory(null);
              setSelectedSubCategory(null);
              SetEmployeeId("");
            }}>
              ← 戻る
            </button>
        </div>
      )}

      {showModal && (
        <div>
          <p>{selectedCategory} - {selectedSubCategory}</p>
          <p>ユーザID：{employeeId}　ユーザ名：{employeeName}</p>

          <button onClick={handleStart}>登録</button>
          <button onClick={() => {
            setShowModal(false)
            SetEmployeeId("")
            }
          }>キャンセル</button>
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