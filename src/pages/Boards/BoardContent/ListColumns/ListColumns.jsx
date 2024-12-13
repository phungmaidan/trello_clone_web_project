import Box from '@mui/material/Box'
import Column from './Comlumn/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import { toast } from 'react-toastify'
import { generatePlaceholderCard } from '~/utils/formatter'
import { createNewColumnAPI } from '~/apis'
import {
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { cloneDeep } from 'lodash'

function ListColumns({ columns }) {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const [newColumnTitle, setNewColumnTitle] = useState('')

  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error('Please Enter Column Title!')
      toggleOpenNewColumnForm()
      return
    }

    // Tạo dữ liệu Column để gọi API
    const newColumnData = {
      title: newColumnTitle
    }

    // Gọi API tạo mới Column và làm lại dữ liệu State Board
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // Cập nhật state board

    /**
     * Đoạn này sẽ dính lỗi object is not extensible vì dù đã coppy/clone ra giá trị newBoard nhưng bản chất của spread operator là Shallow Copy/Clone, nên dính phải rules Immutability trong Redux Toolkit không dùng được hàm PUSH (sửa giá trị mảng trực tiếp), cách đơn giản nhanh gọn nhất ở trường hợp này là dùng tới Deep Copy/Clone toàn bộ cái Board cho dễ hiểu và code ngắn gọn
     */
    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)

    /**
     * Cách khác: Có thể dùng array.concat thay cho push như docs của Redux Toolkit ở trên vì push sẽ thay đổi giá trị mảng trực tiếp, còn concat thì sẽ merge - ghép mảng lại và tạo ra một mảng mới để có thể gán lại giá trị
          const newBoard = {...board}
          newBoard.columns = newBoard.columns.concat([createdColumn])
          newBoard.columnOderIds = newBoard.columnOrderIds.concat([createdColumn._id])
     */

    // Cập nhật dữ liệu Board vào trong Redux Store
    dispatch(updateCurrentActiveBoard(newBoard))

    // Đóng trạng thái thêm Column mới và clean input
    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }
  /*
    * SortableContent yêu cầu items là một mảng động dạng ['id-1', 'id-2']
    chứ không phải [{id: 'id-1'}, {id: 'id-2'}]
    * Nếu không đúng thì vẫn kéo thả được nhưng không có animation
  */
  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}>
        {columns?.map(column => <Column key={column._id} column={column} />)}
        {/* Box Add new column */}
        {!openNewColumnForm
          ? <Box onClick={toggleOpenNewColumnForm} sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d'
          }}>
            <Button
              startIcon={<NoteAddIcon />}
              sx={{
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1
              }}
            >Add new column</Button>
          </Box>
          : <Box sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <TextField
              label="Enter Column Title..."
              type="text"
              size="small"
              variant="outlined"
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                }
              }}
            />
            <Box sx={{ display:'flex', alignItems: 'center', gap: 1 }}>
              <Button
                onClick={addNewColumn}
                variant="contained"
                color="success"
                size="small"
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                }}
              >Add Column</Button>
              <Button
                onClick={toggleOpenNewColumnForm}
                variant="contained"
                color="error"
                size="small"
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.error.main,
                  '&:hover': { bgcolor: (theme) => theme.palette.error.main }
                }}
              >Cancel</Button>
              {/* <CloseIcon
                fontSize='small'
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': { color: (theme) => theme.palette.warning.light },
                  display:'none'
                }}
                onClick={toggleOpenNewColumnForm}
              /> */}
            </Box>
          </Box>
        }
      </Box>
    </SortableContext>
  )
}

export default ListColumns
