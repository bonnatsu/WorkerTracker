export const checkAdmin = async () => {
    const password = prompt("管理者パスワード");

    if (!password) return false;

    const res = await fetch("/api/admin_login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
    });

    if (!res.ok) return false;


    const data = await res.json();
    return data.success;
};