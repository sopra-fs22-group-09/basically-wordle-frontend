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
    mutation createGuest($id: ID!) {
        createGuest(id: $id) {
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
  const [gameStatus, setGameStatus] = React.useState<GameStatus>(GameStatus.NEW);
  // TODO: Needed? Possibly prevents lobbyStatus stuttering
  const [debouncedLobbyStatus] = useDebouncedValue(lobbyStatus, 500, { leading: true });
  const [debouncedGameStatus] = useDebouncedValue(gameStatus, 500, {leading: true});
  const [gameMode, setGameMode] = React.useState<GameMode>(GameMode.WORDSPP);
  const [gameRounds, setGameRounds] = React.useState(0);
  const [roundTime, setRoundTime] = React.useState(0);
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [guestCreated, setGuestCreated] = React.useState(false);
  const [isGuest, setGuest] = React.useState(true);
  const [tokenPresent, setTokenPresent] = React.useState(false);
  const [userId] = useLocalStorage<string>({ key: 'userId' });

  const [joinLobby, joinLobbyData] = useMutation<LobbyModels, MutationJoinLobbyByIdArgs>(JOIN_LOBBY);
  const [createGuest, createGuestData] = useMutation<GuestType, MutationJoinLobbyByIdArgs>(ADD_GUEST);
  const [joinLobbyAsGuest, joinGuestLobbyData] = useMutation<LobbyModels, MutationJoinLobbyByIdArgs>(JOIN_LOBBY_AS_GUEST);


  useEffect(() => {
    if (localStorage.getItem('token')) {
      setTokenPresent(true);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('userId')) {
      setGuest(false);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('userId') && !guestCreated) {
      let isSubscribed = true;
      (async () => {
        createGuest({
          variables: {
            id: params.id as string
          },
          onCompleted(data) {
            if (data.createGuest) {
              localStorage.setItem('userId', data.createGuest.id);
              localStorage.setItem('userName', data.createGuest.name);
              // localStorage.setItem('guest', 'yes');
              setGuestCreated(true);
              setTokenPresent(true);
              window.console.log('guest creation called');
            }
          }
        });
      })();
      return () => {
        isSubscribed = false;
      };
    }
  }, [createGuest, guestCreated, params.id]);

  useEffect(() => {
    if (guestCreated) {
      let isSubscribed = true;
      (async () => {
        joinLobbyAsGuest({
          variables: {
            id: params.id as string
          }
        }).then(r => {
          if (r.data?.guestJoinLobbyById && isSubscribed) {
            setOwnerId(r.data.guestJoinLobbyById.owner.id);
            setLobbyStatus(r.data.guestJoinLobbyById.status);
            setGameMode(Object.values(GameMode)[Object.keys(GameMode).indexOf(r.data.guestJoinLobbyById.gameMode)]);
            setGameRounds(r.data.guestJoinLobbyById.game.amountRounds);
            setRoundTime(r.data.guestJoinLobbyById.game.roundTime);
            setPlayers(r.data.guestJoinLobbyById.players);
          }
        });
      })();
      return () => {
        isSubscribed = false;
      };
    }
  }, [guestCreated, joinLobbyAsGuest, params.id]);


  useEffect(() => {
    if (!guestCreated) {
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
    }
  }, [guestCreated, joinLobby, params.id]);
  
  const subscribeLobbyData = useSubscription<LobbyModels, SubscriptionLobbyArgs>(LOBBY_SUBSCRIPTION, {
    variables: {
      id: params.id as string
    }, skip: !localStorage.getItem('token'),
  });

  useEffect(() => {
    window.console.log('useEffect subscription called' + ' ' + subscribeLobbyData.loading + ' ' + subscribeLobbyData.data?.lobby.owner.id);
    if (!subscribeLobbyData.loading && subscribeLobbyData.data?.lobby) {
      setOwnerId(subscribeLobbyData.data.lobby.owner.id);
      //setLobbyStatus(debouncedLobbyStatus);
      setGameMode(Object.values(GameMode)[Object.keys(GameMode).indexOf(subscribeLobbyData.data.lobby.gameMode)]);
      setGameRounds(subscribeLobbyData.data.lobby.game.amountRounds);
      setRoundTime(subscribeLobbyData.data.lobby.game.roundTime);
      window.console.log('game rounds set: ' + subscribeLobbyData.data.lobby.game.roundTime.toString() + ' ' + roundTime.toString());
      setPlayers(subscribeLobbyData.data.lobby.players);
    }
  }, [subscribeLobbyData.loading, subscribeLobbyData.data, roundTime]);

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

  if (debouncedGameStatus == GameStatus.NEW) {
    if (!guestCreated) {
      window.console.log('GameStatus.NEW & !guestCreated');
      return <Suspense fallback={<LoaderCenterer><ChaoticOrbit size={35} color={theme.additional.UiBallLoader.colors.main} /></LoaderCenterer>}>
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
      </Suspense>;
    } else {
      window.console.log('GameStatus.NEW & guestCreated');
      return <Suspense fallback={<LoaderCenterer><ChaoticOrbit size={35} color={theme.additional.UiBallLoader.colors.main} /></LoaderCenterer>}>
        <LobbyManagement
          name={!joinGuestLobbyData.loading && joinGuestLobbyData.data?.guestJoinLobbyById ? joinGuestLobbyData.data.guestJoinLobbyById.name : ''}
          size={!joinGuestLobbyData.loading && joinGuestLobbyData.data?.guestJoinLobbyById ? joinGuestLobbyData.data.guestJoinLobbyById.size : 0}
          ownerId={ownerId}
          gameCategory={!joinGuestLobbyData.loading && joinGuestLobbyData.data?.guestJoinLobbyById ? Object.values(GameCategory)[Object.keys(GameCategory).indexOf(joinGuestLobbyData.data.guestJoinLobbyById.gameCategory)] : GameCategory.PVP}
          gameMode={gameMode}
          gameStatus={gameStatus}
          gameRounds={gameRounds}
          roundTime={roundTime}
          players={players}
          setGameRounds={setGameRounds}
          setRoundTime={setRoundTime}
          startGame={startGame}
        />
      </Suspense>;
    }
  }
  if (!guestCreated) {
    window.console.log('!GameStatus.NEW & !guestCreated');
    return <Suspense fallback={<LoaderCenterer><DotWave size={50} color='#eee' /></LoaderCenterer>}>
      <Game
        name={!joinLobbyData.loading && joinLobbyData.data?.joinLobbyById ? joinLobbyData.data.joinLobbyById.name : ''}
        setStatus={setLobbyStatus}
        gameStatus={gameStatus}
        startGame={startGame}
        ownerId={ownerId.toString()}
        setGameMode={setGameMode}
      />
    </Suspense>;
  } else {
    window.console.log('!GameStatus.NEW & guestCreated');
    return <Suspense fallback={<LoaderCenterer><DotWave size={50} color='#eee' /></LoaderCenterer>}>
      <Game
        name={!joinGuestLobbyData.loading && joinGuestLobbyData.data?.guestJoinLobbyById ? joinGuestLobbyData.data.guestJoinLobbyById.name : ''}
        setStatus={setLobbyStatus}
        gameStatus={gameStatus}
        startGame={startGame}
        ownerId={ownerId.toString()}
        setGameMode={setGameMode}
      />
    </Suspense>;
  }

  return null;
};

export default Lobby;