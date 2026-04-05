import "./UserInput.css"


function UserInput({ employeeId, employeeName, SetEmployeeId, onCheckUser }) {
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            onCheckUser();
        }
    }
    return (
        <div className="form-area">
            <input
                type="text"
                placeholder="社員ID"
                value={employeeId}
                onChange={(e) => SetEmployeeId(e.target.value)}
                onKeyDown={handleKeyDown}
            />

            <p className="user-name">
                {employeeName ? `名前：${employeeName}` : ""}
            </p>
        </div>
    );
}

export default UserInput;