import "./UserInput.css"


function UserInput({employeeId,employeeName,SetEmployeeId,onCheckUser}) {
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            onCheckUser();
        }
    }
    return (
        <div>
            <input
                type="text"
                placeholder="社員ID"
                value={employeeId}
                onChange={(e) => SetEmployeeId(e.target.value)}
                onKeyDown={handleKeyDown}
                />

                {employeeName && <p>名前： {employeeName}</p>}
        </div>
    );
}

export default UserInput;