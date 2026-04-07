import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    if (req.method === "POST") {
        const { name, categoryId } = req.body;

        //apiバリデーション

        if (!name) {
            return res.status(400).json({ error: "サブカテゴリ名が入力されていません" });
        }

        else if (!categoryId) {
            return res.status(400).json({ error: "カテゴリーIDが不正です" });
        }

        const { data, error } = await supabase
            .from("subcategories")
            .insert([{
                subcategory: name,
                category_id: categoryId
            },
            ]);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json(data);
    }
}