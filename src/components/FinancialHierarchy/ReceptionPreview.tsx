import React from 'react'
import { ReceptionExcelRow } from '../../utils/parseReceptionExcel'

interface ReceptionPreviewProps {
  data: ReceptionExcelRow[]
}

export const ReceptionPreview: React.FC<ReceptionPreviewProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Нет данных для отображения. Загрузите Excel файл.
      </div>
    )
  }

  const firstRow = data[0]

  const motorGroups = new Map<number, ReceptionExcelRow[]>()
  for (const row of data) {
    if (!motorGroups.has(row.positionNumber)) {
      motorGroups.set(row.positionNumber, [])
    }
    motorGroups.get(row.positionNumber)!.push(row)
  }

  const sortedGroups = Array.from(motorGroups.entries()).sort(
    ([a], [b]) => a - b
  )

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">Информация о приемке</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Номер приемки:</span>
            <p className="font-medium">{firstRow.receptionNumber}</p>
          </div>
          <div>
            <span className="text-gray-500">Дата приемки:</span>
            <p className="font-medium">{firstRow.receptionDate}</p>
          </div>
          <div>
            <span className="text-gray-500">Контрагент:</span>
            <p className="font-medium">{firstRow.counterpartyName}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">
          Двигатели ({sortedGroups.length})
        </h3>
        {sortedGroups.map(([positionNumber, items]) => {
          const firstItem = items[0]
          return (
            <div
              key={positionNumber}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="bg-blue-50 px-4 py-3 border-b border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-blue-600 font-medium">
                      Позиция {positionNumber}
                    </span>
                    <h4 className="font-semibold text-gray-800">
                      {firstItem.serviceName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {firstItem.subdivisionName}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {items.length} работ(ы)
                  </span>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {item.itemName}
                        </p>
                        <p className="text-sm text-gray-500">{item.workGroup}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
