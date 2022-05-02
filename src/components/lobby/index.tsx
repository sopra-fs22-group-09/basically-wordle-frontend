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
import { GameModel, GameStatus, GameStatusModel } from '../../models/Game';
import { useAppSelector } from '../../redux/hooks';

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

  const syncing = useAppSelector(state => state.syncState.syncing);

  const [ownerId, setOwnerId] = React.useState('');
  const [lobbyStatus, setLobbyStatus] = React.useState<LobbyStatus>(LobbyStatus.OPEN);
  const [gameStatus, setGameStatus] = React.useState<GameStatus>(GameStatus.NEW);
  const [gameMode, setGameMode] = React.useState<GameMode>(GameMode.WORDSPP);
  const [gameRounds, setGameRounds] = React.useState(0);
  const [roundTime, setRoundTime] = React.useState(0);
  const [players, setPlayers] = React.useState<Player[]>([]);

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

  const gameStatusData = useSubscription<GameStatusModel>(GAME_STATUS, {
    onSubscriptionData: data => {
      console.log(data.subscriptionData.data?.gameStatus);
    }
  });
  useEffect(() => {
    if (!gameStatusData.loading && gameStatusData.data?.gameStatus) {
      setGameStatus(gameStatusData.data.gameStatus);
      if (gameStatusData.data?.gameStatus == GameStatus.PREPARING) {
        initializeGame();
      } else if (gameStatusData.data?.gameStatus == GameStatus.PLAYING) {
        setLobbyStatus(LobbyStatus.INGAME);
      }
    }
  }, [gameStatus, gameStatusData.data, gameStatusData.loading]);

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [startGame, startGameData] = useMutation<GameModel>(ANNOUNCE_START);
  const initializeGame = () => {
    startGame({
      onCompleted(data) {
        if (data?.startGame) {
          // TODO probably not needed? can probably delete
          setGameRounds(data.startGame.amountRounds);
          setRoundTime(data.startGame.roundTime);
        }
      }
    }).then(() => {
      setLobbyStatus(LobbyStatus.INGAME);
    });
  };

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
        startGame={initializeGame}
      />
      :
      <Game
        name={!joinLobbyData.loading && joinLobbyData.data?.joinLobbyById ? joinLobbyData.data.joinLobbyById.name : ''}
        setStatus={setLobbyStatus}
        gameStatus={gameStatus}
      />
  );
};

export default Index;