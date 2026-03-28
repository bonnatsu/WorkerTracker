import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function WorkListMaster({ onBack }) {

    const [categories,setCategories] = useState([]);
    const [subCategories,setSubCategories] = useState([]);

    const [newCategory,setNewCategory] = useState("");
    const [newSubCategory,setNewSubCategory] = useState("");
    const [selectedCategoryId,setSelectedCategoryId] = useState("");


    const fetchData = async () => {
        const {data:catData} = await supabase.from("categories").select("*");
        const {data:subData} = await supabase.from("subcategories").select("*");

        setCategories(catData || []);
        setSubCategories(subData || []);
    };
    useEffect(() => {
        fetchData();
    },[]);

    const handleAddCategory = async (categoryId) => {
        if (!categoryId) {
            alert("カテゴリを選択してください");
            return;
        }

        await supabase.from("categories").insert([{category: newCategory}]);
        setNewCategory("");
        fetchData()
    };


    const handleAddSubCategory = async (categoryId) => {
        await supabase.from("subcategories")
            .insert([
                { 
                    subcategory: newSubCategory,
                    category_id:Number(categoryId)
                },
            ]);
        setNewSubCategory("");
        fetchData()
    };

    return (
        <div>
            <h2>作業マスタ</h2>
            <button onClick={onBack}>戻る</button>

            <h3>カテゴリ追加</h3>
            <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="カテゴリ名"
            />
            <button onClick={handleAddCategory}>追加</button>


            <hr />

            <h3>サブカテゴリ追加</h3>

            <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
            >
                <option value="">カテゴリ選択</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.category}
                    </option>
                ))}
            </select>

            <input
                value={newSubCategory}
                onChange={(e) => setNewSubCategory(e.target.value)}
                placeholder="サブカテゴリ名"
            />
            <button onClick={() => handleAddSubCategory(selectedCategoryId)}>
                追加
            </button>
        </div>
    );

}

export default WorkListMaster;
