const results = [
  { id: 1, team: 'Code Queens', innovation: 18, technical: 27, usability: 17, responsible: 13, demo: 14 },
  { id: 2, team: 'Byte Force', innovation: 15, technical: 25, usability: 16, responsible: 12, demo: 12 },
  { id: 3, team: 'Null Pointers', innovation: 17, technical: 22, usability: 15, responsible: 11, demo: 13 },
  { id: 4, team: 'Pixel Pirates', innovation: 14, technical: 20, usability: 18, responsible: 10, demo: 11 },
]

const withTotal = results
  .map((r) => ({
    ...r,
    total: r.innovation + r.technical + r.usability + r.responsible + r.demo,
  }))
  .sort((a, b) => b.total - a.total)

export default function Leaderboard() {
  const exportCsv = () => {
    const header = 'Rank,Team,Innovation,Technical,Usability,Responsible,Demo,Total'
    const rows = withTotal.map(
      (r, i) =>
        [i + 1, r.team, r.innovation, r.technical, r.usability, r.responsible, r.demo, r.total].join(',')
    )
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'leaderboard.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <button onClick={exportCsv} className="bg-blue-600 text-white px-4 py-2 rounded">
          Export CSV
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Rank</th>
              <th>Team</th>
              <th>Innovation</th>
              <th>Technical</th>
              <th>Usability</th>
              <th>Responsible</th>
              <th>Demo</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {withTotal.map((r, i) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="py-2 font-bold">{i + 1}</td>
                <td className="font-medium">{r.team}</td>
                <td>{r.innovation}</td>
                <td>{r.technical}</td>
                <td>{r.usability}</td>
                <td>{r.responsible}</td>
                <td>{r.demo}</td>
                <td className="font-bold">{r.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}