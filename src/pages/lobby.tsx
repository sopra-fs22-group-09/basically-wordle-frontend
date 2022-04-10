import * as React from 'react';
import {
  Box,
  Stack,
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

  return (
    <Box
      sx={{
        position:'absolute',
        height:'90%',
        width:'90%',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <Stack sx={{ display:'flex', height:'100%' }}>
        <Box sx={{ m:'auto', mb:4, border:'solid 2px white' }}>
          <Typography variant='h4'>
            {'jemaie\'s Game'}
          </Typography>
        </Box>
        <Stack spacing={5} direction="row" sx={{ m:'auto', border:'solid 2px green' }}>
          <Stack spacing={2} sx={{ m:'auto', border:'solid 2px yellow' }}>
            <Stack spacing={2} direction="row" sx={{ m:'auto', border:'solid 2px blue' }}>
              <Stack sx={{ width:150, m:'auto', border:'solid 2px red' }}>
                <Box sx={{ m:'auto', mb:2, border:'solid 2px white' }}>
                  <Typography variant='h5'>
                    players
                  </Typography>
                </Box>
                <List>
                  <ListItem>
                    player1
                  </ListItem>
                  <ListItem>
                    player2
                  </ListItem>
                </List>
              </Stack>
              <Stack sx={{ width:200, m:'auto', border:'solid 2px red' }}>
                <Box sx={{ m:'auto', mb:2, border:'solid 2px white' }}>
                  <Typography variant='h5'>
                    settings
                  </Typography>
                </Box>
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
                Lobby Size
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
                Rounds
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
              </Stack>
            </Stack>
            <Box>
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
              />
            </Box>
            <Box>
              <Button variant="contained" sx={{ mr:2 }}>Leave Lobby</Button>
              <Button variant="contained" sx={{ ml:2 }}>Start Game</Button>
            </Box>
          </Stack>
          <Box sx={{ width:150, m:'auto', border:'solid 2px white' }}>
            chat
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Lobby;