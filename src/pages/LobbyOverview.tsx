import * as React from 'react';
import {
  Box,
  Button,
  FormControl,
  Input, InputLabel,
  Modal, Select, SelectChangeEvent,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import MenuItem from '@mui/material/MenuItem';

const rows = [
  {
    id: '5ig540vrtj',
    lobby: 'jemaie\'s Game',
    mode: 'Words++',
    category: 'PvP',
    player: '2/4',
  },
  {
    id: 'd493gn434j',
    lobby: 'compilomatic\'s Game',
    mode: 'Sonic Fast',
    category: 'PvP',
    player: '2/3',
  },
  {
    id: '84nbl02snt',
    lobby: 'mp.\'s Game',
    mode: 'Together',
    category: 'Co-op',
    player: '2/2',
  },
  {
    id: '17fngptndv',
    lobby: 'bzns\'s Game',
    mode: 'Party',
    category: 'PvP',
    player: '2/6',
  },
];

const LobbyOverview = () => {
  
  const [open, setOpen] = React.useState(false);
  const [alignment, setAlignment] = React.useState('pvp');
  const [lobbyName, setLobbyName] = React.useState('jemaie\'s Game'); // get username as initial value + 'Game'
  const [lobbySize, setLobbySize] = React.useState('');

  const handleAlignmentChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    setAlignment(newAlignment);
  };
  const handleLobbyNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLobbyName(event.target.value);
  };
  const handleLobbySizeChange = (event: SelectChangeEvent) => {
    setLobbySize(event.target.value as string);
  };
  
  return (
    <Box sx={{ height:'100%', width:'90%', m:'auto' }}>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box
          sx={{
            display: 'flex',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60%',
            height: '60%',
            bgcolor: 'black',
            border: '4px solid #ffffff',
            boxShadow: 24,
          }}
        >
          <Box sx={{ width:'80%', height:'80%', m:'auto', border:'solid 2px white', textAlign:'center' }}>
            <ToggleButtonGroup
              color='primary'
              value={alignment}
              exclusive
              onChange={handleAlignmentChange}
              size='large'
              sx={{ m:2 }}
            >
              <ToggleButton value='pvp'>
                PvP
              </ToggleButton>
              <ToggleButton value='coop'>
                Co-op
              </ToggleButton>
              <ToggleButton value='solo'>
                Solo
              </ToggleButton>
            </ToggleButtonGroup>
            <Box component='form' noValidate sx={{ m:2 }}>
              <TextField variant='outlined' label='Lobby Name' value={lobbyName} onChange={handleLobbyNameChange}/>
            </Box>
            <Box>
              <FormControl sx={{ width:100, m:2 }}>
                <InputLabel>Lobby Size</InputLabel>
                <Select
                  value={lobbySize.toString()}
                  label="Lobby Size"
                  onChange={handleLobbySizeChange}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Stack direction='row'>
              <Button variant="contained">Cancel</Button>
              <Button variant="contained">Confirm</Button>
            </Stack>
          </Box>
        </Box>
      </Modal>
      <Stack sx={{ display:'flex', height:'100%' }}>
        <Box sx={{ m:'auto', mt:1, mb:4 }}>
          <Button variant="contained" onClick={() => setOpen(true)}>
            Create New Lobby
          </Button>
        </Box>
        <Box sx={{ flexGrow:1 }}>
          <DataGrid autoHeight disableSelectionOnClick
            sx={{ '&.MuiDataGrid-root.MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus':
              { outline:'none' }
            }}
            onRowClick={((params, event) => {
              event.defaultMuiPrevented = true;
              alert('JOIN LOBBY WITH ID: ' + params.id);
            })}
            columns={[
              {
                field: 'lobby',
                headerName: 'Lobby',
                flex: 1,
                minWidth: 150,
              },
              {
                field: 'mode',
                headerName: 'Mode',
                width: 100,
              },
              {
                field: 'category',
                headerName: 'Category',
                width: 100,
              },
              {
                field: 'player',
                headerName: 'Player',
                width: 100,
              },
            ]}
            rows={rows}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default LobbyOverview;