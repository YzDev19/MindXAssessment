export default function VesselRow({ ship, target }) {
  const intensity = parseFloat(ship['GHG Intensity']);
  const isDeficit = intensity > target;
  
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4">
        <span className="font-mono font-bold text-slate-700">{ship.ship_id}</span>
      </td>
      <td className="px-6 py-4 text-slate-600 text-sm italic">{ship.ship_type}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full ${isDeficit ? 'bg-orange-500' : 'bg-emerald-500'}`} 
              style={{ width: `${Math.min((intensity/target)*100, 100)}%` }}
            />
          </div>
          <span className="text-sm font-medium">{intensity.toFixed(2)}</span>
        </div>
      </td>
      <td className={`px-6 py-4 font-bold ${isDeficit ? 'text-red-500' : 'text-emerald-600'}`}>
        {(target - intensity).toFixed(2)}
      </td>
      <td className="px-6 py-4">
        <span className={`text-[10px] uppercase font-black px-2 py-1 rounded ${
          isDeficit ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
        }`}>
          {isDeficit ? 'Deficit' : 'Surplus'}
        </span>
      </td>
    </tr>
  );
}