import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
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



        console.log("URL:", process.env.SUPABASE_URL);
        console.log("KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json({ message: "登録成功", data });
    }

}