import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import FilterListIcon from '@mui/icons-material/FilterList'
import BoltIcon from '@mui/icons-material/Bolt'
import Box from '@mui/material/Box'
import AvatarGroup from '@mui/material/AvatarGroup'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Tooltip from '@mui/material/Tooltip'

const MENU_STYLE = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root' : {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar() {
  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        paddingX: 2,
        overflowX: 'auto',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        '&::-webkit-scrollbar-track': { m: 2 }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MENU_STYLE}
          icon={<DashboardIcon />}
          label="Main Board"
          clickable
        />
        <Chip
          sx={MENU_STYLE}
          icon={<VpnLockIcon />}
          label="Puclic/Private Workspace"
          clickable
        />
        <Chip
          sx={MENU_STYLE}
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          clickable
        />
        <Chip
          sx={MENU_STYLE}
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />
        <Chip
          sx={MENU_STYLE}
          icon={<FilterListIcon />}
          label="Filter"
          clickable
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color:'white',
            borderColor:'white',
            '&:hover': { borderColor:'white' }
          }}
        > Invite
        </Button>
        <AvatarGroup
          max={3}
          sx={{
            gap:'10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be' }
            }
          }}
        >
          <Tooltip title="user">
            <Avatar
              alt="My-Avartar"
              src="https://yt3.ggpht.com/ytc/AIf8zZQw4Qsz9usQG1p4cAIEdnJnPb0w0PXXMt-IlfjQCS-DOxIAuWFs1CeSeJ29mAET=s88-c-k-c0x00ffffff-no-rj" />
          </Tooltip>
          <Tooltip title="user">
            <Avatar
              alt="My-Avartar"
              src="https://yt3.ggpht.com/ytc/AIf8zZQw4Qsz9usQG1p4cAIEdnJnPb0w0PXXMt-IlfjQCS-DOxIAuWFs1CeSeJ29mAET=s88-c-k-c0x00ffffff-no-rj" />
          </Tooltip>
          <Tooltip title="user">
            <Avatar
              alt="My-Avartar"
              src="https://yt3.ggpht.com/ytc/AIf8zZQw4Qsz9usQG1p4cAIEdnJnPb0w0PXXMt-IlfjQCS-DOxIAuWFs1CeSeJ29mAET=s88-c-k-c0x00ffffff-no-rj" />
          </Tooltip>
          <Tooltip title="user">
            <Avatar
              alt="My-Avartar"
              src="https://yt3.ggpht.com/ytc/AIf8zZQw4Qsz9usQG1p4cAIEdnJnPb0w0PXXMt-IlfjQCS-DOxIAuWFs1CeSeJ29mAET=s88-c-k-c0x00ffffff-no-rj" />
          </Tooltip>
          <Tooltip title="user">
            <Avatar
              alt="My-Avartar"
              src="https://yt3.ggpht.com/ytc/AIf8zZQw4Qsz9usQG1p4cAIEdnJnPb0w0PXXMt-IlfjQCS-DOxIAuWFs1CeSeJ29mAET=s88-c-k-c0x00ffffff-no-rj" />
          </Tooltip>
          <Tooltip title="user">
            <Avatar
              alt="My-Avartar"
              src="https://yt3.ggpht.com/ytc/AIf8zZQw4Qsz9usQG1p4cAIEdnJnPb0w0PXXMt-IlfjQCS-DOxIAuWFs1CeSeJ29mAET=s88-c-k-c0x00ffffff-no-rj" />
          </Tooltip>
          <Tooltip title="user">
            <Avatar
              alt="My-Avartar"
              src="https://yt3.ggpht.com/ytc/AIf8zZQw4Qsz9usQG1p4cAIEdnJnPb0w0PXXMt-IlfjQCS-DOxIAuWFs1CeSeJ29mAET=s88-c-k-c0x00ffffff-no-rj" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
