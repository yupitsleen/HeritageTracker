/**
 * Status color legend for map and timeline markers
 */
export function StatusLegend() {
  const statusColors = [
    { label: "Destroyed", color: "#b91c1c" },
    { label: "Heavily Damaged", color: "#d97706" },
    { label: "Damaged", color: "#ca8a04" },
  ];

  return (
    <div className="flex items-center justify-center gap-4 mb-3 px-3 py-2 bg-white rounded-lg border border-gray-200">
      <span className="text-xs font-semibold text-gray-700">Status:</span>
      {statusColors.map((status) => (
        <div key={status.label} className="flex items-center gap-1.5">
          <div
            className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: status.color }}
          />
          <span className="text-xs text-gray-700">{status.label}</span>
        </div>
      ))}
    </div>
  );
}
