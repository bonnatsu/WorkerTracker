import { useState } from 'react'
import '../App.css'


function Login() {
    const [id, setId] = useState("");
    const [name,setName] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleLogin = () => {
        setIsLoggedIn(true)
    }


    if (isLoggedIn) {
        return <h2>{name} さん　ようこそ</h2>
    }
    return (
        <div>
            <input type='text'
                    placeholder='ユーザIDを入力してください'
                    value={id}
                    onChange={(e) => setId(e.target.value)}
            />
            <br />
            <input type='text'
                placeholder='ユーザ名を入力してください'
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <br />
            <button onClick={handleLogin}>ログイン</button>
        </div>
    );
}

export default Login;