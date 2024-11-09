import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Progress } from 'reactstrap'
import Swal from 'sweetalert2'

interface Item {
  id: number
  content: string
}

interface Column {
  id: string
  title: string
  item: Item | null
}

export interface DragDropAgreementProps {
  answers: string[],
  question: string,
  current: number,
  total: number,
  next: (answers: number[]) => void
}

const progressMessages = (current: number, total: number) => {
  if (current === 0) {
    return 'Comenzando...'
  }

  if (current < 5) {
    return "¡Vamos bien!"
  }

  if (current === 5) {
    return "¡Ya hicimos la mitad! ¿Viste que no era tanto?"
  }

  if (current < 9) {
    return 'Vas por buen camino... ¡Falta menos!'
  }

  if (current < 11) {
    return '¡Ya casi terminamos!'
  }

  if (current === 11) {
    return '¡Última pregunta!'
  }

}

export default function DragDropAgreement({ answers, question, next, current, total }: DragDropAgreementProps) {
  const [columns, setColumns] = useState<{ [key: string]: Column }>({
    totallyAgree: {
      id: 'totallyAgree',
      title: 'Muy de acuerdo',
      item: null
    },
    agree: {
      id: 'agree',
      title: 'De acuerdo',
      item: null
    },
    notAgree: {
      id: 'notAgree',
      title: 'Poco de acuerdo',
      item: null
    },
    absolutelyNotAgree: {
      id: 'absolutelyNotAgree',
      title: 'Nada de acuerdo',
      item: null
    }
  })

  const [availableResponses, setAvailableResponses] = useState<Item[]>([])

  useEffect(() => {
    setColumns({
      totallyAgree: {
        id: 'totallyAgree',
        title: 'Muy de acuerdo',
        item: null
      },
      agree: {
        id: 'agree',
        title: 'De acuerdo',
        item: null
      },
      notAgree: {
        id: 'notAgree',
        title: 'Poco de acuerdo',
        item: null
      },
      absolutelyNotAgree: {
        id: 'absolutelyNotAgree',
        title: 'Nada de acuerdo',
        item: null
      }
    });
    setAvailableResponses(answers.map((answer: string, index: number) => ({
      id: index,
      content: answer
    })))
  }, [answers, question])

  const [draggingItem, setDraggingItem] = useState<Item | null>(null)

  const onDragStart = (e: React.DragEvent, item: Item) => {
    setDraggingItem(item)
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const onDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault()
    if (!draggingItem) return

    console.log(targetColumnId)

    setColumns(prevColumns => {
      const updatedColumns = { ...prevColumns }

      // Remove item from its original column if it was in a column
      Object.values(updatedColumns).forEach(column => {
        if (column.item && column.item.id === draggingItem.id) {
          column.item = null
        }
      })

      // Add item to the target column, replacing any existing item
      const existingItem = updatedColumns[targetColumnId].item
      updatedColumns[targetColumnId].item = draggingItem

      // Update available responses
      setAvailableResponses(prev => {
        const newAvailable = prev.filter(item => item.id !== draggingItem.id)
        if (existingItem) {
          newAvailable.push(existingItem)
        }
        return newAvailable
      })

      return updatedColumns
    })

    setDraggingItem(null)
  }

  const onDropToAvailable = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggingItem) return

    setColumns(prevColumns => {
      const updatedColumns = { ...prevColumns }

      // Remove item from its column
      Object.values(updatedColumns).forEach(column => {
        if (column.item && column.item.id === draggingItem.id) {
          column.item = null
        }
      })

      return updatedColumns
    })

    setAvailableResponses(prev => {
      if (prev.some(item => item.id === draggingItem.id)) return prev
      return [...prev, draggingItem]
    })
    setDraggingItem(null)
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      height: '100%',
    }}>
      <div>
        <p style={{
          textAlign: 'left',
          marginBottom: '2rem',
          color: '#6b7280',
          fontSize: 'small',
        }}>
          A continuación se presentan cuatro afirmaciones que deberás ordenar según consideres más o menos efectivo. <br />
          Cada afirmación debe ser ubicada en alguna de las cuatro posibles columnas y no puede haber más de una afirmación por columna. <br />
          Al finalizar, se calculará tu estilo de aprendizaje basado en tus respuestas. <br />
        </p>
        <h5>{question}</h5>
        <div
          className="flex flex-wrap gap-2 min-h-[100px] bg-gray-50 rounded p-4 flex-row d-flex align-items-center justify-content-center"
          style={{
            height: '18vmin'
          }}
          onDragOver={onDragOver}
          onDrop={onDropToAvailable}
        >
          {availableResponses.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => onDragStart(e, item)}
              className="p-2 bg-white rounded shadow cursor-move"
              style={{
                width: 'fit-content',
                fontSize: '2vmin'
              }}
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>
      <div className="d-flex flex-row gap-4 w-100">
        {Object.entries(columns).map(([columnId, column]) => (
          <Card key={columnId} style={{
            flex: '1 1 0',
            width: '0',
            height: '30vh'
          }}>
            <CardHeader>
              <CardTitle>{column.title}</CardTitle>
            </CardHeader>
            <CardBody>
              <div
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, columnId)}
                className="min-h-[100px] bg-gray-50 rounded p-2 d-flex align-items-center justify-content-center"
                style={{
                  height: '100%'
                }}
              >
                {column.item ? (
                  <div
                    draggable
                    onDragStart={(e) => onDragStart(e, column.item!)}
                    className="p-2 bg-white rounded shadow cursor-move w-full text-center"
                    style={{
                      width: 'fit-content',
                      fontSize: 'small'
                    }}
                  >
                    {column.item.content}
                  </div>
                ) : (<div></div>)}
              </div>
            </CardBody>
          </Card>
        ))}

      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          gap: '1rem',
          overflowY: 'auto',
          alignItems: 'center',
          flex: '1',
        }}
      >
        <div style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          overflowY: 'auto',
          justifyContent: 'center',
          
        }}>
          <Progress animated className="my-3" value={Math.round(((current + 1) / total) * 100)}>{progressMessages(current, total)}</Progress>
          <span
            style={{
              textAlign: 'center',
              color: '#6b7280',
              fontSize: 'small',
            }}
          >
            Pregunta {current + 1} de {total}
          </span>
        </div>


        <div className='d-flex flex-row'>
          <button className='btn-purple-1' onClick={() => {
            const responses = Object.values(columns).reverse().map(column => column?.item?.id);
            if (responses.some(response => response === undefined)) {
              Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'Por favor, completá todas las columnas antes de continuar.'
              })
              return
            }
            next(responses as number[]);
          }}>
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}