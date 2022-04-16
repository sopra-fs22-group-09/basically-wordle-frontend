import * as React from 'react';
import { useEffect } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { gql, useMutation, useSubscription } from '@apollo/client';
import {
  DefaultModePerCategory,
  GameCategorization,
  GameCategory,
  GameMode,
  Lobby as LobbyFields,
  MutationJoinLobbyByIdArgs
} from '../models/Lobby';
import { User } from '../models/User';

//get default categories ??
const wordCategories = [
  { category: 'bitches' },
  { category: 'hoes' },
  { category: 'cats' },
];

interface LobbyModel {
  joinLobbyById: LobbyFields
  lobby: LobbyFields
}

const JOIN_LOBBY = gql`
  mutation joinLobby($id: String!) {
    joinLobbyById(id: $id) {
      id
      name
      size
      gameCategory
      players {
        id
        username
      }
      #gameSettings
    }
  }
`;

const LOBBY_SUBSCRIPTION = gql`
  subscription subscribeLobby {
    lobby {
      id
      size
      name
      gameCategory
      players {
        id
        username
      }
      #gameSettings
    }
  }
`;

const Lobby = () => {

  const [token] = useLocalStorage<string>({ key: 'token' });
  const [name, setName] = React.useState('');
  const [size, setSize] = React.useState(1); //get initial size
  const [gameCategory, setGameCategory] = React.useState<GameCategory>(GameCategory.PVP);
  const [gameMode, setGameMode] = React.useState<GameMode>(GameMode.WORDSPP); //get initial mode ??
  const [gameRounds, setGameRounds] = React.useState(3); //get initial rounds
  const [players, setPlayers] = React.useState<User[]>([]);

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [joinLobby, { data, loading, error }] = useMutation<LobbyModel, MutationJoinLobbyByIdArgs>(JOIN_LOBBY);
  useEffect(() => {
    joinLobby({
      variables: {
        id: window.location.pathname.split('/')[2]
      }, onCompleted(data) {
        if (data?.joinLobbyById) {
          setName(data.joinLobbyById.name);
          setSize(data.joinLobbyById.size);
          setGameCategory(Object.values(GameCategory)[Object.keys(GameCategory).indexOf(data.joinLobbyById.gameCategory)]);
          setPlayers(data.joinLobbyById.players);
        }
      }
    }).then(() => {
      setGameMode(DefaultModePerCategory.get(gameCategory) as GameMode);
    });
  }, [joinLobby, gameCategory]);

  function UpdateLobby() {
    const { data, loading } = useSubscription<LobbyModel>(LOBBY_SUBSCRIPTION);/*, {
      variables: {
        id: localStorage.getItem('lobbyID')
      }
    });*/
    useEffect(() => {
      if (!loading && data?.lobby) {
        setName(data.lobby.name);
        setSize(data.lobby.size); //only for testing
      }
    }, [data, loading]);
  }
  UpdateLobby();

  return (
    <Box
      sx={{
        width:'90%',
        mx:'auto',
        mt: '2.5%',
        textAlign: 'center'
      }}
    >
      <Typography variant='h1' sx={{fontSize: 48}}>
        {name} | {gameCategory}
      </Typography>
      <Box sx={{ width: '66%!important', float: 'left', border:'solid 2px white' }}>
        <Box sx={{ width: '49%', border:'solid 2px red', float: 'left' }}>
          <Typography variant='h5'>
            players
          </Typography>
          <List>
            {players?.map(player => {
              return (
                <ListItem key={player.id}>
                  {player.username}
                </ListItem>
              );
            })}
          </List>
        </Box>
        <Box sx={{ width: '49%', border:'solid 2px red', float: 'right' }}>
          <Typography variant='h5'>
            settings
          </Typography>
          <Typography variant='h3'>
          </Typography>
          <FormControl sx={{ width:150, m:2 }}>
            <InputLabel>Game Mode</InputLabel>
            <Select
              value={gameMode}
              label="Game Mode"
              onChange={(event) => setGameMode(event.target.value as GameMode)}
            >
              {(Object.values(GameMode)).map(mode => {
                return (
                  <MenuItem key={mode} value={mode} disabled={gameCategory != GameCategorization.get(mode)}>
                    {mode}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Typography variant='h6'>Lobby Size</Typography>
          <Slider
            sx={{ m:'auto', width:'80%' }}
            marks
            step={1}
            min={1}
            max={6}
            valueLabelDisplay='auto'
            value={size}
            onChange={(event, newSize) => setSize(newSize as number)}
          />
          <Typography variant='h6'>Rounds</Typography>
          <Slider
            sx={{ m:'auto', width:'80%' }}
            marks
            step={1}
            min={1}
            max={3}
            valueLabelDisplay='auto'
            value={gameRounds}
            onChange={(event, newRounds) => setGameRounds(newRounds as number)}
          />
          <Autocomplete //TODO: wie chume a di usgwählte?
            sx={{ m:'auto', width:'80%' }}
            multiple
            readOnly={!token}
            disableCloseOnSelect
            options={wordCategories}
            getOptionLabel={(option) => option.category}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.category}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} placeholder="Word Categories" />
            )}
          />
        </Box>
        <br />
        <Box sx={{clear: 'both', width: '66%', maxWidth: 500, mt: 38, mx: 'auto', textAlign: 'left', border:'solid 2px red'}}>
          <TextField
            type='text'
            defaultValue='this is a link to copy'
            variant='outlined'
            InputProps={{ readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <Button>
                    COPY
                  </Button>
                </InputAdornment>)}}
            sx={{
              width: '100%'
            }}
          />
          <br />
          <Button variant="contained" sx={{ mt:2 }}>Leave Lobby</Button>
          <Button variant="contained" sx={{ mt:2, float: 'right'}}>Start Game</Button>
        </Box>
      </Box>
      <Box sx={{ float: 'right', width: '33%!important', height: 'calc(100vh - 147px)', border:'solid 2px white' }}>
        chat
      </Box>
    </Box>
  );
};

export default Lobby;