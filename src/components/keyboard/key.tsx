import * as React from 'react';
import { Button, useMediaQuery, useTheme } from '@mui/material';

type KeyProps = {
  value: string
  style: React.CSSProperties
  onClick: (value: string) => void
}

const Key = ({
  value,
  style,
  onClick,

}: KeyProps) => {
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick(value);
    event.currentTarget.blur();
  };

  const theme = useTheme();
  const smallScreen = !useMediaQuery(theme.breakpoints.up('mobile')); //screen smaller than defined size

  return (
    <Button
      variant="contained"
      sx={{
        width: '8%',
        minWidth: 0, /*Prevent MUI magic*/
        height: smallScreen ? '40px' : '60px',
        m: '2px',
        p: 0,
        color: 'white',
        display: 'inline-block',
        fontSize: smallScreen ? '12px' : '14px',
        ...style
      }}
      onClick={handleClick}
    >
      {value}
    </Button>
  );
};

export default Key;