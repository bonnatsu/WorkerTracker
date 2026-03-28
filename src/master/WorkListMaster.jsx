import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function WorkListMaster({ onBack }) {

    const [categories,setCategories] = useState([]);
    const [subCategories,setSubCategories] = useState([]);

    const [newCategory,setNewCategory] = useState("");
    const [newSubCategory,setNewSubCategory] = useState("");
    const [selectedCategoryId,setSelectedCategoryId] = useState(null);


    const fetchData = async () => {
        const {data:catData} = await supabase.from("categories").select("*");
        const {data,subData} = await supabase.from("subcategories").select("*");

        setCategories(catData || []);
        setSubCategories(subData || []);
    };
    useEffect(() => {
        fetchData();
    },[]);

    const handleAddCategory = async () => {
        await supabase.from("categories").insert([{name: newCategory}]);
        setNewCategory("");
        fetchData()
    };


    const handleAddSubCategory = async (categoryId) => {
        await supabase.from("categories")
            .insert([
                { 
                    subCategories: newSubCategory,
                    category_id:categoryId
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
            <button onClick={{handleAddCategory}}>追加</button>


            <hr />

            {categories.map((cat) => (
                <div key={cat.id}>
                    <strong>{cat.name}</strong>

                    <ul>
                        {subCategories
                            .filter((sub) => sub.category_id === cat.id)
                            .map((sub) => (
                                <li key={sub.id}>{subcategory}</li>
                            ))}
                    </ul>
                    
                    <input
                        placeholder="サブカテゴリ追加"
                        value={newSubCategory}
                        onChange={(e) => handleAddSubCategory(e.target.value)}
                        />
                        <button onClick={() => handleAddSubCategory(cat.id)}>
                            追加
                        </button>
                </div>
            ))}
        </div>
    );

}

export default WorkListMaster;
