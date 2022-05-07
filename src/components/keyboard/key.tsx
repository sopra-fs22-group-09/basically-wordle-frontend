import * as React from 'react';
import { Button } from '@mui/material';


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
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {onClick(value);};

  return (
    <Button
      variant="contained"
      sx={{
        m: '2px',
        width: '8%',
        minWidth: '24.5px',
        height: '60px',
        color: 'white',
        ...style
      }}
      onClick={handleClick}
    >
      {value}
    </Button>
  );
};

export default Key;