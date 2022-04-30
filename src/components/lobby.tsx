import * as React from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LobbyManagement from '../pages/lobbyManagement';
import Game from '../pages/game';
import {
  GameCategory,
  GameMode,
  LobbyModels,
  LobbyStatus,
  MutationJoinLobbyByIdArgs,
  MutationUpdateLobbySettingsArgs,
  SubscriptionLobbyArgs
} from '../models/Lobby';
import { Player } from '../models/Player';
import { gql, useMutation, useSubscription } from '@apollo/client';

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

const CHANGE_LOBBY = gql`
  mutation updateLobby($input: GameSettingsInput!) {
    updateLobbySettings(input: $input) {
      id
    }
  }
`;

const Lobby = () => {

  const params = useParams();

  const [name, setName] = React.useState('');
  const [size, setSize] = React.useState(0);
  const [ownerId, setOwnerId] = React.useState('');
  const [status, setStatus] = React.useState<LobbyStatus>(LobbyStatus.OPEN);
  const [gameCategory, setGameCategory] = React.useState<GameCategory>(GameCategory.PVP);
  const [gameMode, setGameMode] = React.useState<GameMode>(GameMode.WORDSPP);
  const [gameRounds, setGameRounds] = React.useState(0);
  const [roundTime, setRoundTime] = React.useState(0);
  const [players, setPlayers] = React.useState<Player[]>([]);

  function JoinLobby() {
    // eslint-disable-next-line unused-imports/no-unused-vars
    const [joinLobby, { data, loading, error }] = useMutation<LobbyModels, MutationJoinLobbyByIdArgs>(JOIN_LOBBY);
    useEffect(() => {
      joinLobby({
        variables: {
          id: params.id as string
        }, onCompleted(data) {
          if (data?.joinLobbyById) {
            setName(data.joinLobbyById.name);
            setSize(data.joinLobbyById.size);
            setOwnerId(data.joinLobbyById.owner.id);
            setStatus(data.joinLobbyById.status);
            setGameCategory(Object.values(GameCategory)[Object.keys(GameCategory).indexOf(data.joinLobbyById.gameCategory)]);
            setGameMode(Object.values(GameMode)[Object.keys(GameMode).indexOf(data.joinLobbyById.gameMode)]);
            setGameRounds(data.joinLobbyById.game.amountRounds);
            setRoundTime(data.joinLobbyById.game.roundTime);
            setPlayers(data.joinLobbyById.players);
          }
        }
      });
    }, [joinLobby]);
  }
  JoinLobby();

  function UpdateLobby() {
    const { data, loading } = useSubscription<LobbyModels, SubscriptionLobbyArgs>(LOBBY_SUBSCRIPTION, {
      variables: {
        id: params.id as string
      }
    });
    useEffect(() => {
      if (!loading && data?.lobby) {
        setOwnerId(data.lobby.owner.id);
        setStatus(data.lobby.status);
        setGameMode(Object.values(GameMode)[Object.keys(GameMode).indexOf(data.lobby.gameMode)]);
        setGameRounds(data.lobby.game.amountRounds);
        setRoundTime(data.lobby.game.roundTime);
        setPlayers(data.lobby.players);
      }
    }, [data, loading]);
  }
  UpdateLobby();

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [changeLobby, { data, loading, error }] = useMutation<LobbyModels, MutationUpdateLobbySettingsArgs>(CHANGE_LOBBY);
  const changeLobbySettings = (gameMode: GameMode, amountRounds: number, roundTime: number) => {
    changeLobby({
      variables: {
        input: {
          gameMode: Object.keys(GameMode)[Object.values(GameMode).indexOf(gameMode)] as GameMode,
          amountRounds: amountRounds,
          roundTime: roundTime
        }
      }
    });
  };

  return (
    status != LobbyStatus.INGAME ?
      <LobbyManagement
        name={name}
        size={size}
        ownerId={ownerId}
        gameCategory={gameCategory}
        gameMode={gameMode}
        gameRounds={gameRounds}
        roundTime={roundTime}
        players={players}
        setGameRounds={setGameRounds}
        setRoundTime={setRoundTime}
        changeLobbySettings={changeLobbySettings}
        setStatus={setStatus}
      />
      :
      <Game
        name={name}
        setStatus={setStatus}
      />
  );
};

export default Lobby;