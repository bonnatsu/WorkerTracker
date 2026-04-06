import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";


function UsersMaster({ onBack }) {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState("");

    const fetchUsers = async () => {
        const res = await fetch("/api/users");

        if (!res.ok) {
            const err = await res.json();
            console.error(error);
        }

        const data = await res.json();
        setUsers(data)
    };


    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAdd = async () => {
        if (!name) {
            alert("必須項目です");
            return;
        }

        const res = await fetch("/api/users", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ name }),
        });


        const data = await res.json();
        console.log(data);
        await fetchUsers();
        setName("")

    };

    const handleDelete = async (id) => {

        if (!id) {
            alert("IDが指定されていません");
            return
        }

        const res = await fetch('/api/${id}', {
            method: "DELETE",
        });

        if (!res.ok) {
            const err = await res.json();
            console.error(err);
            alert("削除失敗");
            return;
        }

        await fetchUsers();
    };


    return (
        <div>
            <h2>ユーザマスタ</h2>


            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="名前"
            />
            <button onClick={handleAdd}>追加</button>

            <ul>
                {users.map((u) => (
                    <li key={u.id}>
                        ID:{u.id}  名前:{u.name}
                        <button onClick={() => handleDelete(u.id)}>削除</button>
                    </li>
                ))}
            </ul>

            <button onClick={() => onBack()}>戻る</button>
        </div>
    );
}


export default UsersMaster;