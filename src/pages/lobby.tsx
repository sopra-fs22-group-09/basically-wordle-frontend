import * as React from 'react';
import {
  Box,
  //Stack,
  Typography,
  List,
  ListItem,
  Select,
  MenuItem,
  FormControl,
  Slider,
  Button,
  InputAdornment,
  InputLabel, Autocomplete, Checkbox, TextField,
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { gql, useSubscription } from '@apollo/client';
import { Lobby as LobbyModel } from '../models/Lobby';

//get default gamemodes for category
const gameModes = [
  { label: 'Words++' },
  { label: 'Sonic Fast' },
  { label: 'Time Reset' },
];
//get default categories ??
const wordCategories = [
  { category: 'bitches' },
  { category: 'hoes' },
  { category: 'cats' },
];

//TODO: get subscription data
const Lobby = () => {
  const [gameMode, setGameMode] = React.useState(gameModes[0].label); //get initial mode ??
  const [lobbySize, setLobbySize] = React.useState(2); //get initial size
  const [gameRounds, setGameRounds] = React.useState(3); //get initial rounds
  //TODO: save di usgwählte: const [wordCategory, setWordCategory] = React.useState(''); //get default ??

  const LOBBY_SUBSCRIPTION = gql`
    subscription {
      lobbyFlux {
        id
        name
      }
    }
  `;

  function LatestLobby() {
    const { data, loading } = useSubscription<{lobbyFlux: LobbyModel}>(
      LOBBY_SUBSCRIPTION
    );
    return <>
      <p>Subscription answer:</p><br/>
      <p>
        {(!loading && data?.lobbyFlux) ? data?.lobbyFlux.name : 'waiting for lobby events ...'}
      </p>
    </>;
  }

  return (
    <Box
      sx={{
        width:'90%',
        mx:'auto',
        mt:'2.5%',
        textAlign: 'center'
      }}
    >
      <Typography variant='h1' sx={{fontSize: 48}}> {/*TODO Naja...*/}
        {'jemaie\'s Game'}
      </Typography>
      <Box sx={{ width: '66%!important', float: 'left', border:'solid 2px orange' }}>
        <Box sx={{ width: '49%', border:'solid 2px red', float: 'left' }}>
          <Typography variant='h5'>
            players
          </Typography>
          <List>
            <ListItem>
              player1
            </ListItem>
            <ListItem>
              player2
            </ListItem>
          </List>
        </Box>
        <Box sx={{ width: '49%', border:'solid 2px red', float: 'right' }}>
          <Typography variant='h5'>
            settings
          </Typography>
          <Typography variant='h3'>
            {LatestLobby()}
          </Typography>
          <FormControl sx={{ width:150, m:2 }}>
            <InputLabel>Game Mode</InputLabel>
            <Select
              value={gameMode}
              label="Game Mode"
              onChange={(event) => setGameMode(event.target.value as string)}
            >
              {gameModes?.map(mode => {
                return (
                  <MenuItem key={mode.label} value={mode.label}>
                    {mode.label}
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
            value={lobbySize}
            onChange={(event, newSize) => setLobbySize(newSize as number)}
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
            readOnly={!localStorage.getItem('token')}
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
        <Box sx={{clear: 'both', width: '66%', maxWidth: 500, mt: 38, mx: 'auto', textAlign: 'left', border:'solid 2px blue'}}>
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
      <Box sx={{ float: 'right', width: '33%!important', height: 'calc(100vh - 300px)', border:'solid 2px white' }}>
        chat
      </Box>
    </Box>
  );
};

export default Lobby;
