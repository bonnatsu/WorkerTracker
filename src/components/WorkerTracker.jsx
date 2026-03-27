import { useState } from "react";
import UserInput from './UserInput';
import WorkSelector from './WorkSelector';
import ActionButtons from './ActionButtons';
import RecordList from './RecordList';
import { supabase } from '../lib/supabase';
import { useEffect } from "react";




function WorkTracker() {
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");

  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const [records, setRecords] = useState([]);
  const [users,setUsers] = useState([]);
  const [worklist,setWorklist] = useState({});


  const handleCheckUser = () => {
    const user = users.find(u => u.id === employeeId);

    if (!user) {
      alert("存在しない社員ID");
      return;
    }

    setEmployeeName(user.name);
  };

  useEffect (() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select("*");

      if(error) {
        console.error(error);
      } else {
        setUsers(data);
      }
    };
    fetchUsers();
  }, []);

  useEffect (() => {
    const fetchWorklist = async () => {
      const { data, error } = await supabase
        .from("worklist")
        .select("*");

      if (error) {
        console.error(error);
        return;
      }

      const grouped = {};

      data.forEach(item => {
        if (!grouped[item.category]) {
          grouped[item.category] = [];
        }
        grouped[item.cateory].push(item.subCategory);
      });
      setWorklist(grouped);
    };

    fetchWorklist();
  }, []);


  //既存作業の完了
  const handleStart = async () => {
    const now = new Date();

    await supabase
      .from('worktracker')
      .update({ end_time: now})
      .eq('employee_id', employeeId)
      .is('end_time',null)

  //新規作業開始
  const { error } = await supabase
    .from('worktracker')
    .insert([
      {
      employee_id: employeeId,
      employee_name: employeeName,
      category,
      subCategory,
      start_time: now
        }
    ]);

    if (error) {
      console.error(error);
      alert("登録失敗");
    } else {
      alert("作業開始");
    }
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
  };

  const handleAllEnd = () => {
    const now = new Date();

    const updated = records.map(r => {
      if (!r.endTime) {
        return { ...r, endTime: now };
      }
      return r;
    });

    setRecords(updated);
  };

  return (
    <div>
      <h2>作業時間管理</h2>

      <UserInput
        employeeId={employeeId}
        setEmployeeId={setEmployeeId}
        employeeName={employeeName}
        onCheckUser={handleCheckUser}
      />

      <WorkSelector
        category={category}
        setCategory={setCategory}
        subCategory={subCategory}
        setSubCategory={setSubCategory}
        worklist={worklist}
      />

      <ActionButtons
        onStart={handleStart}
        onEnd={handleEnd}
        onAllEnd={handleAllEnd}
      />

      <RecordList records={records} />
    </div>
  );
}

export default WorkTracker;