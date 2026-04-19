import { useEffect, useState } from "react";
import "./WorkListMaster.css";

function WorkListMaster() {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [selectedSubId, setSelectedSubId] = useState(null);

    const [newCategory, setNewCategory] = useState("");
    const [newSubCategory, setNewSubCategory] = useState("");

    const [showCategoryList, setShowCategoryList] = useState(true);

    // ===== データ取得 =====
    const fetchData = async () => {
        const [catres, subres] = await Promise.all([
            fetch("/api/category"),
            fetch("/api/subcategory"),
        ]);

        const [catData, subData] = await Promise.all([
            catres.json(),
            subres.json(),
        ]);

        setCategories(catData || []);
        setSubCategories(subData || []);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ===== 追加 =====
    const handleAddCategory = async () => {
        if (!newCategory) return alert("カテゴリを入力してください");

        await fetch("/api/category", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newCategory }),
        });

        setNewCategory("");
        fetchData();
    };

    const handleAddSubCategory = async () => {
        if (!newSubCategory || !selectedCategoryId)
            return alert("サブカテゴリを入力してください");

        await fetch("/api/subcategory", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: newSubCategory,
                categoryId: Number(selectedCategoryId), // ← 型統一
            }),
        });

        setNewSubCategory("");
        fetchData();
    };

    // ===== 削除 =====
    const handleDeleteCategory = async () => {
        if (!selectedCategoryId) return;
        if (!confirm("カテゴリを削除しますか？")) return;

        await fetch("/api/category", {
            method: "DELETE",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ id: Number(selectedCategoryId) }),
        });

        setSelectedCategoryId(null);
        setSelectedSubId(null);
        setShowCategoryList(true);
        fetchData();
    };

    const handleDeleteSubCategory = async () => {
        if (!selectedSubId) return;
        if (!confirm("サブカテゴリを削除しますか？")) return;

        await fetch("/api/subcategory", {
            method: "DELETE",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ id: Number(selectedSubId) }),
        });

        setSelectedSubId(null);
        fetchData();
    };

    // ===== 選択系 =====
    const selectedCategory = categories.find(
        (c) => Number(c.id) === Number(selectedCategoryId)
    );

    const filteredSubs = subCategories.filter(
        (sub) => Number(sub.category_id) === Number(selectedCategoryId)
    );

    return (
        <div className="master-container">

            <div className="header">
                <h2>作業マスタ</h2>
            </div>

            {/* ===== カテゴリ ===== */}
            <div className="section">
                <h3>カテゴリ</h3>

                {!showCategoryList && selectedCategoryId && (
                    <button
                        className="category-selected"
                        onClick={() => setShowCategoryList(true)}
                    >
                        {selectedCategory?.category} ▼
                    </button>
                )}

                {showCategoryList && (
                    <div className="category-list">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                className={`category-btn ${Number(selectedCategoryId) === Number(cat.id) ? "active" : ""}`}
                                onClick={() => {
                                    setSelectedCategoryId(Number(cat.id)); // ← 型統一
                                    setSelectedSubId(null);
                                    setShowCategoryList(false);
                                }}
                            >
                                {cat.category}
                            </button>
                        ))}
                    </div>
                )}

                {selectedCategoryId && (
                    <div className="selected-actions">
                        <button className="danger-btn" onClick={handleDeleteCategory}>
                            このカテゴリを削除
                        </button>
                    </div>
                )}

                <div className="form-box">
                    <input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="カテゴリ追加"
                    />
                    <button onClick={handleAddCategory}>追加</button>
                </div>
            </div>

            {/* ===== サブカテゴリ ===== */}
            {selectedCategoryId && (
                <div className="section">
                    <h3>{selectedCategory?.category} のサブカテゴリ</h3>

                    <ul className="sub-list">
                        {filteredSubs.map((sub) => (
                            <li key={sub.id}>
                                <button
                                    className={`sub-item ${Number(selectedSubId) === Number(sub.id) ? "active" : ""}`}
                                    onClick={() => setSelectedSubId(Number(sub.id))} // ← 型統一
                                >
                                    {sub.subcategory}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {selectedSubId && (
                        <div className="selected-actions">
                            <button className="danger-btn" onClick={handleDeleteSubCategory}>
                                このサブカテゴリを削除
                            </button>
                        </div>
                    )}

                    <div className="form-box">
                        <input
                            value={newSubCategory}
                            onChange={(e) => setNewSubCategory(e.target.value)}
                            placeholder="サブカテゴリ追加"
                        />
                        <button onClick={handleAddSubCategory}>追加</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WorkListMaster;