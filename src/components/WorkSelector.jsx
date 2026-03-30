function WorkSelector({ category, Setcategory, subcategory, Setsubcategory, worklist }) {
  return (
    <div className="form-area">
      <select onChange={(e) => Setcategory(e.target.value)} value={category}>
        <option value="">大項目</option>
        {Object.keys(worklist).map((key) => (
          <option key={key} value={key}>{key}</option>
        ))}
      </select>

      <select onChange={(e) => Setsubcategory(e.target.value)} value={subcategory}>
        <option value="">小項目</option>
        {category && worklist[category].map((sub) => (
          <option key={sub} value={sub}>{sub}</option>
        ))}
      </select>
    </div>
  );
}

export default WorkSelector;