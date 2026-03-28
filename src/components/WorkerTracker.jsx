import { useState } from "react";
import UserInput from './UserInput';
import WorkSelector from './WorkSelector';
import ActionButtons from './ActionButtons';
import RecordList from './RecordList';
import { supabase } from '../lib/supabase';
import { useEffect } from "react";
import UsersMaster from "../master/UserMaster";
import WorkListMaster from "../master/WorkListMaster";




function WorkTracker() {
  const [employeeId, SetEmployeeId] = useState(null);
  const [employeeName, SetEmployeeName] = useState("");

  const [category, Setcategory] = useState("");
  const [subcategory, Setsubcategory] = useState("");

  const [records, SetRecords] = useState([]);
  const [users,SetUsers] = useState([]);
  const [worklist,SetWorklist] = useState({});
  const [mode,setMode] = useState("main");


  const handleCheckUser = async() => {
    const user = await fetchUsers(employeeId);

    if (!user) {
      alert("存在しない社員IDです")
    }

    SetEmployeeName(user.name);
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
    if (!employeeId) return;
    fetchRecords();
    fetchUsers(employeeId);
  },[employeeId]);


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

    await supabase
      .from('worktracker')
      .update({ end_time: now})
      .eq('employee_id', Number(employeeId))
      .is('end_time',null)

  //新規作業開始
  const { error } = await supabase
    .from('worktracker')
    .insert([
      {
      employee_id: employeeId,
      employee_name: employeeName,
      category,
      subcategory,
      start_time: now
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
  <div>
    <h2>作業時間管理</h2>

    {mode === "main" && (
      <>
        <UserInput
          employeeId={employeeId}
          employeeName={employeeName}
          SetEmployeeId={SetEmployeeId}
          onCheckUser={handleCheckUser}
        />

        <WorkSelector
          category={category}
          Setcategory={Setcategory}
          subcategory={subcategory}
          Setsubcategory={Setsubcategory}
          worklist={worklist}
        />

        <ActionButtons
          onStart={handleStart}
          onEnd={handleEnd}
          onAllEnd={handleAllEnd}
          onOpenMaster={() => setMode("master")} // ←追加
          onOpenWorkMaster={() => setMode("worklistmaster")}
        />

        <RecordList records={records} />
      </>
    )}

    {mode === "master" && (
      <UsersMaster onBack={() => setMode("main")} />
    )}

    {mode === "worklistmaster" && (
      <WorkListMaster onBack={() => setMode("main")} />
    )}
  </div>
);
}

export default WorkTracker;