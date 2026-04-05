import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./WorkListMaster.css"

function WorkListMaster({ onBack }) {

    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [newSubCategory, setNewSubCategory] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [subCategories, setSubCategories] = useState([]);
    const [viewMode, setViewMode] = useState("category");


    const fetchData = async () => {
        const { data: catData } = await supabase.from("categories").select("*");
        const { data: subData } = await supabase.from("subcategories").select("*");

        setCategories(catData || []);
        setSubCategories(subData || []);
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleAddCategory = async (categoryId) => {
        if (!categoryId) {
            alert("カテゴリを選択してください");
            return;
        }

        await supabase.from("categories").insert([{ category: newCategory }]);
        setNewCategory("");
        fetchData()
    };


    const handleAddSubCategory = async (categoryId) => {
        await supabase.from("subcategories")
            .insert([
                {
                    subcategory: newSubCategory,
                    category_id: Number(categoryId)
                },
            ]);
        setNewSubCategory("");
        fetchData()
    };

    return (
        <div className="master-container">

            <div className="master-left">

                {viewMode === "category" && (
                    <>
                        <h2>作業マスタ</h2>
                        <button onClick={onBack}>戻る</button>

                        <h3>カテゴリ追加</h3>
                        <input
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="カテゴリ名"
                        />
                        <button onClick={handleAddCategory}>追加</button>
                    </>
                )}

                {viewMode === "subcategory" && (
                    <>
                        <p>
                            サブカテゴリ追加
                        </p>
                        <p>
                            選択中カテゴリ：
                            {categories.find(c => c.id === Number(selectedCategoryId))?.category}
                        </p>

                        <input
                            value={newSubCategory}
                            onChange={(e) => setNewSubCategory(e.target.value)}
                            placeholder="サブカテゴリ名"
                        />
                        <button onClick={() => handleAddSubCategory(selectedCategoryId)}>
                            追加
                        </button>

                        <button onClick={() => setViewMode("category")}>
                            ← 戻る
                        </button>
                    </>
                )}

            </div>

            {/* 右 */}
            <div className="master-right">
                <h3>
                    {viewMode === "category"
                        ? "カテゴリ一覧"
                        : "サブカテゴリ一覧"}
                </h3>

                {viewMode === "category" && (
                    <ul>
                        {categories.map(cat => (
                            <li key={cat.id} className="category-item clickable">
                                <button onClick={() => {
                                    setSelectedCategoryId(cat.id);
                                    setViewMode("subcategory");
                                }}>
                                    {cat.category}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {viewMode === "subcategory" && (
                    <p>
                        {categories.find(c => c.id === Number(selectedCategoryId))?.category}
                        のサブカテゴリ一覧
                    </p>
                )}

            </div>

        </div>
    );
}

export default WorkListMaster;


