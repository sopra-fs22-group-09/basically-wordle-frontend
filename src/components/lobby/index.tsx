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
  subscription subscribeLobby {
    lobby {
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
      targetWords
    }
  }
`;

const GAME_STATUS = gql`
  subscription gameStatus {
    gameStatus
  }
`;

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
  const [userId] = useLocalStorage<string>({ key: 'userId' });

  const [joinLobby, joinLobbyData] = useMutation<LobbyModels, MutationJoinLobbyByIdArgs>(JOIN_LOBBY);
  useEffect(() => {
    joinLobby({
      variables: {
        id: params.id as string
      }
    }).then(r => {
      if (r.data?.joinLobbyById) {
        setOwnerId(r.data.joinLobbyById.owner.id);
        setLobbyStatus(r.data.joinLobbyById.status);
        setGameMode(Object.values(GameMode)[Object.keys(GameMode).indexOf(r.data.joinLobbyById.gameMode)]);
        setGameRounds(r.data.joinLobbyById.game.amountRounds);
        setRoundTime(r.data.joinLobbyById.game.roundTime);
        setPlayers(r.data.joinLobbyById.players);
      }
    });
  }, [joinLobby, params.id]);

  const subscribeLobbyData = useSubscription<LobbyModels, SubscriptionLobbyArgs>(LOBBY_SUBSCRIPTION);
  useEffect(() => {
    if (!subscribeLobbyData.loading && subscribeLobbyData.data?.lobby) {
      setOwnerId(subscribeLobbyData.data.lobby.owner.id);
      //setLobbyStatus(subscribeLobbyData.data.lobby.status);
      setGameMode(Object.values(GameMode)[Object.keys(GameMode).indexOf(subscribeLobbyData.data.lobby.gameMode)]);
      setGameRounds(subscribeLobbyData.data.lobby.game.amountRounds);
      setRoundTime(subscribeLobbyData.data.lobby.game.roundTime);
      setPlayers(subscribeLobbyData.data.lobby.players);
    }
  }, [subscribeLobbyData.loading, subscribeLobbyData.data]);

  const [startGame] = useMutation(ANNOUNCE_START); //was using the GameModel at some point
  const gameStatusData = useSubscription<GameStatusModel>(GAME_STATUS);
  useEffect(() => {
    if (!gameStatusData.loading && gameStatusData.data?.gameStatus) {
      setGameStatus(gameStatusData.data.gameStatus);
      if (gameStatusData.data?.gameStatus == GameStatus.SYNCING && ownerId == userId) {
        startGame().then(() => {
          //setLobbyStatus(LobbyStatus.INGAME);
        });
      } else if (gameStatusData.data?.gameStatus == GameStatus.SYNCING ||
        gameStatusData.data?.gameStatus == GameStatus.GUESSING) {
        setLobbyStatus(LobbyStatus.INGAME);
      }
    }
  }, [gameStatusData, startGame, ownerId, userId]);

  return (
    debouncedLobbyStatus != LobbyStatus.INGAME ?
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
        />
      </Suspense>
  );
};

export default Lobby;