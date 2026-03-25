import heroImg from '../assets/hero.png';
import Login from './Login';

function Profile() {
    return (
        <div style={{ border:"1px solid #ccc", padding: "1rem", borderRadius: "8px",maxWidth:"400px"}}>
            <img src = {heroImg} alt="自分の写真" style={{ width: "100%", borderRadius:"8px"}}/>
            <h2>Punch Time</h2>
            <p>ログイン画面</p>

                <Login />

        </div>
    )
}

export default Profile;
