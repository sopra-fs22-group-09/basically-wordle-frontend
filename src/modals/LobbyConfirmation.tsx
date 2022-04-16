import * as React from 'react';
import { Box, Button, Modal, Slider, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { GameCategory, Lobby } from '../models/Lobby';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

export type LobbyInput = {
  size: number;
  name: string;
  gameCategory: GameCategory;
};

export type MutationCreateLobbyArgs = {
  input: LobbyInput;
};

interface LobbyType {
  createLobby: Lobby;
}

const LOBBY_CREATION = gql`
  mutation createLobby($input: LobbyInput!) {
    createLobby(input: $input) {
      id
      size
      name
      gameCategory
    }
  }
`;

const LobbyConfirmation = () => {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const open = useAppSelector(state => state.modal.isOpen && state.modal.modalWindow == 'lobbyConfirmation');
  const [size, setSize] = React.useState(2); //get initial size
  const [name, setName] = React.useState('jemaie\'s Game'); // TODO: get username as initial value + 'Game'
  const [gameCategory, setGameCategory] = React.useState(Object.values(GameCategory)[0]); //get initial category
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [createLobby, { data, loading, error }] = useMutation<LobbyType, MutationCreateLobbyArgs>(LOBBY_CREATION);

  const toggleModal = () => {
    dispatch({ type: 'modal/toggle', payload: 'lobbyConfirmation' });
  };
  const handleLobbyConfirmation = (size: number, name: string, gameCategory: GameCategory) => {
    createLobby({
      variables: {
        input: {
          size: size,
          name: name,
          gameCategory: Object.keys(GameCategory)[Object.values(GameCategory).indexOf(gameCategory)] as GameCategory
        }
      },
      onCompleted(data) {
        if (data?.createLobby) {
          localStorage.setItem('lobbyId', data.createLobby.id); //only for testing
          navigate('/lobby/' + data.createLobby.id); //probably only for testing as well
        }
      }
    }).then(() => {
      toggleModal();
    });
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
          boxShadow: 24,
        }}
      >
        <Box sx={{ width:'80%', height:'80%', m:'auto', textAlign:'center' }}>
          <ToggleButtonGroup
            color='primary'
            value={gameCategory}
            exclusive
            onChange={(event, newAlignment) => {
              if (newAlignment != null)
                setGameCategory(newAlignment);
            }}
            size='large'
            sx={{ m:2 }}
          >
            {(Object.values(GameCategory)).map(category => {
              return (
                <ToggleButton key={category} value={category}>
                  {category}
                </ToggleButton>
              );
            })}
          </ToggleButtonGroup>
          <Box component='form' noValidate sx={{ m:2 }}>
            <TextField variant='outlined' label='Lobby Name' value={name}
              onChange={(event) => setName(event.target.value)}
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
                value={size}
                onChange={(event, newSize) => setSize(newSize as number)}
              />
            </Box>
          </Box>
          <Box sx={{ m:2 }}>
            <Button variant="contained" sx={{ mr:2 }} onClick={toggleModal}>Cancel</Button>
            <Button variant="contained" sx={{ ml:2 }} onClick={() =>
            {handleLobbyConfirmation(size, name, gameCategory);}}>Confirm
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default LobbyConfirmation;
