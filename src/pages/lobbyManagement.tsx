import * as React from 'react';
import { useNavigate } from 'react-router-dom';
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
  ListItemText,
  MenuItem,
  Select,
  Skeleton,
  Slider,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import {
  GameCategorization,
  GameCategory,
  GameMode,
  LobbyModels,
  MutationUpdateLobbySettingsArgs,
  WordCategories
} from '../models/Lobby';
import { Player } from '../models/Player';
import { gql, useMutation } from '@apollo/client';
import { ChaoticOrbit } from '@uiball/loaders';
import LoaderCenterer from '../components/loader';
import { GameStatus } from '../models/Game';
import { MutationAddFriendArgs, User } from '../models/User';
import { useLocalStorage } from '@mantine/hooks';
import api from '../services/api';
import { READ_USERNAME } from '../utils/utils';

interface LobbyInformation {
  name: string
  size: number
  ownerId: string
  gameCategory: GameCategory
  gameMode: GameMode
  gameStatus: GameStatus
  gameRounds: number
  roundTime: number
  players: Player[]
  setGameRounds: (rounds: number) => void
  setRoundTime: (time: number) => void
  startGame: () => void
}

const CHANGE_LOBBY = gql`
  mutation updateLobby($input: GameSettingsInput!) {
    updateLobbySettings(input: $input) {
      id
    }
  }
`;

const ADD_FRIEND = gql`
  mutation addFriend($friendId: ID!) {
	  addFriend (friendId: $friendId)
  }
`;

const LobbyManagement = (lobbyInfo: LobbyInformation) => {

  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);
  const [ userId ] = useLocalStorage({ key: 'userId' });

  const theme = useTheme();

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [changeLobby, { data, loading, error }] = useMutation<LobbyModels, MutationUpdateLobbySettingsArgs>(CHANGE_LOBBY);
  const [addFriend] = useMutation<MutationAddFriendArgs>(ADD_FRIEND);
  const changeLobbySettings = (gameMode: GameMode, amountRounds: number, roundTime: number) => {
    changeLobby({
      variables: {
        input: {
          gameMode: Object.keys(GameMode)[Object.values(GameMode).indexOf(gameMode)] as GameMode,
          amountRounds: amountRounds,
          roundTime: roundTime
        }
      }
    });
  };
  const [stateDebounceLobbyChange] = React.useState(() => debounce(changeLobbySettings, 250));
  const isFriend = (lookupUserId: string) => {
    return api.readFragment<User>({
      fragment: READ_USERNAME,
      id: 'User:' + lookupUserId
    })?.username ? true : false;
  };

  const sendFriendRequest = (userId: string) => {
    addFriend({
      variables: {
        friendId: userId
      },
    });
  };

  return (
    <Box
      sx={{
        width:'90%',
        mx:'auto',
        mt: '2.5%',
        textAlign: 'center'
      }}
    >
      {
        lobbyInfo.name ? (
          <>
            <Typography variant='h1' sx={{fontSize: 48}}>
              {lobbyInfo.name} | {lobbyInfo.gameCategory} [{lobbyInfo.size}]
            </Typography>
            <Box sx={{ width: '66%!important', float: 'left', border:'solid 2px white' }}>
              <Box sx={{ width: '49%', border:'solid 2px white', float: 'left' }}>
                <Typography variant='h5'>
            Players
                </Typography>
                <List>
                  {lobbyInfo.players?.map(player => {
                    return (
                      <ListItem key={player.id}>
                        {/* hmm */
                          loading ? (
                            <Skeleton animation='wave' variant='text' sx={{ml: '15px'}} width={120} />
                          ) : (
                            <>
                              <ListItemText primary={player.name} />
                              {/* FIXME: Non-friends only! */
                                userId != player.id && !isFriend(player.id) &&
                                <Button onClick={() => sendFriendRequest(player.id)}>Add Friend</Button>
                              }
                            </>
                          )
                        }
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
              <Box sx={{ width: '49%', border:'solid 2px white', float: 'right' }}>
                <Typography variant='h5'>
                  Settings
                </Typography>
                <FormControl sx={{ minWidth:150, width:'auto', mt:3 }}>
                  <InputLabel>Game Mode</InputLabel>
                  <Select
                    value={lobbyInfo.gameMode}
                    label="Game Mode"
                    disabled={localStorage.getItem('userId') != lobbyInfo.ownerId}
                    onChange={event => changeLobbySettings(event.target.value as GameMode, lobbyInfo.gameRounds, lobbyInfo.roundTime)}
                  >
                    {(Object.values(GameMode)).map(mode => {
                      return (
                        <MenuItem key={mode} value={mode} disabled={lobbyInfo.gameCategory != GameCategorization.get(mode)}>
                          {mode}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                {lobbyInfo.gameRounds != 0 &&
            <Box sx={{ m:'auto', mt:2, width:'80%' }}>
              <Typography variant='h6'>Rounds: {lobbyInfo.gameRounds}</Typography>
              <Slider
                sx={{ m:'auto' }}
                marks
                step={1}
                min={1}
                max={5}
                valueLabelDisplay='auto'
                value={lobbyInfo.gameRounds}
                disabled={localStorage.getItem('userId') != lobbyInfo.ownerId}
                onChange={(event, newRounds) => {
                  lobbyInfo.setGameRounds(newRounds as number);
                  stateDebounceLobbyChange(lobbyInfo.gameMode, newRounds as number, lobbyInfo.roundTime);
                }}
              />
            </Box>
                }
                {lobbyInfo.roundTime != 0 &&
              <Box sx={{ m:'auto', mt:2, width:'80%' }}>
                <Typography variant='h6'>Time: {lobbyInfo.roundTime} seconds</Typography>
                <Slider
                  sx={{ m:'auto' }}
                  marks
                  step={10}
                  min={0}
                  max={300}
                  valueLabelDisplay='auto'
                  value={lobbyInfo.roundTime}
                  disabled={localStorage.getItem('userId') != lobbyInfo.ownerId}
                  onChange={(event, newTime) => {
                    lobbyInfo.setRoundTime(newTime as number);
                    stateDebounceLobbyChange(lobbyInfo.gameMode, lobbyInfo.gameRounds, newTime as number);
                  }}
                />
              </Box>
                }
                <Autocomplete //TODO: HOW TO GATHER THE CATEGORIES AND SEND THEM TO THE SERVER?
                  sx={{ m:'auto', mt:3,  width:'80%' }}
                  multiple
                  readOnly={true}
                  disableCloseOnSelect
                  options={WordCategories}
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
              <Box sx={{clear: 'both', width: '80%', maxWidth: 600, mt: 38, mx: 'auto', textAlign: 'center', border:'solid 2px white'}}>
                <TextField
                  type='text'
                  defaultValue={window.location.href}
                  variant='outlined'
                  InputProps={{ readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title={'Copied to clipboard!'} open={copied} leaveDelay={1500} onClose={() => setCopied(false)}>
                          <Button variant='contained' onClick={() => {
                            navigator.clipboard.writeText(window.location.href)
                              .then(() => setCopied(true));
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
                <Button variant="contained" sx={{ mx:2, mt:2 }} disabled={localStorage.getItem('userId') != lobbyInfo.ownerId || lobbyInfo.gameStatus == GameStatus.SYNCING} onClick={() => lobbyInfo.startGame()}>Start Game</Button>
              </Box>
            </Box>
            <Box sx={{ float: 'right', width: '33%!important', height: 'calc(100vh - 200px)', border:'solid 2px white' }}>
        chat
            </Box>
          </>
        ) : (
          <LoaderCenterer><ChaoticOrbit size={50} color={theme.additional.UiBallLoader.colors.main} /></LoaderCenterer>
        )
      }
    </Box>
  );
};

export default LobbyManagement;