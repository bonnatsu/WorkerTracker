function UserInput({employeeId,SetEmployeeId, employeeName}) {
    return (
        <div>
            <input
                type="text"
                placeholder="社員ID"
                value={employeeId}
                onChange={(e) => SetEmployeeId(e.target.value)}
                />

                {employeeName && <p>名前： {employeeName}</p>}
        </div>
    );
}

export default UserInput;