import * as React from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LobbyManagement from '../../pages/lobbyManagement';
import Game from '../../pages/game';
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
import { useLocalStorage } from '@mantine/hooks';

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
    announceStandby
  }
`;

const GAME_STATUS = gql`
  subscription gameStatus {
    gameStatus
  }
`;

const Index = () => {

  const params = useParams();

  const [ownerId, setOwnerId] = React.useState('');
  const [lobbyStatus, setLobbyStatus] = React.useState<LobbyStatus>(LobbyStatus.OPEN);
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
      setLobbyStatus(subscribeLobbyData.data.lobby.status);
      setGameMode(Object.values(GameMode)[Object.keys(GameMode).indexOf(subscribeLobbyData.data.lobby.gameMode)]);
      setGameRounds(subscribeLobbyData.data.lobby.game.amountRounds);
      setRoundTime(subscribeLobbyData.data.lobby.game.roundTime);
      setPlayers(subscribeLobbyData.data.lobby.players);
    }
  }, [subscribeLobbyData.loading, subscribeLobbyData.data]);

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [startGame, startGameData] = useMutation(ANNOUNCE_START); //was using the GameModel at some point
  const gameStatusData = useSubscription<GameStatusModel>(GAME_STATUS);
  useEffect(() => {
    if (!gameStatusData.loading && gameStatusData.data?.gameStatus && gameStatus != GameStatus.GUESSING) {
      setGameStatus(gameStatusData.data.gameStatus);
      // Only if we are the owner! TODO: Still called too often!
      if (gameStatusData.data?.gameStatus == GameStatus.SYNCING && ownerId == userId) {
        startGame().then(() => {
          setLobbyStatus(LobbyStatus.INGAME);
        });
      } else if (gameStatusData.data?.gameStatus == GameStatus.SYNCING ||
        gameStatusData.data?.gameStatus == GameStatus.GUESSING) {
        setLobbyStatus(LobbyStatus.INGAME);
      }
    }
  }, [gameStatusData, startGame, gameStatus, ownerId, userId]);

  return (
    lobbyStatus != LobbyStatus.INGAME ?
      <LobbyManagement
        name={!joinLobbyData.loading && joinLobbyData.data?.joinLobbyById ? joinLobbyData.data.joinLobbyById.name : ''}
        size={!joinLobbyData.loading && joinLobbyData.data?.joinLobbyById ? joinLobbyData.data.joinLobbyById.size : 0}
        ownerId={ownerId}
        gameCategory={!joinLobbyData.loading && joinLobbyData.data?.joinLobbyById ? Object.values(GameCategory)[Object.keys(GameCategory).indexOf(joinLobbyData.data.joinLobbyById.gameCategory)] : GameCategory.PVP}
        gameMode={gameMode}
        gameRounds={gameRounds}
        roundTime={roundTime}
        players={players}
        setGameRounds={setGameRounds}
        setRoundTime={setRoundTime}
        startGame={startGame}
      />
      :
      <Game
        name={!joinLobbyData.loading && joinLobbyData.data?.joinLobbyById ? joinLobbyData.data.joinLobbyById.name : ''}
        setStatus={setLobbyStatus}
        gameStatus={gameStatus}
        startGame={startGame}
      />
  );
};

export default Index;