import Papa from 'papaparse'

const CsvTable = ({ csvData }: { csvData: string }) => {
  const parsedData = Papa.parse(csvData, { header: true }).data

  if (!csvData || parsedData.length === 0) {
    return <p className="text-gray-500">Nenhum dado disponível</p>
  }

  return (
    <table className="table-auto w-full border-collapse border border-gray-300 mt-4 shadow-md">
      <thead className="bg-blue-600 text-white">
        <tr>
          {Object.keys(parsedData[0]).map((header) => (
            <th
              key={header}
              className="px-4 py-2 border border-gray-300 text-left font-semibold"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {parsedData.map((row: any, rowIndex: number) => (
          <tr
            key={rowIndex}
            className={`${rowIndex % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
          >
            {Object.values(row).map((value, colIndex) => (
              <td
                key={colIndex}
                className="px-4 py-2 border border-gray-300 text-gray-700"
              >
                {value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function App() {
  // Dados simulados ou criados dinamicamente.
  const [createdCsv, setCreatedCsv] = useState('')

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-blue-300 p-4">
      <div className="bg-white shadow-2xl rounded-xl p-6 sm:p-8 w-full max-w-5xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          JSON to CSV Converter
        </h1>

        {/* Área de entrada (mantida igual) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="flex flex-col">
            {/* Entrada do JSON */}
            <Textarea
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 mb-3"
              placeholder="Adicione aqui o JSON a ser convertido em CSV"
              value={text}
              onChange={handleTextChange}
              rows={10}
            />
          </div>

          {/* Saída em tabela */}
          {createdCsv && (
            <div className="w-full">
              <label className="text-lg font-medium text-gray-700 mb-4">
                Saída do CSV:
              </label>
              <CsvTable csvData={createdCsv} />
              <Button
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 flex items-center gap-2"
                onClick={() => downloadCsv(createdCsv)}
              >
                <span>Baixar CSV</span>
                <Download />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
