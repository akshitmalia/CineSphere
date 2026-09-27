const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const maxVisible = 5;
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  const btnStyle = (active) => ({
    width: "38px", height: "38px",
    display: "flex", alignItems: "center", justifyContent: "center",
    borderRadius: "8px",
    border: "1px solid",
    borderColor: active ? "#e8b339" : "#2a2a3a",
    backgroundColor: active ? "#e8b339" : "transparent",
    color: active ? "#0a0a0f" : "#8b8b9a",
    fontSize: "0.85rem",
    fontWeight: active ? "800" : "500",
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "Manrope, sans-serif",
  });

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: "0.4rem", padding: "2rem 0",
    }}>
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          ...btnStyle(false),
          opacity: currentPage === 1 ? 0.3 : 1,
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
        }}
      >←</button>

      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} style={btnStyle(false)}>1</button>
          {start > 2 && <span style={{ color: "#8b8b9a" }}>…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          style={btnStyle(p === currentPage)}
          onMouseEnter={(e) => { if (p !== currentPage) e.currentTarget.style.borderColor = "#e8b339"; }}
          onMouseLeave={(e) => { if (p !== currentPage) e.currentTarget.style.borderColor = "#2a2a3a"; }}
        >{p}</button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span style={{ color: "#8b8b9a" }}>…</span>}
          <button onClick={() => onPageChange(totalPages)} style={btnStyle(false)}>{totalPages}</button>
        </>
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          ...btnStyle(false),
          opacity: currentPage === totalPages ? 0.3 : 1,
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
        }}
      >→</button>
    </div>
  );
};

export default Pagination;