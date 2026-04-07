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
        const { data: catData, error: catError } = await supabase.from("categories").select("*");
        const { data: subData, error: subError } = await supabase.from("subcategories").select("*");

        if (catError) {
            console.error(catError);
            setCategories([]);
        } else {
            setCategories(catData || []);
        }

        if (subError) {
            console.error(subError);
            setSubCategories([]);
        } else {
            setSubCategories(subData || []);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleAddCategory = async () => {
        if (!newCategory) {
            alert("カテゴリを入力してください");
            return;
        }

        const res = await fetch("/api/category", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                name: newCategory,
            }),
        });

        const data = await res.json();
        console.log(data);
        alert("登録完了");
        await fetchData();

    };


    const handleAddSubCategory = async (categoryId) => {
        const res = await fetch("/api/subcategory", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                name: newSubCategory,
                categoryId: selectedCategoryId
            })
        });
        const data = await res.json();

        if (!res.ok) {
            console.error(data);
        }


        setSubCategories(data);
        setNewSubCategory("");
        await fetchData()
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
                        <button onClick={() => {
                            handleAddSubCategory(selectedCategoryId);
                        }}>
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
                    <>
                        <p>
                            {categories.find(c => c.id === Number(selectedCategoryId))?.category}
                            のサブカテゴリ一覧
                        </p>
                        <ul> {subCategories.filter((sub) => sub.category_id === Number(selectedCategoryId)).map((sub) => (
                            <li key={sub.id}>{sub.subcategory}</li>))}
                        </ul>
                    </>)}

            </div>

        </div>
    );
}

export default WorkListMaster;


