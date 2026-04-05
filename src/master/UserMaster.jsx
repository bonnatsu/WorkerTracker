import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";


function UsersMaster({ onBack }) {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState([]);

    const fetchUsers = async () => {
        const { data, error } = await supabase.from("users").select("*");

        if (error) {
            console.error(error);
        } else {
            setUsers(data);
        }
    };


    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAdd = async () => {
        const { error } = await supabase.from("users").insert([{ name }]);

        if (!error) {
            setName("");
            fetchUsers();
        }
    };

    const handleDelete = async (id) => {
        await supabase.from("users").delete().eq("id", id);
        fetchUsers();
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