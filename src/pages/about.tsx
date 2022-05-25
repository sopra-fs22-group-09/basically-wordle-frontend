import * as React from 'react';
import { Box, Link, ListItem, Typography, useMediaQuery, useTheme } from '@mui/material';

const About = () => {
  const theme = useTheme();
  const smallScreen = !useMediaQuery(theme.breakpoints.up('mobile')); //screen smaller than defined size

  // TODO This is just a template. Feel free to edit anything but the topmost Box.
  // TODO Please don't just add some text, make it look nice and fancy.
  return (
    <Box sx={{width: '90%', mx:'auto', mt: '20px', textAlign: smallScreen ? 'justify' : 'center'}}>
      <Typography variant="h1" sx={{fontSize: '48px', textAlign: 'center'}}>About Basically Wordle.</Typography>
      <Typography variant="h2" sx={{fontSize: '30px', mt: '48px', mb: '15px', textAlign: 'center'}}>What is Wordle?</Typography>
      <Typography sx={{minHeight: smallScreen ? '96px' : '48px', maxWidth: '700px', fontSize: '17px', width: smallScreen ? '90%' : '100%', mx: 'auto', textAlign: 'center'}} variant="body1">
        <i>Wordle</i> is a fun online word game originally developed by Josh Wardle and subsequently acquired and published by the New York Times. The goal of the game is to guess a five-letter word by submitting a maximum of six guesses, with the letters of each guess taking on a green color for every letter in the right spot, or a yellow color if the letter is contained in the word but in a different position. <i>Basically Wordle</i> is a more sophisticted adaptation of this concept, incorporating features like various PvP game modes and a friend system.
      </Typography>
      <Typography variant="h2" sx={{fontSize: '30px', mt: '40px', mb: '15px', textAlign: 'center'}}>About us</Typography>
      <Typography sx={{minHeight: smallScreen ? '96px' : '48px', maxWidth: '700px', fontSize: '17px', width: smallScreen ? '90%' : '100%', mx: 'auto', textAlign: 'center'}} variant="body1">
        We (Elvio Petillo, Jerome Maier, Mete Polat, Matej Gurica) are four computer science students at the University of Zurich, where we developed this application as our project for the course <i>Software Engineering Lab</i> held by Prof. Dr. Thomas Fritz during the spring semester of 2022. Our group was advised and supervised by teaching assistant Matthias Mylaeus throughout the entire project.
      </Typography>
      <Typography variant="h2" sx={{fontSize: '30px', mt: '40px', mb: '15px', textAlign: 'center'}}>Why did we develop this app?</Typography>
      <Typography sx={{minHeight: smallScreen ? '96px' : '48px', maxWidth: '700px', fontSize: '17px', width: smallScreen ? '90%' : '100%', mx: 'auto', textAlign: 'center'}} variant="body1">
        The main motivation for developing this app was to learn and get a good understanding of the technologies most commonly used when creating responsive client-server applications. In order to achieve this goal, we considered many different program ideas, but finally settled on the plan of making a more complex and interactive version of the popular <i>Wordle</i> game, which finally turned into <i>Basically Wordle.</i>
      </Typography>
      <Typography variant="h2" sx={{fontSize: '30px', mt: '40px', mb: '15px', textAlign: 'center'}}>Technologies used</Typography>
      <Typography sx={{minHeight: smallScreen ? '96px' : '48px', maxWidth: '700px', fontSize: '17px', width: smallScreen ? '90%' : '100%', mx: 'auto', textAlign: 'center'}} variant="body1">
        The application is built using the following technologies and frameworks:
        <ul>
          <ListItem sx={{ display: 'list-item', mb: '-8px', ml: '195px' }}>Apollo/GraphQL - <Link href={'https://www.apollographql.com'}>apollographql.com</Link></ListItem>
          <ListItem sx={{ display: 'list-item', mb: '-8px', ml: '195px' }}>Reactor Core - <Link href={'https://projectreactor.io'}>projectreactor.io</Link></ListItem>
          <ListItem sx={{ display: 'list-item', mb: '-8px', ml: '195px' }}>Dokku - <Link href={'https://dokku.com/'}>dokku.com</Link></ListItem>
          <ListItem sx={{ display: 'list-item', mb: '-8px', ml: '195px' }}>ReactJS - <Link href={'https://reactjs.org/'}>reactjs.org</Link></ListItem>
          <ListItem sx={{ display: 'list-item', mb: '-8px', ml: '195px' }}>Spring Boot - <Link href={'https://spring.io/projects/spring-boot'}>spring.io</Link></ListItem>
        </ul>
      </Typography>
    </Box>
  );
};

export default About;