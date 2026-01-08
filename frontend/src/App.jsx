import { useState, useEffect } from 'react'

//component to render each vessel row
const VesselRow = ({ ship }) => {
  const intensity = parseFloat(ship['GHG Intensity'])
  const balance = parseFloat(ship['Compliance Balance'])
  const maxIntensity = 100 // Arbitrary max for the visual bar
  const intensityPercent = Math.min((intensity / maxIntensity) * 100, 100)
  const isDeficit = ship.Status === 'Deficit'

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-6 py-4 font-semibold text-gray-800">{ship.ship_id}</td>
      <td className="px-6 py-4 text-gray-600">{ship.ship_type}</td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1">
          {/* intensity bar */}
          <div className="bg-gray-200 rounded-full h-2 w-32 overflow-hidden">
            <div 
              className={`h-full rounded-full ${isDeficit ? 'bg-slate-700' : 'bg-green-500'}`}
              style={{ width: `${intensityPercent}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600">{intensity.toFixed(2)}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`font-bold tabular-nums ${isDeficit ? 'text-red-600' : 'text-green-600'}`}>
          {balance.toFixed(2)}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
          isDeficit 
            ? 'bg-red-50 text-red-700 border-red-200' 
            : 'bg-green-50 text-green-700 border-green-200'
        }`}>
          {ship.Status}
        </span>
      </td>
    </tr>
  )
}

//main app component
function App() {
  const [ships, setShips] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  
  // Pooling Simulator State
  const [selectedShipA, setSelectedShipA] = useState('')
  const [selectedShipB, setSelectedShipB] = useState('')
  const [poolResult, setPoolResult] = useState(null)

  const itemsPerPage = 7

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/fleet-status')
      .then(res => res.json())
      .then(data => {
        setShips(data.data)
        setLoading(false)
      })
      .catch(err => console.error("Error fetching data:", err))
  }, [])

  // Pooling Logic
  const handleCalculatePool = () => {
    const shipA = ships.find(s => s.ship_id === selectedShipA)
    const shipB = ships.find(s => s.ship_id === selectedShipB)

    if (!shipA || !shipB) return

    const totalBalance = parseFloat(shipA['Compliance Balance']) + parseFloat(shipB['Compliance Balance'])
    const isCompliant = totalBalance >= 0

    setPoolResult({
      balance: totalBalance.toFixed(2),
      status: isCompliant ? "COMPLIANT" : "NON-COMPLIANT",
      color: isCompliant ? "text-green-600" : "text-red-600",
      bg: isCompliant ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
    })
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-slate-600 text-xl animate-pulse">
      Loading Fleet Data...
    </div>
  )

  //filter logic
  const filteredShips = ships.filter(ship => {
    const matchesSearch = ship.ship_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ship.ship_type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || ship.Status === statusFilter
    return matchesSearch && matchesStatus
  })

  //pages
  const totalPages = Math.ceil(filteredShips.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentShips = filteredShips.slice(startIndex, startIndex + itemsPerPage)

  const deficitCount = ships.filter(s => s.Status === 'Deficit').length
  const surplusCount = ships.filter(s => s.Status === 'Surplus').length

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-screen-xl mx-auto space-y-8">
        
        {/* header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-slate-800 p-2 rounded-lg shadow-sm">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z"/>
                <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z"/>
                <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">MIND X - Fleet Dashboard</h1>
          </div>
          <p className="text-slate-500">Real-time monitoring of fleet emissions and compliance status.</p>
        </div>

        {/* summary */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-slate-400 uppercase text-xs font-bold tracking-wider mb-2">Total Ships</h3>
            <p className="text-4xl font-extrabold text-slate-800">{ships.length.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-slate-400 uppercase text-xs font-bold tracking-wider mb-2">Deficit Ships</h3>
            <p className="text-4xl font-extrabold text-red-600">{deficitCount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-slate-400 uppercase text-xs font-bold tracking-wider mb-2">Surplus Ships</h3>
            <p className="text-4xl font-extrabold text-green-600">{surplusCount}</p>
          </div>
        </div>

        {/* pooling simulator */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200">
          <div className="mb-6">
             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Pooling Simulator
             </h2>
             <p className="text-sm text-slate-500">Select a Deficit vessel and a Surplus vessel to simulate fleet offset.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Vessel A</label>
              <select 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedShipA}
                onChange={(e) => setSelectedShipA(e.target.value)}
              >
                <option value="">-- Select Vessel --</option>
                {ships.map(s => (
                  <option key={s.ship_id} value={s.ship_id}>
                    {s.ship_id} ({s.Status}: {parseFloat(s['Compliance Balance']).toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Vessel B</label>
              <select 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedShipB}
                onChange={(e) => setSelectedShipB(e.target.value)}
              >
                <option value="">-- Select Vessel --</option>
                {ships.map(s => (
                  <option key={s.ship_id} value={s.ship_id}>
                    {s.ship_id} ({s.Status}: {parseFloat(s['Compliance Balance']).toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <button 
              onClick={handleCalculatePool}
              className="w-full md:w-auto px-6 py-2 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
            >
              Simulate
            </button>
          </div>

          {/* Result Box */}
          {poolResult && (
            <div className={`mt-6 p-4 rounded-lg border ${poolResult.bg} flex justify-between items-center animate-fade-in`}>
              <div>
                <span className="text-sm font-semibold text-slate-600 block">Net Compliance Balance</span>
                <span className={`text-2xl font-bold ${poolResult.color}`}>{poolResult.balance}</span>
              </div>
              <div className={`px-4 py-1.5 rounded-md font-bold text-sm tracking-wide border ${poolResult.color.replace('text', 'border')}`}>
                {poolResult.status}
              </div>
            </div>
          )}
        </div>

        {/* fleet details */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* control bar */}
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Fleet Details</h2>
              <p className="text-sm text-slate-500">Active vessels for May 2024</p>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              {/* search bar */}
              <div className="relative flex-1 md:flex-none">
                <input
                  type="text"
                  placeholder="Search Ship ID..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* filter dropdown */}
              <select 
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Deficit">Deficit Only</option>
                <option value="Surplus">Surplus Only</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Ship ID', 'Type', 'Intensity (kg/nm)', 'Balance', 'Status'].map((header) => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentShips.map((ship, idx) => (
                  <VesselRow key={idx} ship={ship} />
                ))}
              </tbody>
            </table>
          </div>

          {/* page navigation */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredShips.length)}</span> of <span className="font-medium">{filteredShips.length}</span>
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-slate-300 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ‹
              </button>
              <span className="px-4 py-1 text-sm text-slate-600 self-center">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-slate-300 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App