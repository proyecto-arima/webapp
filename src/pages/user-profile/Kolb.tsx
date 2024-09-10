import React, { useState } from 'react'
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap'

interface Item {
  id: string
  content: string
}

interface Column {
  id: string
  title: string
  item: Item | null
}

export interface DragDropAgreementProps {
  answers: string[],
  question: string
}

export default function DragDropAgreement({ answers, question }: DragDropAgreementProps) {
  const [columns, setColumns] = useState<{ [key: string]: Column }>({
    totallyAgree: {
      id: 'totallyAgree',
      title: 'Muy efectivo',
      item: null
    },
    agree: {
      id: 'agree',
      title: 'Efectivo',
      item: null
    },
    notAgree: {
      id: 'notAgree',
      title: 'Poco efectivo',
      item: null
    },
    absolutelyNotAgree: {
      id: 'absolutelyNotAgree',
      title: 'Nada efectivo',
      item: null
    }
  })

  const [availableResponses, setAvailableResponses] = useState<Item[]>(answers.map((answer: string, index: number) => ({
    id: index.toString(),
    content: answer
  })))

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

    setAvailableResponses(prev => [...prev, draggingItem])
    setDraggingItem(null)
  }

  return (
    <div>
      <div>
        <p style={{
          textAlign: 'left',
          marginBottom: '2rem',
          color: '#6b7280'
        }}>
          A continuación se presentan cuatro afirmaciones que deberás ordenar según consideres más o menos efectivo. <br />
          Cada afirmación debe ser ubicada en alguna de las cuatro posibles columnas y no puede haber más de una afirmación por columna. <br />
          Al finalizar, se calculará tu estilo de aprendizaje basado en tus respuestas. <br />
        </p>
        <h3>{question}</h3>
        <div
          className="flex flex-wrap gap-2 min-h-[100px] bg-gray-50 rounded p-4 flex-row d-flex align-items-center justify-content-center"
          style={{
            height: '90px'
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
                width: 'fit-content'
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
            height: '300px'
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
                      width: '250px'
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

    </div>
  )
}