import { useState } from "react";
import UserInput from './UserInput';
import WorkSelector from './WorkSelector';
import ActionButtons from './ActionButtons';
import RecordList from './RecordList';

function WorkTracker() {
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");

  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const [records, setRecords] = useState([]);

  const users = [
    { id: "001", name: "田中" },
    { id: "002", name: "佐藤" }
  ];

  const worklist = {
    開発: ["React", "API"],
    会議: ["MTG", "商談"]
  };

  const handleCheckUser = () => {
    const user = users.find(u => u.id === employeeId);

    if (!user) {
      alert("存在しない社員ID");
      return;
    }

    setEmployeeName(user.name);
  };

  const handleStart = () => {
    const now = new Date();

    let updated = records.map(r => {
      if (r.employeeId === employeeId && !r.endTime) {
        return { ...r, endTime: now };
      }
      return r;
    });

    const newRecord = {
      id: Date.now(),
      employeeId,
      employeeName,
      category,
      subCategory,
      startTime: now,
      endTime: null
    };

    setRecords([...updated, newRecord]);
  };

  const handleEnd = () => {
    const now = new Date();

    const updated = records.map(r => {
      if (r.employeeId === employeeId && !r.endTime) {
        return { ...r, endTime: now };
      }
      return r;
    });

    setRecords(updated);
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