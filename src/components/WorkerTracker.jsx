import { useState } from "react";
import UserInput from './UserInput';
import WorkSelector from './WorkSelector';
import ActionButtons from './ActionButtons';
import RecordList from './RecordList';
import { supabase } from '../lib/supabase';
import { useEffect } from "react";




function WorkTracker() {
  const [employeeId, SetEmployeeId] = useState(null);
  const [employeeName, SetEmployeeName] = useState("");

  const [category, Setcategory] = useState("");
  const [subcategory, Setsubcategory] = useState("");

  const [records, SetRecords] = useState([]);
  const [users,SetUsers] = useState([]);
  const [worklist,SetWorklist] = useState({});


  const handleCheckUser = () => {
    const user = users.find(u => u.id === Number(employeeId));

    if (!user) {
      alert("存在しない社員ID");
      return;
    }

    SetEmployeeName(user.name);
  };

  useEffect (() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select("*");
        console.log(users);
        console.log(employeeId);

      if(error) {
        console.error(error);
      } else {
        SetUsers(data);
      }
    };
    fetchUsers();
  }, []);


    const fetchRecords = async () => {
      const { data,error} = await supabase
        .from('worktracker')
        .select("*")
        .order('start_time', {ascending: false});

      if (error) {
        console.error(error);
      } else {
        SetRecords(data);
      }
    };


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
        grouped[item.category].push(item.subcategory);
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

    const updated = records.map(r => {
      if (!r.end_time) {
        return { ...r, end_time: now };
      }
      
      return r;
      
    });
    
    await fetchRecords();

    SetRecords(updated);
  };

  return (
    <div>
      <h2>作業時間管理</h2>

      <UserInput
        employeeId={employeeId}
        SetEmployeeId={SetEmployeeId}
        employeeName={employeeName}
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
      />

      <RecordList records={records} />
    </div>
  );
}

export default WorkTracker;