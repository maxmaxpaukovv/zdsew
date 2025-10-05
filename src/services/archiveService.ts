import { supabase } from '../lib/supabase'
import { ReceptionExcelRow } from '../utils/parseReceptionExcel'

export interface ReceptionWithDetails {
  id: string
  reception_number: string
  reception_date: string
  counterparty_name: string
  motors: MotorWithItems[]
}

export interface MotorWithItems {
  id: string
  position_in_reception: number
  motor_service_description: string
  subdivision_name: string
  items: ReceptionItemDetail[]
}

export interface ReceptionItemDetail {
  id: string
  item_description: string
  work_group: string | null
  transaction_type: string | null
  quantity: number
  price: number
}

export const getAllReceptions = async (): Promise<ReceptionWithDetails[]> => {
  const { data: receptions, error: receptionsError } = await supabase
    .from('receptions')
    .select(`
      id,
      reception_number,
      reception_date,
      counterparties(name)
    `)
    .order('reception_date', { ascending: false })

  if (receptionsError) {
    throw new Error(`Ошибка загрузки приемок: ${receptionsError.message}`)
  }

  const result: ReceptionWithDetails[] = []

  for (const reception of receptions || []) {
    const { data: motors, error: motorsError } = await supabase
      .from('accepted_motors')
      .select(`
        id,
        position_in_reception,
        motor_service_description,
        subdivisions(name)
      `)
      .eq('reception_id', reception.id)
      .order('position_in_reception', { ascending: true })

    if (motorsError) {
      console.error('Ошибка загрузки двигателей:', motorsError)
      continue
    }

    const motorsWithItems: MotorWithItems[] = []

    for (const motor of motors || []) {
      const { data: items, error: itemsError } = await supabase
        .from('reception_items')
        .select('id, item_description, work_group, transaction_type, quantity, price')
        .eq('accepted_motor_id', motor.id)

      if (itemsError) {
        console.error('Ошибка загрузки позиций:', itemsError)
        continue
      }

      motorsWithItems.push({
        id: motor.id,
        position_in_reception: motor.position_in_reception,
        motor_service_description: motor.motor_service_description,
        subdivision_name: (motor.subdivisions as any)?.name || 'Не указано',
        items: items || [],
      })
    }

    result.push({
      id: reception.id,
      reception_number: reception.reception_number || 'Без номера',
      reception_date: reception.reception_date,
      counterparty_name: (reception.counterparties as any)?.name || 'Не указан',
      motors: motorsWithItems,
    })
  }

  return result
}

export const getReceptionById = async (
  receptionId: string
): Promise<ReceptionWithDetails | null> => {
  const { data: reception, error: receptionError } = await supabase
    .from('receptions')
    .select(`
      id,
      reception_number,
      reception_date,
      counterparties(name)
    `)
    .eq('id', receptionId)
    .maybeSingle()

  if (receptionError) {
    throw new Error(`Ошибка загрузки приемки: ${receptionError.message}`)
  }

  if (!reception) {
    return null
  }

  const { data: motors, error: motorsError } = await supabase
    .from('accepted_motors')
    .select(`
      id,
      position_in_reception,
      motor_service_description,
      subdivisions(name)
    `)
    .eq('reception_id', reception.id)
    .order('position_in_reception', { ascending: true })

  if (motorsError) {
    throw new Error(`Ошибка загрузки двигателей: ${motorsError.message}`)
  }

  const motorsWithItems: MotorWithItems[] = []

  for (const motor of motors || []) {
    const { data: items, error: itemsError } = await supabase
      .from('reception_items')
      .select('id, item_description, work_group, transaction_type, quantity, price')
      .eq('accepted_motor_id', motor.id)

    if (itemsError) {
      throw new Error(`Ошибка загрузки позиций: ${itemsError.message}`)
    }

    motorsWithItems.push({
      id: motor.id,
      position_in_reception: motor.position_in_reception,
      motor_service_description: motor.motor_service_description,
      subdivision_name: (motor.subdivisions as any)?.name || 'Не указано',
      items: items || [],
    })
  }

  return {
    id: reception.id,
    reception_number: reception.reception_number || 'Без номера',
    reception_date: reception.reception_date,
    counterparty_name: (reception.counterparties as any)?.name || 'Не указан',
    motors: motorsWithItems,
  }
}
