function WorkSelector({ category, setCategory, subCategory, setSubCategory, worklist }) {
  return (
    <div>
      <select onChange={(e) => setCategory(e.target.value)} value={category}>
        <option value="">大項目</option>
        {Object.keys(worklist).map((key) => (
          <option key={key} value={key}>{key}</option>
        ))}
      </select>

      <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory}>
        <option value="">小項目</option>
        {category && worklist[category].map((sub) => (
          <option key={sub} value={sub}>{sub}</option>
        ))}
      </select>
    </div>
  );
}

export default WorkSelector;