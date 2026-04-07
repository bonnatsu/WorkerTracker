import { createClient } from "@supabase/supabase-js";


export default async function handler(req, res) {
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    if (req.method === "POST") {
        const { name } = req.body;

        //apiバリデーション
        if (!name) {
            return res.status(400).json({ error: "カテゴリ名が入力されていません" });
        }


        const { data, error } = await supabase
            .from("categories")
            .insert([{
                category: name,
            },
            ]);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json(data);
    }

    else if (req.method === "GET") {
        const { data, error } = await supabase
            .from("categories")
            .select("id,category")

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json(data)

    }
}