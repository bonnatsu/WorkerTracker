import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
    if (req.method === "POST") {

        const { name } = req.body;

        //apiバリデーション

        if (!name) {
            return res.status(400).json({ error: "名前は必須項目です" });
        }

        const { data, error } = await supabase
            .from("users")
            .insert([{ name }])

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json({ message: "登録成功", data });
    }

}