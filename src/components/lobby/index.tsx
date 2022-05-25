import * as React from 'react';
import { lazy, Suspense, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  GameCategory,
  GameMode,
  LobbyModels,
  LobbyStatus,
  MutationJoinLobbyByIdArgs,
  SubscriptionLobbyArgs,
} from '../../models/Lobby';
import { Player } from '../../models/Player';
import { gql, useMutation, useSubscription } from '@apollo/client';
import { GameStatus, GameStatusModel } from '../../models/Game';
import { useDebouncedValue, useLocalStorage } from '@mantine/hooks';
import { ChaoticOrbit, DotWave } from '@uiball/loaders';
import { useTheme } from '@mui/material';
import LoaderCenterer from '../loader';
import { useAppDispatch } from '../../redux/hooks';
import { store } from '../../redux/store';

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
        maxRounds
        maxTime
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
        maxRounds
        maxTime
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
    announceStandby
  }
`;

const GAME_STATUS = gql`
  subscription gameStatus($id: ID!) {
    gameStatus(id: $id)
  }
`;

const Lobby = () => {
  const theme = useTheme();
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const LobbyManagement = lazy(() => import('../../pages/lobbyManagement'));
  const Game = lazy(() => import('../../pages/game'));

  const [joined, setJoined] = React.useState(false);
  const [ownerId, setOwnerId] = React.useState('');
  const [lobbyStatus, setLobbyStatus] = React.useState<LobbyStatus>(LobbyStatus.OPEN);
  // TODO: Needed? Possibly prevents lobbyStatus stuttering
  const [debouncedLobbyStatus] = useDebouncedValue(lobbyStatus, 500, { leading: true });
  const [gameStatus, setGameStatus] = React.useState<GameStatus>(GameStatus.NEW);
  const [gameMode, setGameMode] = React.useState<GameMode>(GameMode.WORDSPP);
  const [gameRounds, setGameRounds] = React.useState(0);
  const [roundTime, setRoundTime] = React.useState(0);
  const [maxRounds, setMaxRounds] = React.useState(1);
  const [maxTime, setMaxTime] = React.useState(60);
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [userId] = useLocalStorage<string>({ key: 'userId' });

  const [joinLobby, joinLobbyData] = useMutation<LobbyModels, MutationJoinLobbyByIdArgs>(JOIN_LOBBY);
  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      joinLobby({
        variables: {
          id: params.id as string,
        },
        onError: (error) => {
          alert(error.message);
          navigate('/');
        },
      }).then((r) => {
        if (r.data?.joinLobbyById && isSubscribed) {
          setJoined(true);
          setOwnerId(r.data.joinLobbyById.owner.id);
          setLobbyStatus(r.data.joinLobbyById.status);
          setGameMode(Object.values(GameMode)[Object.keys(GameMode).indexOf(r.data.joinLobbyById.gameMode)]);
          setGameRounds(r.data.joinLobbyById.game.amountRounds);
          setRoundTime(r.data.joinLobbyById.game.roundTime);
          setMaxRounds(r.data.joinLobbyById.game.maxRounds);
          setMaxTime(r.data.joinLobbyById.game.maxTime);
          setPlayers(r.data.joinLobbyById.players);
        }
      });
    })();
    return () => {
      isSubscribed = false;
    };
  }, [joinLobby, params.id, navigate]);

  const subscribeLobbyData = useSubscription<LobbyModels, SubscriptionLobbyArgs>(LOBBY_SUBSCRIPTION, {
    variables: {
      id: params.id as string
    },
    skip: !joined
  });
  useEffect(() => {
    if (!subscribeLobbyData.loading && subscribeLobbyData.data?.lobby) {
      setOwnerId(subscribeLobbyData.data.lobby.owner.id);
      //setLobbyStatus(subscribeLobbyData.data.lobby.status);
      setGameMode(Object.values(GameMode)[Object.keys(GameMode).indexOf(subscribeLobbyData.data.lobby.gameMode)]);
      setGameRounds(subscribeLobbyData.data.lobby.game.amountRounds);
      setRoundTime(subscribeLobbyData.data.lobby.game.roundTime);
      setMaxRounds(subscribeLobbyData.data.lobby.game.maxRounds);
      setMaxTime(subscribeLobbyData.data.lobby.game.maxTime);
      setPlayers(subscribeLobbyData.data.lobby.players);
    }
  }, [subscribeLobbyData.loading, subscribeLobbyData.data]);

  const [startGame, { called: _called }] = useMutation(ANNOUNCE_START);
  const gameStatusData = useSubscription<GameStatusModel>(GAME_STATUS, {
    variables: {
      id: params.id as string
    },
    skip: !joined
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
        } else if (gameStatusData.data?.gameStatus == GameStatus.NEW) {
          setLobbyStatus(LobbyStatus.OPEN);
          dispatch({type: 'modal/setState', payload: {isOpen: false}});
        } else if (
          gameStatusData.data?.gameStatus == GameStatus.SYNCING ||
          (gameStatusData.data?.gameStatus == GameStatus.GUESSING && isSubscribed)
        ) {
          setLobbyStatus(LobbyStatus.INGAME);
          if (store.getState().drawer.isOpen) dispatch({type: 'drawer/toggle'}); // Does not work with setState...?
        }
      }
    })();
    return () => {
      isSubscribed = false;
    };
  }, [gameStatusData, startGame, ownerId, userId, dispatch]);

  return debouncedLobbyStatus != LobbyStatus.INGAME ? ( // FIXME: If the lobby screen won't appear you have to use loading here instead of called.
    <Suspense
      fallback={
        <LoaderCenterer>
          <ChaoticOrbit size={35} color={theme.additional.UiBallLoader.colors.main} />
        </LoaderCenterer>
      }
    >
      <LobbyManagement
        name={!joinLobbyData.loading && joinLobbyData.data?.joinLobbyById ? joinLobbyData.data.joinLobbyById.name : ''}
        size={!joinLobbyData.loading && joinLobbyData.data?.joinLobbyById ? joinLobbyData.data.joinLobbyById.size : 0}
        ownerId={ownerId}
        gameCategory={
          !joinLobbyData.loading && joinLobbyData.data?.joinLobbyById
            ? Object.values(GameCategory)[
              Object.keys(GameCategory).indexOf(joinLobbyData.data.joinLobbyById.gameCategory)
            ]
            : GameCategory.PVP
        }
        gameMode={gameMode}
        gameStatus={gameStatus}
        gameRounds={gameRounds}
        roundTime={roundTime}
        maxRounds={maxRounds}
        maxTime={maxTime}
        players={players}
        setGameRounds={setGameRounds}
        setRoundTime={setRoundTime}
        startGame={startGame}
      />
    </Suspense>
  ) : (
    <Suspense
      fallback={
        <LoaderCenterer>
          <DotWave size={50} color="#eee" />
        </LoaderCenterer>
      }
    >
      <Game
        gameMode={gameMode}
        gameStatus={gameStatus}
        roundTime={roundTime}
        maxRounds={maxRounds - 1}
        setStatus={setLobbyStatus}
        startGame={startGame}
      />
    </Suspense>
  );
};

export default Lobby;