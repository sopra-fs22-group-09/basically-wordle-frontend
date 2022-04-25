import * as React from 'react';
import {
  Alert,
  Box,
  Container,
  Typography,
  Button,
} from '@mui/material';
import {gql, useMutation} from '@apollo/client';
import {useState} from 'react';
import {User} from '../models/User';
import { useNavigate } from 'react-router-dom';
import { LoadingOverlay } from '@mantine/core';
import image1 from '../assets/1.png';
import image2 from '../assets/2.png';
import image3 from '../assets/3.png';
import image4 from '../assets/4.png';
import image5 from '../assets/5.png';
import { useLocalStorage } from '@mantine/hooks';

const Tutorial = () => {

  const FINISH_TUTORIAL = gql`
    mutation tutorialFinished($user: TokenInput!) {
      tutorialCompleted(input: $user) {
        id
      }
    }
  `;

  interface tokenEntry {
    token: string | null;
  }

  interface tokenData {
    user: tokenEntry;
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [finishTutorial, { data, loading, error }] = useMutation<User, tokenData>(FINISH_TUTORIAL);
  const [count, setCount] = useState(1);
  const [token] = useLocalStorage<string>({ key: 'token' });

  const navigate = useNavigate();

  const handleSubmit = () => {
    finishTutorial({
      variables: {
        user: {
          token: token
        }
      },
      onCompleted() {
        navigate('/');
      }
    });
  };

  if (count == 1) {
    return <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Tutorial
        </Typography>
        {(!loading && error) && <Alert sx={{ mt: 3, minWidth: 1, maxWidth: 1 }} variant="filled" severity="error">{error.message}</Alert>}
        <Box component="form"  sx={{ mt: 1 }}>
          <img src={image1} alt={''} />
          <Typography component="h1" variant="body1">
            Wordle is a fun game where the player tries to guess a word consisting of five letters in as few tries as possible. The first step is to enter any five-letter word.
          </Typography>
          <Button
            onClick={() => setCount(count + 1)}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Next
          </Button>
          <LoadingOverlay visible={loading} />
        </Box>
      </Box>
    </Container>;
  }
  if (count == 2) {
    return <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Tutorial
        </Typography>
        {(!loading && error) && <Alert sx={{ mt: 3, minWidth: 1, maxWidth: 1 }} variant="filled" severity="error">{error.message}</Alert>}
        <Box component="form"  sx={{ mt: 1 }}>
          <img src={image2} alt={''} />
          <Typography component="h1" variant="body1">
            If the entered word contains a letter from the target word and this letter is also in the correct position, it will turn green. Blacked out letters do not appear in the target word.
          </Typography>
          <Button
            onClick={() => setCount(count + 1)}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Next
          </Button>
          <LoadingOverlay visible={loading} />
        </Box>
      </Box>
    </Container>;
  }
  if (count == 3) {
    return <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Tutorial
        </Typography>
        {(!loading && error) && <Alert sx={{ mt: 3, minWidth: 1, maxWidth: 1 }} variant="filled" severity="error">{error.message}</Alert>}
        <Box component="form"  sx={{ mt: 1 }}>
          <img src={image3} alt={''} />
          <Typography component="h1" variant="body1">
            If a letter turns yellow, it means that it appears in the target word, but in a different position.
          </Typography>
          <Button
            onClick={() => setCount(count + 1)}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Next
          </Button>
          <LoadingOverlay visible={loading} />
        </Box>
      </Box>
    </Container>;
  }
  if (count == 4) {
    return <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Tutorial
        </Typography>
        {(!loading && error) && <Alert sx={{ mt: 3, minWidth: 1, maxWidth: 1 }} variant="filled" severity="error">{error.message}</Alert>}
        <Box component="form"  sx={{ mt: 1 }}>
          <img src={image4} alt={''} />
          <Typography component="h1" variant="body1" align={'center'}>
            We are getting closer...
          </Typography>
          <Button
            onClick={() => setCount(count + 1)}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Next
          </Button>
          <LoadingOverlay visible={loading} />
        </Box>
      </Box>
    </Container>;
  }
  if (count == 5) {
    return <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Tutorial
        </Typography>
        {(!loading && error) && <Alert sx={{ mt: 3, minWidth: 1, maxWidth: 1 }} variant="filled" severity="error">{error.message}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <img src={image5} alt={''} />
          <Typography component="h1" variant="body1">
            Ta-da! We have found the target word! If you do not manage to solve the riddle in a maximum of six tries, you lose the game. Now go and have some fun!
          </Typography>
          <Button
            onClick={handleSubmit}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Finish Tutorial
          </Button>
          <LoadingOverlay visible={loading} />
        </Box>
      </Box>
    </Container>;
  }
  return null;
};

export default Tutorial;
