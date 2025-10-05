import React, { useState, useEffect } from 'react'
import { AppLayout } from '../../components/Layout/AppLayout'
import { getAllReceptions, ReceptionWithDetails } from '../../services/archiveService'
import { useNavigate } from 'react-router-dom'
import { Alert } from '../../components/ui/Alert'

export const ArchiveList: React.FC = () => {
  const [receptions, setReceptions] = useState<ReceptionWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadReceptions = async () => {
      try {
        setLoading(true)
        const data = await getAllReceptions()
        setReceptions(data)
      } catch (err: any) {
        setError(err.message || 'Ошибка загрузки приемок')
      } finally {
        setLoading(false)
      }
    }

    loadReceptions()
  }, [])

  const handleReceptionClick = (receptionId: string) => {
    navigate(`/app/archive/${receptionId}`)
  }

  return (
    <AppLayout title="Архив">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        {error && <Alert variant="error" className="mb-4">{error}</Alert>}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Загрузка приемок...</p>
          </div>
        ) : receptions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Нет сохраненных приемок
          </div>
        ) : (
          <div className="space-y-3">
            {receptions.map((reception) => (
              <div
                key={reception.id}
                onClick={() => handleReceptionClick(reception.id)}
                className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {reception.reception_number}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Контрагент: {reception.counterparty_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{reception.reception_date}</p>
                    <p className="text-xs text-gray-500">
                      Двигателей: {reception.motors.length}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
