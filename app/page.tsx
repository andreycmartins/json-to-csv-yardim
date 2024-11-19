'use client'

import { ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Delete, Download, FileJson } from 'lucide-react'
import json5 from 'json5'

type JsonValue = string | number | boolean | null
type JsonObject = Record<string, JsonValue>
type JsonData = JsonObject | JsonObject[]
const CsvTable = ({ parsedData }: { parsedData: JsonData[] }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300 shadow-md">
        <thead className="bg-blue-600 text-white">
          <tr>
            {Object.keys(parsedData[0] as Record<string, any>).map((header) => (
              <th
                key={header}
                className="px-4 py-2 border border-gray-300 text-left font-semibold whitespace-nowrap"
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
                  className="px-4 py-2 border border-gray-300 text-gray-700 whitespace-nowrap"
                >
                  {value as ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Home() {
  const [text, setText] = useState('')
  const [isTextValid, setIsTextValid] = useState(false)
  const [createdCsv, setCreatedCsv] = useState('')
  const [parsedData, setParsedData] = useState<JsonData[]>([])

  const jsonToCsv = (jsonData: JsonData) => {
    if (!jsonData || (Array.isArray(jsonData) && jsonData.length === 0)) {
      return ''
    }

    const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData]
    const headers = Object.keys(dataArray[0])
    const csvRows = []

    csvRows.push(headers.join(','))

    for (const item of dataArray) {
      const values = headers.map((header) => {
        const value = item[header]
        return String(value).replace(/"/g, '""')
      })
      csvRows.push(values.join(','))
    }

    return csvRows.join('\n')
  }

  const transformJsonString = (text: string): JsonObject[] => {
    if (!text) return []

    const jsonData = JSON.parse(text.replace(/(\w+):/g, '"$1":'))

    const jsonArray = Array.isArray(jsonData) ? jsonData : [jsonData]

    return jsonArray.map((item: JsonObject) => {
      const transformedItem: JsonObject = {}
      for (const key in item) {
        transformedItem[key] = String(item[key])
      }
      return transformedItem
    })
  }
  const downloadCsv = (csvContent: string, filename = 'json-converted.csv') => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setText(newText)

    setIsTextValid(() => {
      try {
        json5.parse(newText)
        return true
      } catch {
        return false
      }
    })
  }

  const cleanInput = () => {
    setText('')
    setCreatedCsv('')
  }

  const handleConfirm = () => {
    if (!isTextValid) return

    try {
      const jsonData = json5.parse(text)
      const transformedData = transformJsonString(text)
      setParsedData(transformedData)
      const csv = jsonToCsv(jsonData)
      setCreatedCsv(csv)
    } catch {
      setIsTextValid(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0d8842] to-[#2465b1] p-4">
      <div className="container mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-6 text-center">
            JSON to CSV Converter
          </h1>

          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="json-input"
                  className="text-sm font-medium text-gray-600"
                >
                  Entrada do JSON:
                </label>
                <Button
                  className="px-3 py-1 text-white bg-red-500 hover:bg-red-600 rounded-full shadow-md flex items-center gap-1"
                  onClick={cleanInput}
                >
                  <span>Limpar</span>
                  <Delete className="w-4 h-4" />
                </Button>
              </div>

              <Textarea
                id="json-input"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Adicione aqui o JSON a ser convertido em CSV"
                value={text}
                onChange={handleTextChange}
                rows={10}
              />

              {text.length > 0 && !isTextValid && (
                <p className="text-sm text-red-800 mt-1">
                  Insira um JSON plano válido!
                </p>
              )}

              <Button
                className={`mt-4 w-full px-4 py-2 rounded-lg shadow-md text-white flex items-center justify-center gap-2 ${
                  isTextValid
                    ? 'bg-[#2465b1] hover:bg-[#1d578f]'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
                onClick={handleConfirm}
                disabled={!isTextValid}
              >
                <span>Converter</span>
                <FileJson className="w-5 h-5" />
              </Button>
            </div>

            {createdCsv && text && (
              <div className="mt-8">
                <label className="text-sm font-medium text-gray-600 block mb-4">
                  Saída do CSV:
                </label>
                <CsvTable parsedData={parsedData} />
                <div className="flex justify-center mt-4">
                  <Button
                    className="px-4 py-2 bg-[#0d8842] hover:bg-green-600 text-white rounded-lg shadow-md flex items-center gap-2"
                    onClick={() => downloadCsv(createdCsv)}
                  >
                    <span>Baixar CSV</span>
                    <Download className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
