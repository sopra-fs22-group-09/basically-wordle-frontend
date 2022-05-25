import * as React from 'react';
import {
  Box,
  Button,
  Slider,
  TextField,
  ToggleButton,
  ToggleButtonGroup, Typography,
} from '@mui/material';
import { useAppDispatch } from '../redux/hooks';
import { GameCategory, GameCategoryMaxSize, Lobby } from '../models/Lobby';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { LoadingOverlay } from '@mantine/core';
import { useEffect } from 'react';
import ModalTemplate from '../components/modal';

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
  const username = localStorage.getItem('userName');

  const [size, setSize] = React.useState(2);
  const [name, setName] = React.useState('');
  const [gameCategory, setGameCategory] = React.useState(Object.values(GameCategory)[0]);
  const toggleModal = () => {
    dispatch({ type: 'modal/toggle', payload: 'lobbyConfirmation' });
  };

  useEffect(() => {
    setName(username + '\'s Game');
  }, [setName, username]);

  const [createLobby, { loading }] = useMutation<LobbyType, MutationCreateLobbyArgs>(LOBBY_CREATION);
  const handleLobbyConfirmation = async (size: number, name: string, gameCategory: GameCategory) => {
    await createLobby({
      variables: {
        input: {
          size: gameCategory == GameCategory.SOLO ? 1 : size,
          name: name,
          gameCategory: Object.keys(GameCategory)[Object.values(GameCategory).indexOf(gameCategory)] as GameCategory
        }
      },
      onCompleted(data) {
        if (data?.createLobby) {
          navigate('/lobby/' + data.createLobby.id);
        }
      }
    }).then(() => {
      toggleModal();
    });
  };

  return (
    <ModalTemplate maxWidth="420px" name="lobbyConfirmation">
      <LoadingOverlay style={{ borderRadius: '4px' }} loaderProps={{ size: 'lg', variant: 'dots' }} overlayColor="#2C2E33" visible={loading}/>
      <ToggleButtonGroup color="primary" value={gameCategory} exclusive size="large" sx={{display: 'block'}}
        onChange={(event, newAlignment) => {if (newAlignment != null) setGameCategory(newAlignment); /*if (newAlignment == GameCategory.COOP && size > (GameCategoryMaxSize.get(newAlignment) as number)) setSize(4);*/}}>
        {(Object.values(GameCategory)).map(category => <ToggleButton key={category} value={category}>{category}</ToggleButton>)}
      </ToggleButtonGroup>
      <TextField variant='outlined' sx={{width: '100%', mt: '40px'}} inputProps={{ minLength: 3, maxLength: 50 }} label='Lobby Name' value={name} onChange={(event) => setName(event.target.value)}/>
      {gameCategory != GameCategory.SOLO &&
            <Box sx={{mt: '30px'}}>
              <Typography variant="body1" >Lobby Size: {size}</Typography>
              <Slider step={1} min={2} max={GameCategoryMaxSize.get(gameCategory)} valueLabelDisplay='auto' value={size} onChange={(_, newSize) => setSize(newSize as number)}/>
            </Box>
      }
      <Box sx={{mt: '30px'}}>
        <Button variant="contained" sx={{ mr: '1%' }} onClick={toggleModal}>Cancel</Button>
        <Button variant="contained" sx={{ ml: '1%' }} onClick={() => handleLobbyConfirmation(size, name, gameCategory)}>Confirm</Button>
      </Box>
    </ModalTemplate>
  );
};

export default LobbyConfirmation;
