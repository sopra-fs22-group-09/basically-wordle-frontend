import * as React from 'react';
import {
  Box, Button,
  FormControl, Input,
  InputLabel, Modal, Select,
  SelectChangeEvent, Slider,
  TextField,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import MenuItem from '@mui/material/MenuItem';

const LobbyConfirmation = () => {

  const dispatch = useAppDispatch();

  const open = useAppSelector(state => state.modal.isOpen && state.modal.modalWindow == 'lobbyConfirmation');
  const [alignment, setAlignment] = React.useState('pvp'); //get initial category
  const [lobbyName, setLobbyName] = React.useState('jemaie\'s Game'); // get username as initial value + 'Game'
  const [lobbySize, setLobbySize] = React.useState(2); //get initial size

  const toggleModal = () => {
    dispatch({ type: 'modal/toggle', payload: 'lobbyConfirmation' });
  };
  const handleLobbyConfirmation = () => {
    toggleModal();
    alert('Category: ' + alignment + '\nName: ' + lobbyName + '\nSize: ' + lobbySize);
  };

  return (
    <Modal
      open={open}
      onClose={toggleModal}
    >
      <Box
        sx={{
          display: 'flex',
          position: 'absolute',
          width: '60%',
          height: '60%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'black',
          border: '4px solid #ffffff',
          boxShadow: 24,
        }}
      >
        <Box sx={{ width:'80%', height:'80%', m:'auto', textAlign:'center' }}>
          <ToggleButtonGroup
            color='primary'
            value={alignment}
            exclusive
            onChange={(event, newAlignment) => setAlignment(newAlignment)}
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
            <TextField variant='outlined' label='Lobby Name' value={lobbyName}
              onChange={(event) => setLobbyName(event.target.value)}
            />
          </Box>
          <Box>
            <Box>
              Lobby Size (Decide between InputField and Slider!)
              <Slider
                sx={{ m:'auto', width:'60%' }}
                marks
                step={1}
                min={1}
                max={6}
                valueLabelDisplay='auto'
                value={lobbySize}
                onChange={(event, newSize) => setLobbySize(newSize as number)}
              />
            </Box>
          </Box>
          <Box sx={{ m:2 }}>
            <Button variant="contained" sx={{ mr:2 }} onClick={toggleModal}>Cancel</Button>
            <Button variant="contained" sx={{ ml:2 }} onClick={handleLobbyConfirmation}>Confirm</Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default LobbyConfirmation;