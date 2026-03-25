function UserInput({employeeId,setEmployeeId, employeeName,onCheckUser}) {
    return (
        <div>
            <input
                type="text"
                placeholder="社員ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                />
                <button onClick={onCheckUser}>確認</button>

                {employeeName && <p>名前： {employeeName}</p>}
        </div>
    );
}

export default UserInput;