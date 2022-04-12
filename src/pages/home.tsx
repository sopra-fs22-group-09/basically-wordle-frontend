import * as React from 'react';
import { useAppDispatch } from '../redux/hooks';
import { DataGrid, GridRowId } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';

//TODO: get subscription data
const lobbies = [
  {
    id: '5ig540vrtj',
    lobby: 'jemaie\'s Game',
    mode: 'Words++',
    category: 'PvP',
    player: '2/4',
  },
  {
    id: 'd493gn434j',
    lobby: 'compilomatic\'s Game',
    mode: 'Sonic Fast',
    category: 'PvP',
    player: '2/3',
  },
  {
    id: '84nbl02snt',
    lobby: 'mp.\'s Game',
    mode: 'Together',
    category: 'Co-op',
    player: '2/2',
  },
  {
    id: '17fngptndv',
    lobby: 'bzns\'s Game',
    mode: 'Party',
    category: 'PvP',
    player: '2/6',
  },
  {
    id: '17adgptndv',
    lobby: 'Its Britney Bitch\'s Game',
    mode: 'Time Reset',
    category: 'PvP',
    player: '2/4',
  },
];

const Home = () => {

  const dispatch = useAppDispatch();

  const toggleModal = () => {
    dispatch({ type: 'modal/toggle', payload: 'lobbyConfirmation' });
  };
  const handleLobbyJoin = (lobbyId: GridRowId) => {
    alert('JOIN LOBBY WITH ID: ' + lobbyId);
  };

  return (
    <Box sx={{
      width:'90%',
      mx:'auto',
      mt:'2.5%',
    }}>
      <Button
        variant="contained"
        onClick={toggleModal}
        sx={{
          display: 'block', // Margin does not apply without this line
          mx: 'auto',
          mb: '2.5%'
        }}
      >
        Create New Lobby
      </Button>
      <DataGrid autoHeight disableSelectionOnClick
        sx={{
          '&.MuiDataGrid-root.MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus': { outline:'none' },
          '.MuiDataGrid-virtualScrollerContent' : {overflowX: 'hidden'}
        }}
        onRowClick={((params, event) => {
          event.defaultMuiPrevented = true;
          handleLobbyJoin(params.id);
        })}
        columns={[
          {
            field: 'lobby',
            headerName: 'Lobby',
            flex: 1,
            minWidth: 200,
          },
          {
            field: 'mode',
            headerName: 'Mode',
            width: 100,
          },
          {
            field: 'category',
            headerName: 'Category',
            width: 100,
          },
          {
            field: 'player',
            headerName: 'Player',
            width: 100,
          },
        ]}
        rows={lobbies}
      />
    </Box>
  );
};

export default Home;
