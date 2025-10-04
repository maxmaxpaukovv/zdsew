import React from 'react'
import { HierarchicalItem } from '../../types/financialHierarchy'
import { formatCurrency } from './shared'
import { Button } from '../ui/Button'
import { Plus, Minus, Repeat } from 'lucide-react'

interface ItemCardProps {
  item: HierarchicalItem
  onQuantityChange: (itemId: string, newQuantity: number) => void
  onSelectMotor: (itemId: string) => void
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onQuantityChange,
  onSelectMotor,
}) => {
  const handleIncrement = () => {
    onQuantityChange(item.id, item.quantity + 1)
  }

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.id, item.quantity - 1)
    }
  }

  return (
    <div className="flex justify-between items-center py-2 px-3 hover:bg-gray-50 rounded transition-colors">
      <div className="flex-grow flex items-center gap-2">
        <button
          onClick={() => onSelectMotor(item.id)}
          className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
          title="Заменить позицию из справочника"
        >
          <Repeat size={14} />
        </button>
        <div>
          <p className="text-sm text-gray-900">{item.itemName}</p>
          <p className="text-xs text-gray-500">
            {formatCurrency(item.unitPrice)} / шт.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <span className="text-sm text-gray-600 mr-2">{item.quantity}</span>
        <Button
          variant="icon"
          size="sm"
          onClick={handleDecrement}
          disabled={item.quantity <= 1}
        >
          <Minus size={14} />
        </Button>
        <Button variant="icon" size="sm" onClick={handleIncrement}>
          <Plus size={14} />
        </Button>
      </div>
    </div>
  )
}
