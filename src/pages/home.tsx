import * as React from 'react';
import { useEffect } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, useTheme } from '@mui/material';
import { gql, useQuery, useSubscription } from '@apollo/client';
import { GameCategory, GameMode, LobbyModels, LobbyOverview } from '../models/Lobby';
import { ChaoticOrbit } from '@uiball/loaders';
import LoaderCenterer from '../components/loader';
import { useNavigate } from 'react-router-dom';

const GET_LOBBIES = gql`
  query getAllLobbies {
    getLobbies {
      id
      name
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

  const toggleModal = () => {
    dispatch({ type: 'modal/toggle', payload: 'lobbyConfirmation' });
  };

  useQuery<LobbyModels>(GET_LOBBIES, {
    skip: !token,
    onCompleted(data) {
      setLobbies(data.getLobbies.map(l => {
        return (
          {
            id: l.id,
            name: l.name,
            mode: Object.values(GameMode)[Object.keys(GameMode).indexOf(l.gameMode)],
            category: Object.values(GameCategory)[Object.keys(GameCategory).indexOf(l.gameCategory)],
            players: l.players.length + '/' + l.size
          }
        );
      }));
    }
  });

  const subscribeLobbiesData = useSubscription<LobbyModels>(LOBBIES_SUBSCRIPTION, {
    skip: !token
  });
  useEffect(() => {
    if (!subscribeLobbiesData.loading && subscribeLobbiesData.data?.lobbyList) {
      setLobbies(subscribeLobbiesData.data.lobbyList.map(l => {
        return (
          {
            id: l.id,
            name: l.name,
            mode: Object.values(GameMode)[Object.keys(GameMode).indexOf(l.gameMode)],
            category: Object.values(GameCategory)[Object.keys(GameCategory).indexOf(l.gameCategory)],
            players: l.players.length + '/' + l.size
          }
        );
      }));
    }
  }, [subscribeLobbiesData]);

  // noinspection RequiredAttributes
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
      {
        lobbies ? (
          <DataGrid autoHeight disableSelectionOnClick
            sx={{
              '&.MuiDataGrid-root.MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus': { outline:'none' },
              '.MuiDataGrid-virtualScrollerContent' : {overflowX: 'hidden'}
            }}
            onRowClick={((params, event) => {
              event.defaultMuiPrevented = true;
              navigate('/lobby/' + params.id);
            })}
            columns={[
              {
                field: 'name',
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
                field: 'players',
                headerName: 'Players',
                width: 100,
              },
            ]}
            rows={lobbies}
          />
        ) : (
          <LoaderCenterer><ChaoticOrbit size={50} color={theme.additional.UiBallLoader.colors.main} /></LoaderCenterer>
        )
      }
    </Box>
  );
};

export default Home;
