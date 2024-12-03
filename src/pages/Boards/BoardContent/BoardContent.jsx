import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'

import {
  DndContext,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { useState, useEffect } from 'react'
import { arrayMove } from '@dnd-kit/sortable'

function BoardContent({ board }) {
  // Nếu dùng pointerSensor mặc định thì phải kết hợp thuộc tính CSS touch-action: none
  //ở những phần tử kéo nhưng vẫn bug
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  // Yêu cầu chuột di chuyển 10px thì mới kịch hoạt event, fix trường hợp click bị gọi event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  // Nhấn giữ 250ms và dung sai của cảm ứng (di chuyển chênh lệch 500px) thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  const mySensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragEnd = (event) => {
    //console.log('handleDragEnd: ', event)
    const { active, over } = event

    // Kiểm tra nếu không tồn tại over (lỗi khi kéo linh tinh ra ngoài)
    if (!over) return

    // Nếu vị trí sau khi kéo thả khác vị trí ban đầu
    if (active.id !== over.id) {
      // Lấy vị trí cũ
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      // Lấy vị trí mới
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)

      // Dùng arrayMove của dnd-kit để sắp xếp lại mảng Columns ban đầu
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)

      // Xử lý gọi API
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      // console.log('dndOrderedColumns: ', dndOrderedColumns)
      // console.log('dndOrderedColumnsIds: ', dndOrderedColumns)

      // Cập nhật lại state columns ban đầu sau khi đã kéo thả
      setOrderedColumns(dndOrderedColumns)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={mySensors}>
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns}/>
      </Box>
    </DndContext>
  )
}

export default BoardContent
