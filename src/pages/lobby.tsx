import * as React from 'react';
import { useEffect } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  debounce,
  FormControl,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  Slider,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { gql, useMutation, useSubscription } from '@apollo/client';
import {
  GameCategorization,
  GameCategory,
  GameMode,
  LobbyModels,
  MutationJoinLobbyByIdArgs,
  MutationUpdateLobbySettingsArgs,
  SubscriptionLobbyArgs
} from '../models/Lobby';
import { User } from '../models/User';
import { useNavigate, useParams } from 'react-router-dom';

//get default categories ??
const wordCategories = [
  { category: 'bitches' },
  { category: 'hoes' },
  { category: 'cats' },
];

const JOIN_LOBBY = gql`
  mutation joinLobby($id: String!) {
    joinLobbyById(id: $id) {
      id
      name
      size
      owner {
        id
      }
      gameCategory
      gameMode
      game {
        amountRounds
        roundTime
      }
      players {
        id
        username
      }
    }
  }
`;

const LOBBY_SUBSCRIPTION = gql`
  subscription subscribeLobby($id: String!) {
    lobby(id: $id) {
      owner {
        id
      }
      gameMode
      game {
        amountRounds
        roundTime
      }
      players {
        id
        username
      }
    }
  }
`;

const CHANGE_LOBBY = gql`
  mutation updateLobby($id: String!, $gameSettings: GameSettingsInput!) {
    updateLobbySettings(id: $id, gameSettings: $gameSettings) {
      id
    }
  }
`;

const Lobby = () => {

  const params = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  const [name, setName] = React.useState('');
  const [size, setSize] = React.useState(0);
  const [owner, setOwner] = React.useState('');
  const [gameCategory, setGameCategory] = React.useState<GameCategory>(GameCategory.PVP);
  const [gameMode, setGameMode] = React.useState<GameMode>(GameMode.WORDSPP);
  const [gameRounds, setGameRounds] = React.useState(0);
  const [roundTime, setRoundTime] = React.useState(0);
  const [players, setPlayers] = React.useState<User[]>([]);

  function JoinLobby() {
    // eslint-disable-next-line unused-imports/no-unused-vars
    const [joinLobby, { data, loading, error }] = useMutation<LobbyModels, MutationJoinLobbyByIdArgs>(JOIN_LOBBY);
    useEffect(() => {
      joinLobby({
        variables: {
          id: params.id as string
        }, onCompleted(data) {
          if (data?.joinLobbyById) {
            setName(data.joinLobbyById.name);
            setSize(data.joinLobbyById.size);
            setOwner(data.joinLobbyById.owner.id);
            setGameCategory(Object.values(GameCategory)[Object.keys(GameCategory).indexOf(data.joinLobbyById.gameCategory)]);
            setGameMode(Object.values(GameMode)[Object.keys(GameMode).indexOf(data.joinLobbyById.gameMode)]);
            setGameRounds(data.joinLobbyById.game.amountRounds);
            setRoundTime(data.joinLobbyById.game.roundTime);
            setPlayers(data.joinLobbyById.players);
          }
        }
      });
    }, [joinLobby]);
  }
  JoinLobby();

  function UpdateLobby() {
    const { data, loading } = useSubscription<LobbyModels, SubscriptionLobbyArgs>(LOBBY_SUBSCRIPTION, {
      variables: {
        id: params.id as string
      }
    });
    useEffect(() => {
      if (!loading && data?.lobby) {
        setOwner(data.lobby.owner.id);
        setGameMode(Object.values(GameMode)[Object.keys(GameMode).indexOf(data.lobby.gameMode)]);
        setGameRounds(data.lobby.game.amountRounds);
        setRoundTime(data.lobby.game.roundTime);
        setPlayers(data.lobby.players);
      }
    }, [data, loading]);
  }
  UpdateLobby();

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [changeLobby, { data, loading, error }] = useMutation<LobbyModels, MutationUpdateLobbySettingsArgs>(CHANGE_LOBBY);
  const changeLobbySettings = (gameMode: GameMode, amountRounds: number, roundTime: number) => {
    changeLobby({
      variables: {
        id: params.id as string,
        gameSettings: {
          gameMode: Object.keys(GameMode)[Object.values(GameMode).indexOf(gameMode)] as GameMode,
          amountRounds: amountRounds,
          roundTime: roundTime
        }
      }
    });
  };
  const [stateDebounceLobbyChange] = React.useState(() => debounce(changeLobbySettings, 250));

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
        {name} | {gameCategory} [{size}]
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
          <FormControl sx={{ minWidth:150, width:'auto', mt:3 }}>
            <InputLabel>Game Mode</InputLabel>
            <Select
              value={gameMode}
              label="Game Mode"
              disabled={localStorage.getItem('userId') != owner}
              onChange={event => changeLobbySettings(event.target.value as GameMode, gameRounds, roundTime)}
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
          {gameRounds != 0 &&
            <Box sx={{ m:'auto', mt:2, width:'80%' }}>
              <Typography variant='h6'>Rounds: {gameRounds}</Typography>
              <Slider
                sx={{ m:'auto' }}
                marks
                step={1}
                min={1}
                max={5}
                valueLabelDisplay='auto'
                value={gameRounds}
                disabled={localStorage.getItem('userId') != owner}
                onChange={(event, newRounds) => {
                  setGameRounds(newRounds as number);
                  stateDebounceLobbyChange(gameMode, newRounds as number, roundTime);
                }}
              />
            </Box>
          }
          {roundTime != 0 &&
              <Box sx={{ m:'auto', mt:2, width:'80%' }}>
                <Typography variant='h6'>Time: {roundTime}</Typography>
                <Slider
                  sx={{ m:'auto' }}
                  marks
                  step={10}
                  min={0}
                  max={300}
                  valueLabelDisplay='auto'
                  value={roundTime}
                  disabled={localStorage.getItem('userId') != owner}
                  onChange={(event, newTime) => {
                    setRoundTime(newTime as number);
                    stateDebounceLobbyChange(gameMode, gameRounds, newTime as number);
                  }}
                />
              </Box>
          }
          <Autocomplete //TODO: HOW TO GATHER THE CATEGORIES AND SEND THEM TO THE SERVER?
            sx={{ m:'auto', mt:3,  width:'80%' }}
            multiple
            readOnly={true}
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
              <TextField {...params} placeholder="Word Categories (Disabled)" />
            )}
          />
        </Box>
        <Box sx={{clear: 'both', width: '80%', maxWidth: 600, mt: 38, mx: 'auto', textAlign: 'center', border:'solid 2px red'}}>
          <TextField
            type='text'
            defaultValue={window.location.host + window.location.pathname}
            variant='outlined'
            InputProps={{ readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title={'Copied to clipboard!'} open={copied} leaveDelay={1500} onClose={() => setCopied(false)}>
                    <Button variant='contained' onClick={() => {
                      navigator.clipboard.writeText(window.location.host + window.location.pathname);
                      setCopied(true);
                    }}>
                      COPY
                    </Button>
                  </Tooltip>
                </InputAdornment>)}}
            sx={{
              width: '100%'
            }}
          />
          <Button variant="contained" sx={{ mx:2, mt:2 }} onClick={() => navigate('/')}>Leave Lobby</Button>
          <Button variant="contained" sx={{ mx:2, mt:2 }}>Start Game</Button>
        </Box>
      </Box>
      <Box sx={{ float: 'right', width: '33%!important', height: 'calc(100vh - 164px)', border:'solid 2px white' }}>
        chat
      </Box>
    </Box>
  );
};

export default Lobby;