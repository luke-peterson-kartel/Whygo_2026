export function StatusLegend() {
  return (
    <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h3 className="font-semibold text-gray-900 mb-3">Status Indicators</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-green-100 text-green-800 font-mono font-semibold rounded">[+]</span>
          <span className="text-gray-700">On pace (≥100% of quarterly target)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 font-mono font-semibold rounded">[~]</span>
          <span className="text-gray-700">Slightly off (80-99% of target)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-red-100 text-red-800 font-mono font-semibold rounded">[-]</span>
          <span className="text-gray-700">Off pace (&lt;80% of target)</span>
        </div>
      </div>
    </div>
  );
}
