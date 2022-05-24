import * as React from 'react';
import { Box, Modal, useMediaQuery, useTheme } from '@mui/material';
import { useAppSelector } from '../../redux/hooks';

type ModalTemplateProps = {
  children: React.ReactNode
  maxWidth: string
  name: string
}

const ModalTemplate = ({
  children,
  maxWidth,
  name
}: ModalTemplateProps) => {
  const theme = useTheme();
  const smallScreen = !useMediaQuery(theme.breakpoints.up('mobile')); //screen smaller than defined size
  const open = useAppSelector(state => state.modal.isOpen && state.modal.modalWindow == name);

  return (
    <Modal open={open}>
      <Box
        sx={{
          position: 'fixed',
          width: '90vw',
          maxWidth: {maxWidth},
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          px: smallScreen ? '20px' : '50px',
          py: smallScreen ? '30px' : '50px',
          bgcolor: 'rgba(0, 0, 0, 0.75)',
          boxShadow: '0 0 20px -7px rgba(0, 0, 0, 0.2)',
          border: '1px solid white',
          borderRadius: '15px',
          textAlign: 'center'
        }}
      >
        {children}
      </Box>
    </Modal>
  );
};

export default ModalTemplate;