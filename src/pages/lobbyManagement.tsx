import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Autocomplete,
  Box,
  Button,
  debounce,
  FormControl,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Paper,
  Select,
  Slider,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Dialog,
  Chip,
  Avatar,
} from '@mui/material';
import {
  GameCategorization,
  GameCategory,
  GameMode,
  LobbyModels,
  MutationUpdateLobbySettingsArgs,
  WordCategories,
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
import { useState } from 'react';

interface LobbyInformation {
  name: string;
  size: number;
  ownerId: string;
  gameCategory: GameCategory;
  gameMode: GameMode;
  gameStatus: GameStatus;
  gameRounds: number;
  roundTime: number;
  maxRounds: number;
  maxTime: number;
  players: Player[];
  setGameRounds: (rounds: number) => void;
  setRoundTime: (time: number) => void;
  startGame: () => void;
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
    addFriend(friendId: $friendId) {
      id
      username
      status
    }
  }
`;

const LobbyManagement = (lobbyInfo: LobbyInformation) => {
  const theme = useTheme();
  const smallScreen = !useMediaQuery(theme.breakpoints.up('mobile')); //screen smaller than defined size
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [bigQrCode, setBigQrCode] = useState(false);
  const [userId] = useLocalStorage({ key: 'userId' });
  // Word category selection
  const fixedOptions = [WordCategories[0]];
  const [value, setValue] = React.useState(fixedOptions);

  const [changeLobby] = useMutation<LobbyModels, MutationUpdateLobbySettingsArgs>(CHANGE_LOBBY);
  const [addFriend] = useMutation<MutationAddFriendArgs>(ADD_FRIEND);
  const changeLobbySettings = async (gameMode: GameMode, amountRounds: number, roundTime: number) => {
    await changeLobby({
      variables: {
        input: {
          gameMode: Object.keys(GameMode)[Object.values(GameMode).indexOf(gameMode)] as GameMode,
          amountRounds: amountRounds,
          roundTime: roundTime,
        },
      },
    });
  };
  const [stateDebounceLobbyChange] = React.useState(() => debounce(changeLobbySettings, 250));
  const isFriend = (lookupUserId: string) => {
    return !!api.readFragment<User>({
      fragment: READ_USERNAME,
      id: 'User:' + lookupUserId,
    })?.username;
  };

  const sendFriendRequest = (userId: string) => {
    addFriend({
      variables: {
        friendId: userId,
      },
      refetchQueries: ['getAllFriends'],
      //onError: (error) => (error.graphQLErrors.at(0)?.extensions.code == 'BAD_REQUEST' ? isFriend(userId) : false),
      errorPolicy: 'ignore',
    });
  };

  return (
    !lobbyInfo.name ? <LoaderCenterer><ChaoticOrbit size={50} color={theme.additional.UiBallLoader.colors.main} /></LoaderCenterer> :
      <Box sx={{width: '90%', mx: 'auto', textAlign: 'center'}}>
        <Typography variant="h1" fontSize="48px" sx={{ mt: '20px', mb: '25px'}}>{lobbyInfo.name} | {lobbyInfo.gameCategory}</Typography>
        <Paper sx={{ width: smallScreen ? '100%' : '49%', float: smallScreen ? 'none' : 'left', minHeight: '400px', py: '15px'}}> {/*TODO*/}
          <Typography variant="h2" fontSize="24px">Settings</Typography>
          <FormControl sx={{ minWidth: 150, width: '90%', mt: '30px' }}>
            <InputLabel>Game Mode</InputLabel>
            <Select
              value={lobbyInfo.gameMode}
              label="Game Mode"
              disabled={userId != lobbyInfo.ownerId}
              onChange={(event) => changeLobbySettings(event.target.value as GameMode, lobbyInfo.gameRounds, lobbyInfo.roundTime)}
            >
              {Object.values(GameMode).map((mode) => (lobbyInfo.gameCategory == GameCategorization.get(mode) && <MenuItem key={mode} value={mode}>{mode}</MenuItem>))}
            </Select>
          </FormControl>
          {lobbyInfo.gameRounds >= 1 && lobbyInfo.maxTime != 0 && (
            <Box sx={{ m: 'auto', mt: '25px', width: '90%' }}>
              <Typography variant="h3" fontSize="21px">Rounds: {lobbyInfo.gameRounds}</Typography>
              <Slider step={1} min={1} max={lobbyInfo.maxRounds} valueLabelDisplay="auto" value={lobbyInfo.gameRounds} disabled={userId != lobbyInfo.ownerId}
                onChange={(event, newRounds) => {
                  lobbyInfo.setGameRounds(newRounds as number);
                  stateDebounceLobbyChange(lobbyInfo.gameMode, newRounds as number, lobbyInfo.roundTime);
                }}
              />
            </Box>
          )}
          {lobbyInfo.roundTime >= 60 && (
            <Box sx={{ m: 'auto', mt: '25px', width: '90%' }}>
              <Typography variant="h3" fontSize="21px">Time: {lobbyInfo.roundTime} seconds</Typography>
              <Slider step={10} min={60} max={lobbyInfo.maxTime} valueLabelDisplay="auto" value={lobbyInfo.roundTime} disabled={userId != lobbyInfo.ownerId}
                onChange={(event, newTime) => {
                  lobbyInfo.setRoundTime(newTime as number);
                  stateDebounceLobbyChange(lobbyInfo.gameMode, lobbyInfo.gameRounds, newTime as number);
                }}
              />
            </Box>
          )}
          {/*TODO @jemaie would be nice if you could figure this out*/}
          <Autocomplete //TODO: HOW TO GATHER THE CATEGORIES AND SEND THEM TO THE SERVER?
            multiple
            options={WordCategories}
            value={value}
            onChange={(event, newValue) => {
              setValue([
                ...fixedOptions,
                ...newValue.filter((option) => fixedOptions.indexOf(option) === -1),
              ]);
            }}
            getOptionLabel={(option) => option.category}
            sx={{ m: 'auto', mt: '25px', width: '90%' }}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip
                  label={option.category}
                  {...getTagProps({ index })}
                  disabled={fixedOptions.indexOf(option) !== -1}
                  key={option.category + index}
                />
              ))}
            renderInput={(params) => <TextField {...params} placeholder="Word Set" />}
          />
        </Paper>
        <Paper sx={{ width: smallScreen ? '100%' : '49%', float: smallScreen ? 'none' : 'right', minHeight: '400px', mt: smallScreen ? '20px' : 'auto', py: '15px' }}>
          <Typography variant="h2" fontSize="24px">Players (max {lobbyInfo.size})</Typography>
          <List>
            {lobbyInfo.players?.map((player) => (
              <ListItem key={player.id}>
                <Chip color={player.id == lobbyInfo.ownerId ? 'error' : player.id == userId ? 'primary' : isFriend(player.id) ? 'success' : 'default'} avatar={<Avatar>{player.name.charAt(0).toUpperCase()}</Avatar>} label={player.name + (player.id == userId ? ' (me)' : '')} />
                {/* FIXME: Non-friends only! */}
                {userId != player.id && !isFriend(player.id) && <Button onClick={() => sendFriendRequest(player.id)}>Add Friend</Button>}
              </ListItem>
            ))}
          </List>
        </Paper>
        <br style={{clear: 'both'}} />
        {showQrCode &&
          <Paper sx={{width: smallScreen ? '100%' : '49%', mt: smallScreen ? 'auto' : '20px', textAlign: 'center', float: smallScreen ? 'none' : 'right', p: '15px'}}>
            <Button onClick={(event) => {event.currentTarget.blur(); setBigQrCode(true);}}>
              <img src={'https://api.qrserver.com/v1/create-qr-code/?data=' + window.location.href + '&size=300x300&ecc=H&margin=5'}
                alt="Invite link" title="Click to see the QR Code in fullscreen mode" style={{borderRadius: '5px', width: '100%'}}
              />
            </Button>
            <Dialog open={bigQrCode} maxWidth={false} onClose={() => setBigQrCode(false)}>
              <img src={'https://api.qrserver.com/v1/create-qr-code/?data=' + window.location.href + '&size=' + Math.min(window.innerHeight, window.innerWidth, 1000) + 'x' + Math.min(window.innerHeight, window.innerWidth, 1000) + '&ecc=H&margin=10'}
                alt="Invite link" title="Click somewhere else to close the fullscreen mode" style={{borderRadius: '10px'}}
              />
            </Dialog>
          </Paper>
        }
        <Paper sx={{mx: 'auto', p: '15px', textAlign: 'center',
          width: smallScreen || !showQrCode ? '100%' : '49%',
          mt: showQrCode || !smallScreen ? '20px' : 'auto',
          float: smallScreen ? 'none' : 'left'
        }}>
          <TextField type="text" defaultValue={window.location.href} InputProps={{readOnly: true}} sx={{fontSize: '18px',
            width: smallScreen ? '100%' : !showQrCode ? '70%' : '55%',
            float: smallScreen ? 'none' : 'left'
          }}/>
          <Box sx={{
            float: smallScreen ? 'none' : 'right',
            width: smallScreen ? '100%' : !showQrCode ? '30%' : '45%',
            textAlign: smallScreen ? 'center' : 'right'
          }}>
            <Button variant="contained" onClick={() => setShowQrCode(!showQrCode)}
              sx={{
                width: smallScreen ? 'auto' : '48%',
                minWidth: smallScreen ? '132px' : '0',
                maxWidth: '250px',
                height: smallScreen ? 'auto' : '56px',
                ml: smallScreen ? '10px' : 'auto',
                mr: smallScreen ? '10px' : '0.5%',
                mt: smallScreen ? '20px' : 'auto'
              }}>
              QR Code
            </Button>
            <Tooltip title="Copied to clipboard!" open={copied} leaveDelay={1500} onClose={() => setCopied(false)}
              sx={{
                width: smallScreen ? 'auto' : '48%',
                minWidth: smallScreen ? '132px' : '0',
                maxWidth: '250px',
                height: smallScreen ? 'auto' : '56px',
                ml: smallScreen ? '10px' : '0.5%',
                mr: smallScreen ? '10px' : 'auto',
                mt: smallScreen ? '20px' : 'auto'
              }}>
              <Button variant="contained" onClick={() => navigator.clipboard.writeText(window.location.href).then(() => setCopied(true))}>Copy</Button>
            </Tooltip>
          </Box>
          <Button variant="contained" sx={{ mx: '10px', mt: '20px' }} onClick={() => navigate('/')}>Leave Lobby</Button>
          <Button
            variant="contained"
            sx={{ minWidth: smallScreen ? '132px' : 'auto', mx: '10px', mt: '20px' }}
            disabled={userId != lobbyInfo.ownerId || lobbyInfo.gameStatus == GameStatus.SYNCING || (lobbyInfo.players.length < 2 && lobbyInfo.gameCategory != GameCategory.SOLO)}
            onClick={() => lobbyInfo.startGame()}
          >
            Start Game
          </Button>
        </Paper>
      </Box>
  );
};

export default LobbyManagement;
