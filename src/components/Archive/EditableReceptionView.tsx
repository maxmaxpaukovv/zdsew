import React, { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { ReceptionWithDetails, MotorWithItems, ReceptionItemDetail } from '../../services/archiveService'

interface EditableReceptionViewProps {
  reception: ReceptionWithDetails
}

interface CollapsibleHeaderProps {
  isExpanded: boolean
  toggle: () => void
  children: React.ReactNode
  className?: string
}

const CollapsibleHeader: React.FC<CollapsibleHeaderProps> = ({
  isExpanded,
  toggle,
  children,
  className = '',
}) => (
  <div
    onClick={toggle}
    className={`flex items-center justify-between cursor-pointer transition-all duration-150 ${className}`}
  >
    {children}
    <button className="text-gray-600 hover:text-blue-600 flex-shrink-0 transition-colors ml-2">
      {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
    </button>
  </div>
)

interface PositionItemProps {
  item: ReceptionItemDetail
}

const PositionItem: React.FC<PositionItemProps> = ({ item }) => {
  return (
    <div className="flex justify-between items-center py-1.5 hover:bg-gray-50 rounded transition-colors">
      <div className="flex-grow min-w-0">
        <p className="text-sm text-gray-900 truncate">{item.item_description}</p>
      </div>
      <div className="flex items-center space-x-4 ml-4">
        <span className="text-sm text-gray-600">{item.quantity}</span>
        <span className="text-sm text-gray-600">{item.price}</span>
        <span className="text-sm text-gray-600">{item.work_group || 'Без группы'}</span>
      </div>
    </div>
  )
}

interface TransactionGroupProps {
  type: string
  items: ReceptionItemDetail[]
}

const TransactionGroup: React.FC<TransactionGroupProps> = ({ type, items }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  if (items.length === 0) return null

  const isIncome = type === 'Доходы'
  const textColor = isIncome ? 'text-green-800' : 'text-red-800'

  return (
    <div>
      <CollapsibleHeader
        isExpanded={isExpanded}
        toggle={() => setIsExpanded(!isExpanded)}
        className="py-1.5 px-2 hover:bg-gray-50 rounded"
      >
        <h4 className={`text-sm ${textColor} flex-grow min-w-0`}>
          {type}
        </h4>
        <span className={`text-sm font-semibold ${textColor}`}>
          ({items.length})
        </span>
      </CollapsibleHeader>

      {isExpanded && (
        <div className="mt-1 space-y-1 pl-4">
          {items.map((item) => (
            <PositionItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

interface BaseItemGroupProps {
  baseItemName: string
  items: ReceptionItemDetail[]
}

const BaseItemGroup: React.FC<BaseItemGroupProps> = ({ baseItemName, items }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  const incomeItems = items.filter(item => item.transaction_type === 'Доходы')
  const expenseItems = items.filter(item => item.transaction_type === 'Расходы')

  return (
    <div>
      <CollapsibleHeader
        isExpanded={isExpanded}
        toggle={() => setIsExpanded(!isExpanded)}
        className="py-2 px-2 hover:bg-blue-50 rounded"
      >
        <h3 className="text-sm text-gray-800 flex-grow min-w-0">
          {baseItemName}
        </h3>
        <span className="text-sm text-gray-600">
          ({items.length})
        </span>
      </CollapsibleHeader>

      {isExpanded && (
        <div className="mt-2 space-y-2 pl-4">
          <TransactionGroup type="Доходы" items={incomeItems} />
          <TransactionGroup type="Расходы" items={expenseItems} />
        </div>
      )}
    </div>
  )
}

interface WorkGroupProps {
  workGroup: string
  items: ReceptionItemDetail[]
}

const WorkGroup: React.FC<WorkGroupProps> = ({ workGroup, items }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  const baseItemMap = new Map<string, ReceptionItemDetail[]>()
  for (const item of items) {
    const baseName = item.item_description.split('_ID_')[0].trim()
    if (!baseItemMap.has(baseName)) {
      baseItemMap.set(baseName, [])
    }
    baseItemMap.get(baseName)!.push(item)
  }

  return (
    <div className="border-l-4 border-blue-400 pl-4">
      <CollapsibleHeader
        isExpanded={isExpanded}
        toggle={() => setIsExpanded(!isExpanded)}
        className="py-2 px-2 hover:bg-blue-50 rounded"
      >
        <h2 className="text-sm font-medium text-gray-800 flex-grow min-w-0">
          {workGroup}
        </h2>
        <span className="text-sm text-gray-600">
          ({items.length})
        </span>
      </CollapsibleHeader>

      {isExpanded && (
        <div className="mt-2 space-y-2 pl-4">
          {Array.from(baseItemMap.entries()).map(([baseName, baseItems]) => (
            <BaseItemGroup
              key={baseName}
              baseItemName={baseName}
              items={baseItems}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface MotorGroupProps {
  motor: MotorWithItems
  positionNumber: number
}

const MotorGroup: React.FC<MotorGroupProps> = ({ motor, positionNumber }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  const workGroupMap = new Map<string, ReceptionItemDetail[]>()
  for (const item of motor.items) {
    const workGroup = item.work_group || 'Без группы работ'
    if (!workGroupMap.has(workGroup)) {
      workGroupMap.set(workGroup, [])
    }
    workGroupMap.get(workGroup)!.push(item)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
      <CollapsibleHeader
        isExpanded={isExpanded}
        toggle={() => setIsExpanded(!isExpanded)}
        className="p-3 hover:bg-gray-50 rounded-t-lg"
      >
        <span className="flex items-center justify-center w-7 h-7 bg-blue-600 text-white rounded-full text-sm font-bold flex-shrink-0">
          {positionNumber}
        </span>
        <div className="flex-grow min-w-0 ml-3">
          <h2 className="text-sm font-semibold text-gray-900">
            {motor.motor_service_description}
          </h2>
          <p className="text-xs text-gray-600">{motor.subdivision_name}</p>
        </div>
        <span className="text-sm text-gray-600">
          {motor.items.length} работ(ы)
        </span>
      </CollapsibleHeader>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {Array.from(workGroupMap.entries()).map(([workGroup, workItems]) => (
            <WorkGroup
              key={workGroup}
              workGroup={workGroup}
              items={workItems}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const EditableReceptionView: React.FC<EditableReceptionViewProps> = ({ reception }) => {
  if (!reception) {
    return (
      <div className="text-center py-12 text-gray-500">
        Приемка не найдена
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">Информация о приемке</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Номер приемки:</span>
            <p className="font-medium">{reception.reception_number}</p>
          </div>
          <div>
            <span className="text-gray-500">Дата приемки:</span>
            <p className="font-medium">{reception.reception_date}</p>
          </div>
          <div>
            <span className="text-gray-500">Контрагент:</span>
            <p className="font-medium">{reception.counterparty_name}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">
          Двигатели ({reception.motors.length})
        </h3>
        {reception.motors.map((motor) => (
          <MotorGroup
            key={motor.id}
            motor={motor}
            positionNumber={motor.position_in_reception}
          />
        ))}
      </div>
    </div>
  )
}
