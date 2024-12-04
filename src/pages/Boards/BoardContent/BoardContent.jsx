import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'

import {
  DndContext,
  //PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  //rectIntersection,
  getFirstCollision,
  //closestCenter
} from '@dnd-kit/core'
import { useState, useEffect, useCallback, useRef } from 'react'
import { arrayMove } from '@dnd-kit/sortable'

import Column from './ListColumns/Comlumn/Column'
import Card from './ListColumns/Comlumn/ListCards/Card/Card'
import { cloneDeep, over } from 'lodash'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

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

  // Cùng một thời điểm chỉ có một phần tử đang được kéo
  //(column hoặc card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  // Xử lý điểm va chạm cuối cùng trước đó (xử lý thuật toán phát hiện va chạm )
  const lastOverId = useRef(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  //Tìm một Column theo CardId
  const findColumnByCardId = (cardId) => {
    // Đoạn này cần lưu ý, nên dùng c.cards thay vì
    //c.cardOrderIds bởi vì ở bước handleDragOver
    //cần làm dữ liệu cho cards hoàn chỉnh trước rồi
    //mới tạo ra cardOrderIds mới.
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  // Function chung xử lý việc cập nhật lại state trong trường hợp di chuyển Card giữa các Column khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns(prevColumns => {
      // Tìm vị trí (index) của overCard trong column
      //đích (nơi card sắp được thả)
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

      // Logic tính toán "cardIndex mới" (trên hoặc dưới của overCard)
      //lấy chuẩn ra từ code của thư viện javascript
      let newCardIndex
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.card?.length + 1

      // Clone mảnh OrderedColumnsState cũ ra một mảng mới để xử lý data
      //rồi return - cập nhật lại OrderedColumnsState mới
      const nextColumns = cloneDeep(prevColumns)
      //console.log('newCardIndex: ', newCardIndex)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

      // Column cũ
      if (nextActiveColumn) {
        // Xoá card ở column active (column cũ,
        //trạng thái column khi kéo card ra khỏi nó
        //để sang column khác)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

        //Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      // nextOverColumn: Column mới
      if (nextOverColumn) {
        // Kiểm tra xem card đang kéo có tồn tại ở
        //overColumn chưa, nếu có thì cần xoá nó đi
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // Phải cập nhật lại chuẩn dữ liệu columnId trong card sau khi kéo Card giữa 2 Column khác nhau.
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        // Thêm card đang kéo vào overColumn theo
        //vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuild_activeDraggingCardData
        )

        //Cập nhật lại mảng nextOverColumn cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }
      return nextColumns
    })
  }

  // Trigger Khi bắt đầu kéo một phần tử
  const handleDragStart = (event) => {
    //console.log('handleDragStart', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    // Nếu là kéo card thì mới thực hiện hành động set giá trị oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  // Trigger trong quá trình kéo - thả phần tử
  const handleDragOver = (event) => {// Không làm gì thêm nếu đang kéo Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // Nếu kéo card thì xử lý thêm để có thể kéo
    //card qua lại giữa các columns
    //console.log('handleDragOver: ', event)
    const { active, over } = event

    // Kiểm tra nếu không tồn tại active hoặc over (lỗi khi kéo linh tinh ra ngoài)
    if (!active || !over) return

    // activeDraggingCard là card đang được kéo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // overCard là card trên hoặc dưới đang tương tác với card được kéo
    const { id: overCardId } = over

    // Tìm 2 columns theo cardId\
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)
    //console.log('activeColumn: ', activeColumn)
    //console.log('overColumn: ', overColumn)

    // Nếu không tồn tại 1 trong 2 column thì return
    //tránh crash web
    if (!activeColumn || !overColumn) return

    // Xử lý login chỉ khi kéo card qua 2 column khác
    //nhau, nếu kéo card trong chính column ban đầu
    //thì không làm gì
    // Vì đang là đoạn xử lý kéo (handleDragOver),
    //còn xử lý lúc kéo xong thì đây là vấn đề khác
    //ở (handleDragEnd)
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  // Trigger khi kết thúc hành động kéo - thả
  const handleDragEnd = (event) => {
    //console.log('handleDragEnd: ', event)
    const { active, over } = event

    // Cần đảm bảo nếu không tồn tại active hoặc over thì không làm gì
    if (!active || !over) return

    // Xử lý kéo - thả Card
    if (activeDragItemType == ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // activeDraggingCard là card đang được kéo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      // overCard là card trên hoặc dưới đang tương tác với card được kéo
      const { id: overCardId } = over

      // Tìm 2 columns theo cardId\
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      // Nếu không tồn tại 1 trong 2 column thì return tránh crash web
      if (!activeColumn || !overColumn) return

      // Phải dùng tới activeDragItemData.columnId hoặc oldColumnWhenDraggingCard._id (set vào state từ bước handleDragStart)
      //chứ không phải activeData trong scope handleDragEnd này vì sau khi qua
      //onDragOver tới đây là state của Card đã bị cập nhật một lần
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        // Hành động kéo - thả Card giữa 2 column khác nhau
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // Hành động kéo - thả Card trong cùng một column
        // Lấy vị trí cũ (từ oldColumnWhenDraggingCard)
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        // Lấy vị trí mới (từ over)
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)
        // Dùng arrayMove vì kéo Card trong một Column tương tự với logic kéo column trong cùng một board content
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        setOrderedColumns(prevColumns => {
          // Clone mảnh OrderedColumnsState cũ ra một mảng mới để xử lý data
          //rồi return - cập nhật lại OrderedColumnsState mới
          const nextColumns = cloneDeep(prevColumns)

          //Tìm tới Column mục tiêu đang thả
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)

          //Cập nhật lại 2 giá trị mới là card và cardOrderIds trong targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)

          // Trả về giá trị state mới (chuẩn vị trí)
          return nextColumns
        })
      }
    }

    // Xử lý kéo - thả Column
    if (activeDragItemType == ACTIVE_DRAG_ITEM_TYPE.COLUMN && active.id !== over.id) {
      // Nếu vị trí sau khi kéo thả khác vị trí ban đầu
      if (active.id !== over.id) {
        // Lấy vị trí cũ (từ active)
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        // Lấy vị trí mới (từ over)
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)

        // Dùng arrayMove của dnd-kit để sắp xếp lại mảng Columns ban đầu
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)

        // Xử lý gọi API
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
        // console.log('dndOrderedColumns: ', dndOrderedColumns)
        // console.log('dndOrderedColumnsIds: ', dndOrderedColumns)

        // Cập nhật lại state columns ban đầu sau khi đã kéo thả
        setOrderedColumns(dndOrderedColumns)
      }
    }

    // Những dữ liệu sau khi kéo thả luôn phải đưa về giá trị null mặc định ban đầu
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  //console.log('activeDragItemId', activeDragItemId)
  //console.log('activeDragItemType', activeDragItemType)
  //console.log('activeDragItemData', activeDragItemData)

  // Animation khi thả phần tử
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }

  // Custom lại thuật toán phát hiện va chạm tối ưu cho việc kéo - thả Card giữa nhiều Columns
  const collisionDetectionStrategy = useCallback((args) => {
    // Trường hợp kéo column thì dùng thuật toán clossetCorners
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ args })
    }

    // Tìm các điểm giao nhau, va chạm, trả về một mảng các va chạm - intersections với con trỏ
    const pointerIntersections = pointerWithin(args)

    // Fix triệt để bug flickering của thư viện Dnd-kit trong các trường hợp:
    //  - Kéo một cái card có image cover lớn và kéo lên phía trên cùng ra khỏi khu vực kéo thả
    if (!pointerIntersections?.length) return

    /*

    // Thuật toán phát hiện va chạm sẽ trả về một mảng các va chạm ở đây (Bước này hiện tại không cần thiết)
    const intersections = !!pointerIntersections?.length
      ? pointerIntersections
      : rectIntersection(args)
    let overId = getFirstCollision(intersections, 'id')

    */

    // Tìm overId đầu tiên trong đám pointerIntersections ở trên
    let overId = getFirstCollision(pointerIntersections, 'id')

    if (overId) {
      // Nếu cái over nó là column thì sẽ tìm tới cardId gần nhất bên trong khu vực va chạm
      //đó dựa vào thuật toán phát hiện va chạm closestCenter hoặc clossetCorners đều
      //được. Tuy nhiên ở đây dùng closestCorners mang lại trải nghiệm kéo - thả mượt hơn
      const checkColumn = orderedColumns.find(column => column._id === overId)
      if (checkColumn) {
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) &&
              (checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
      }

      lastOverId.current = overId
      return [{ id: overId }]
    }

    // Nếu overId là null thì trả về mảng rỗng - tránh bug crash trang
    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, orderedColumns])
  return (
    <DndContext
      sensors={mySensors}
      // Thuật toán phát hiện va chạm (nếu không có nó
      //thì Card với Cover lớn sẽ không kéo qua Column
      //được vì lúc này nó đang bị conflict giữa Card và Column),
      //vì vậy cần dùng closestCorners thay vì closestCenter

      // Custom lại thuật toán phát hiện va chạm
      collisionDetection={collisionDetectionStrategy}

      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemData && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <Column column={activeDragItemData} />)}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragItemData} />)}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
