function WorkSelector({ category, setcategory, subcategory, setSubcategory, worklist }) {
  return (
    <div>
      <select onChange={(e) => setcategory(e.target.value)} value={category}>
        <option value="">大項目</option>
        {Object.keys(worklist).map((key) => (
          <option key={key} value={key}>{key}</option>
        ))}
      </select>

      <select onChange={(e) => setSubcategory(e.target.value)} value={subcategory}>
        <option value="">小項目</option>
        {category && worklist[category].map((sub) => (
          <option key={sub} value={sub}>{sub}</option>
        ))}
      </select>
    </div>
  );
}

export default WorkSelector;