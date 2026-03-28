function UserInput({employeeId,employeeName}) {
    return (
        <div>
            <input
                type="text"
                placeholder="社員ID"
                value={employeeId}
                />

                {employeeName && <p>名前： {employeeName}</p>}
        </div>
    );
}

export default UserInput;