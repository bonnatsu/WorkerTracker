import { createClient } from "@supabase/supabase-js";


export default async function handler(req, res) {

    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { id } = req.body;

    if (req.method === "DELETE") {

        if (!id) {
            alert("削除対象のIDが入力されていません");
            return;
        }

        const { error } = supabase
            .from("users")
            .update({is_deleted:true})
            .eq("id",id);

        if (error) {
            return res.status(500).json({error:error.message});
        }

        return res.status(200).json({message:"削除成功"});
    }

    return res.status(405).json({error:"Method Not Allowed"});

}