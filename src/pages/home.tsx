import * as React from 'react';
import { useEffect } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { DataGrid } from '@mui/x-data-grid';
import { Alert, Box, Button, Snackbar, useTheme } from '@mui/material';
import { gql, useQuery, useSubscription } from '@apollo/client';
import { GameCategory, GameMode, Lobby, LobbyModels, LobbyOverview } from '../models/Lobby';
import { ChaoticOrbit } from '@uiball/loaders';
import LoaderCenterer from '../components/loader';
import { useNavigate } from 'react-router-dom';

const GET_LOBBIES = gql`
  query getAllLobbies {
    getLobbies {
      id
      name
      status
      gameCategory
      gameMode
      players {
        id
      }
      size
    }
  }
`;

const LOBBIES_SUBSCRIPTION = gql`
  subscription subscribeLobbies {
    lobbyList {
      id
      name
      status
      gameCategory
      gameMode
      players {
        id
      }
      size
    }
  }
`;

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token');
  const [lobbies, setLobbies] = React.useState<LobbyOverview[]>();
  const [joinError, setJoinError] = React.useState('');
  const toggleModal = () => dispatch({ type: 'modal/toggle', payload: 'lobbyConfirmation' });

  const mapLobbies = (l: Lobby) => {
    return (
      {
        id: l.id,
        name: l.name,
        status: l.status,
        mode: Object.values(GameMode)[Object.keys(GameMode).indexOf(l.gameMode)],
        category: Object.values(GameCategory)[Object.keys(GameCategory).indexOf(l.gameCategory)],
        players: l.players.length + '/' + l.size
      }
    );
  };

  useQuery<LobbyModels>(GET_LOBBIES, {
    skip: !token,
    onCompleted(data) {
      setLobbies(data.getLobbies.map(l => mapLobbies(l)));
    }
  });

  const subscribeLobbiesData = useSubscription<LobbyModels>(LOBBIES_SUBSCRIPTION, {skip: !token});
  useEffect(() => {
    if (!subscribeLobbiesData.loading && subscribeLobbiesData.data?.lobbyList) setLobbies(subscribeLobbiesData.data.lobbyList.map(l => mapLobbies(l)));
  }, [subscribeLobbiesData]);

  // noinspection RequiredAttributes
  return (
    <Box sx={{width: '90%', mx:'auto', mb: '20px', textAlign: 'center'}}>
      <Button variant="contained" onClick={toggleModal} sx={{mt: '20px', mb: '20px'}}>Create New Lobby</Button>
      <Snackbar
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        open={joinError.length > 0}
        autoHideDuration={3000}
        onClose={() => setJoinError('')}
      >
        <Alert variant="filled" severity="error">
          {joinError}
        </Alert>
      </Snackbar>
      {lobbies ?
        <DataGrid autoHeight disableSelectionOnClick
          sx={{'&.MuiDataGrid-root.MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus': { outline:'none' }}}
          onRowClick={((params, event) => {
            event.defaultMuiPrevented = true;
            if (params.row.status == 'INGAME') setJoinError('Cannot join a lobby that is in game!');
            else if (params.row.status == 'FULL') setJoinError('Cannot join a full lobby!');
            else navigate('/lobby/' + params.id);
          })}
          columns={[
            {
              field: 'name',
              headerName: 'Lobby',
              flex: 1,
              minWidth: 150,
            },
            {
              field: 'mode',
              headerName: 'Mode',
              width: 90,
            },
            {
              field: 'status',
              headerName: 'Status',
              width: 80,
            },
            {
              field: 'players',
              headerName: 'Players',
              width: 65,
            },
            {
              field: 'category',
              headerName: 'Category',
              width: 75,
            },
          ]}
          rows={lobbies}
        /> : <LoaderCenterer><ChaoticOrbit size={50} color={theme.additional.UiBallLoader.colors.main} /></LoaderCenterer>}
    </Box>
  );
};

export default Home;