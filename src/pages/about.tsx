import * as React from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';

const About = () => {
  const theme = useTheme();
  const smallScreen = !useMediaQuery(theme.breakpoints.up('mobile')); //screen smaller than defined size

  // TODO This is just a template. Feel free to edit anything but the topmost Box.
  // TODO Please don't just add some text, make it look nice and fancy.
  return (
    <Box sx={{width: '90%', mx:'auto', mt: '2.5%', textAlign: smallScreen ? 'justify' : 'center'}}>
      <Typography variant='h1' sx={{fontSize: '48px', textAlign: 'center'}}>About Basically Wordle.</Typography>
      <Typography variant='h2' sx={{fontSize: '42px', mt: '20px', textAlign: 'center'}}>What is Wordle?</Typography>
      <Typography variant={'body1'} sx={{fontSize: '21px'}}>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
      </Typography>
      <Typography variant='h2' sx={{fontSize: '42px', mt: '20px', textAlign: 'center'}}>About us</Typography>
      <Typography variant={'body1'} sx={{fontSize: '21px'}}>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
      </Typography>
      <Typography variant='h2' sx={{fontSize: '42px', mt: '20px', textAlign: 'center'}}>Why did we develop this app?</Typography>
      <Typography variant={'body1'} sx={{fontSize: '21px'}}>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
      </Typography>
    </Box>
  );
};

export default About;