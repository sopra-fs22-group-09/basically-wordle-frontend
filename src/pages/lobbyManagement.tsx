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
  MenuItem,
  Select,
  Slider,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import {
  GameCategorization,
  GameCategory,
  GameMode, LobbyStatus,
  WordCategories
} from '../models/Lobby';
import { Player } from '../models/Player';

interface LobbyInformation {
  name: string
  size: number
  ownerId: string
  gameCategory: GameCategory
  gameMode: GameMode
  gameRounds: number
  roundTime: number
  players: Player[]
  setGameRounds: (rounds: number) => void
  setRoundTime: (time: number) => void
  changeLobbySettings: (gameMode: GameMode, amountRounds: number, roundTime: number) => void
  setStatus: (status: LobbyStatus) => void
}

const LobbyManagement = (lobbyInfo: LobbyInformation) => {

  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);
  const [stateDebounceLobbyChange] = React.useState(() => debounce(lobbyInfo.changeLobbySettings, 250));

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
        {lobbyInfo.name} | {lobbyInfo.gameCategory} [{lobbyInfo.size}]
      </Typography>
      <Box sx={{ width: '66%!important', float: 'left', border:'solid 2px white' }}>
        <Box sx={{ width: '49%', border:'solid 2px red', float: 'left' }}>
          <Typography variant='h5'>
            players
          </Typography>
          <List>
            {lobbyInfo.players?.map(player => {
              return (
                <ListItem key={player.id}>
                  {player.name}
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
              value={lobbyInfo.gameMode}
              label="Game Mode"
              disabled={localStorage.getItem('userId') != lobbyInfo.ownerId}
              onChange={event => lobbyInfo.changeLobbySettings(event.target.value as GameMode, lobbyInfo.gameRounds, lobbyInfo.roundTime)}
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
                <Typography variant='h6'>Time: {lobbyInfo.roundTime}</Typography>
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
                      navigator.clipboard.writeText(window.location.host + window.location.pathname)
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
          <Button variant="contained" sx={{ mx:2, mt:2 }} onClick={() => lobbyInfo.setStatus(LobbyStatus.INGAME)}>Start Game</Button>
        </Box>
      </Box>
      <Box sx={{ float: 'right', width: '33%!important', height: 'calc(100vh - 164px)', border:'solid 2px white' }}>
        chat
      </Box>
    </Box>
  );
};

export default LobbyManagement;