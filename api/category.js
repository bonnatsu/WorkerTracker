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
            .eq("is_deleted",false)

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json(data)

    }

    else if (req.method === "DELETE") {
        const {id} = req.body;
        const {error: catError} =await supabase
            .from("categories")
            .update({
                is_deleted:true,
                deleted_at:new Date()
            })
            .eq("id".id);

        await supabase

        if (catError) {
            return res.status(500).json({error:catError.message});
        }

        const {error:subError} = await supabase
            .from("subcategories")
            .update({
                is_deleted:true,
                deleted_at:new Date()
            })
            .eq("category_id",id);

        if (subError) {
            return res.status(500).json({error:subError.message});
        }
    }
}