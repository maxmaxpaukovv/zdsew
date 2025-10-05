import React, { useState, useEffect } from 'react'
import { AppLayout } from '../../components/Layout/AppLayout'
import { useParams, useNavigate } from 'react-router-dom'
import { getReceptionById, ReceptionWithDetails } from '../../services/archiveService'
import { EditableReceptionView } from '../../components/Archive/EditableReceptionView'
import { Alert } from '../../components/ui/Alert'
import { ArrowLeft } from 'lucide-react'

export const ArchiveDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [reception, setReception] = useState<ReceptionWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadReception = async () => {
      if (!id) {
        setError('ID приемки не указан')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await getReceptionById(id)
        if (data) {
          setReception(data)
        } else {
          setError('Приемка не найдена')
        }
      } catch (err: any) {
        setError(err.message || 'Ошибка загрузки приемки')
      } finally {
        setLoading(false)
      }
    }

    loadReception()
  }, [id])

  const handleBack = () => {
    navigate('/app/archive')
  }

  return (
    <AppLayout
      title={reception ? `Редактирование приемки ${reception.reception_number}` : 'Загрузка...'}
      breadcrumbs={[
        { label: 'Архив', path: '/app/archive' },
        { label: reception?.reception_number || 'Загрузка...', path: `/app/archive/${id}` },
      ]}
    >
      <div className="space-y-4">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Назад к списку</span>
        </button>

        {error && <Alert variant="error">{error}</Alert>}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Загрузка приемки...</p>
          </div>
        ) : reception ? (
          <EditableReceptionView reception={reception} />
        ) : null}
      </div>
    </AppLayout>
  )
}
