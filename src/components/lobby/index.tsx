import * as React from 'react';
import { lazy, Suspense, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  GameCategory,
  GameMode,
  LobbyModels,
  LobbyStatus,
  MutationJoinLobbyByIdArgs,
  SubscriptionLobbyArgs
} from '../../models/Lobby';
import { Player } from '../../models/Player';
import { gql, useMutation, useSubscription } from '@apollo/client';
import { GameStatus, GameStatusModel } from '../../models/Game';
import { useDebouncedValue, useLocalStorage } from '@mantine/hooks';
import { ChaoticOrbit, DotWave } from '@uiball/loaders';
import { useTheme } from '@mui/material';
import LoaderCenterer from '../loader';

const JOIN_LOBBY = gql`
  mutation joinLobby($id: ID!) {
    joinLobbyById(id: $id) {
      id
      name
      size
      owner {
        id
      }
      status
      gameCategory
      gameMode
      game {
        amountRounds
        roundTime
      }
      players {
        id
        name
      }
    }
  }
`;

const LOBBY_SUBSCRIPTION = gql`
  subscription subscribeLobby($id: ID!) {
    lobby(id: $id) {
      owner {
        id
      }
      status
      gameMode
      game {
        amountRounds
        roundTime
      }
      players {
        id
        name
      }
    }
  }
`;

const ANNOUNCE_START = gql`
  mutation announceStandby {
    announceStandby {
      amountRounds
      roundTime
    }
  }
`;

const GAME_STATUS = gql`
  subscription gameStatus($id: ID!) {
    gameStatus(id: $id)
  }
`;

const ADD_GUEST = gql`
    mutation createGuest{
        createGuest {
            id
            name
        }
    }
`;

const JOIN_LOBBY_AS_GUEST = gql`
    mutation joinLobbyAsGuest($id: ID!) {
        guestJoinLobbyById(id: $id) {
            id
            name
            size
            owner {
                id
            }
            status
            gameCategory
            gameMode
            game {
                amountRounds
                roundTime
            }
            players {
                id
                name
            }
        }
    }
`;

interface GuestType {
  createGuest: Player;
}

const Lobby = () => {

  const params = useParams();
  
  const LobbyManagement = lazy(() => import('../../pages/lobbyManagement'));
  const Game = lazy(() => import('../../pages/game'));
  
  const theme = useTheme();

  const [ownerId, setOwnerId] = React.useState('');
  const [lobbyStatus, setLobbyStatus] = React.useState<LobbyStatus>(LobbyStatus.OPEN);
  // TODO: Needed? Possibly prevents lobbyStatus stuttering
  const [debouncedLobbyStatus] = useDebouncedValue(lobbyStatus, 500, { leading: true });
  const [gameStatus, setGameStatus] = React.useState<GameStatus>(GameStatus.NEW);
  const [gameMode, setGameMode] = React.useState<GameMode>(GameMode.WORDSPP);
  const [gameRounds, setGameRounds] = React.useState(0);
  const [roundTime, setRoundTime] = React.useState(0);
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [guestCreated, setGuestCreated] = React.useState(false);
  const [userId] = useLocalStorage<string>({ key: 'userId' });

  const [joinLobby, joinLobbyData] = useMutation<LobbyModels, MutationJoinLobbyByIdArgs>(JOIN_LOBBY);
  const [createGuest, { data: guestData, loading: guestLoading, error: guestError }] = useMutation<GuestType>(ADD_GUEST);
  const [joinLobbyAsGuest, joinGuestLobbyData] = useMutation<LobbyModels, MutationJoinLobbyByIdArgs>(JOIN_LOBBY_AS_GUEST);

  useEffect(() => {
    /*if (!guestCreated) {*/
    let isSubscribed = true;
    (async () => {
      joinLobby({
        variables: {
          id: params.id as string
        }
      }).then(r => {
        if (r.data?.joinLobbyById && isSubscribed) {
          setOwnerId(r.data.joinLobbyById.owner.id);
          setLobbyStatus(r.data.joinLobbyById.status);
          setGameMode(Object.values(GameMode)[Object.keys(GameMode).indexOf(r.data.joinLobbyById.gameMode)]);
          setGameRounds(r.data.joinLobbyById.game.amountRounds);
          setRoundTime(r.data.joinLobbyById.game.roundTime);
          setPlayers(r.data.joinLobbyById.players);
        }
      });
    })();
    return () => {
      isSubscribed = false;
    };
    /*}*/
  }, [joinLobby, params.id]);
  
  const subscribeLobbyData = useSubscription<LobbyModels, SubscriptionLobbyArgs>(LOBBY_SUBSCRIPTION, {
    variables: {
      id: params.id as string
    }
  });
  useEffect(() => {
    if (!subscribeLobbyData.loading && subscribeLobbyData.data?.lobby) {
      setOwnerId(subscribeLobbyData.data.lobby.owner.id);
      //setLobbyStatus(debouncedLobbyStatus);
      setGameMode(Object.values(GameMode)[Object.keys(GameMode).indexOf(subscribeLobbyData.data.lobby.gameMode)]);
      setGameRounds(subscribeLobbyData.data.lobby.game.amountRounds);
      setRoundTime(subscribeLobbyData.data.lobby.game.roundTime);
      setPlayers(subscribeLobbyData.data.lobby.players);
    }
  }, [subscribeLobbyData.loading, subscribeLobbyData.data]);

  const [startGame, { called: _called }] = useMutation(ANNOUNCE_START); //was using the GameModel at some point
  const gameStatusData = useSubscription<GameStatusModel>(GAME_STATUS, {
    variables: {
      id: params.id as string
    }
  });
  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      if (!gameStatusData.loading && gameStatusData.data?.gameStatus && isSubscribed) {
        setGameStatus(gameStatusData.data.gameStatus);
        if (gameStatusData.data?.gameStatus == GameStatus.SYNCING && ownerId == userId) {
          await startGame().then(() => {
            //setLobbyStatus(LobbyStatus.INGAME);
          });
        } else if (gameStatusData.data?.gameStatus == GameStatus.SYNCING
          || gameStatusData.data?.gameStatus == GameStatus.GUESSING
          && isSubscribed) {
          setLobbyStatus(LobbyStatus.INGAME);
        }
      }
    })();
    return () => { isSubscribed = false; };
  }, [gameStatusData, startGame, ownerId, userId]);

  return (
    gameStatus == GameStatus.NEW ? // FIXME: If the lobby screen won't appear you have to use loading here instead of called.
      <Suspense fallback={<LoaderCenterer><ChaoticOrbit size={35} color={theme.additional.UiBallLoader.colors.main} /></LoaderCenterer>}>
        <LobbyManagement
          name={!joinLobbyData.loading && joinLobbyData.data?.joinLobbyById ? joinLobbyData.data.joinLobbyById.name : ''}
          size={!joinLobbyData.loading && joinLobbyData.data?.joinLobbyById ? joinLobbyData.data.joinLobbyById.size : 0}
          ownerId={ownerId}
          gameCategory={!joinLobbyData.loading && joinLobbyData.data?.joinLobbyById ? Object.values(GameCategory)[Object.keys(GameCategory).indexOf(joinLobbyData.data.joinLobbyById.gameCategory)] : GameCategory.PVP}
          gameMode={gameMode}
          gameStatus={gameStatus}
          gameRounds={gameRounds}
          roundTime={roundTime}
          players={players}
          setGameRounds={setGameRounds}
          setRoundTime={setRoundTime}
          startGame={startGame}
        />
      </Suspense>
      :
      <Suspense fallback={<LoaderCenterer><DotWave size={50} color='#eee' /></LoaderCenterer>}>
        <Game
          name={!joinLobbyData.loading && joinLobbyData.data?.joinLobbyById ? joinLobbyData.data.joinLobbyById.name : ''}
          setStatus={setLobbyStatus}
          gameStatus={gameStatus}
          startGame={startGame}
          ownerId={ownerId.toString()}
          setGameMode={setGameMode}
        />
      </Suspense>
  );
};

export default Lobby;