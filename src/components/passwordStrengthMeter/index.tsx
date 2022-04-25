import * as React from 'react';
import { useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Progress, Text, Popover, Box } from '@mantine/core';
import TextField from '@mui/material/TextField';

const PasswordRequirement = ({ meets, label }: { meets: boolean; label: string }) => {
  return (
    <Text
      color={meets ? 'teal' : 'red'}
      sx={{ display: 'flex', alignItems: 'center' }}
      mt={7}
      size="sm"
    >
      {meets ? <CheckIcon /> : <CloseIcon />} <Box ml={10}>{label}</Box>
    </Text>
  );
};

const requirements = [
  { re: /\d/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];

function getStrength(password: string) {
  let multiplier = password.length > 4 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

const PasswordStrength = () => {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const [value, setValue] = useState('');
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(value)} />
  ));

  const strength = getStrength(value);
  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

  return (
    <Popover
      opened={popoverOpened}
      position="bottom"
      placement="start"
      withArrow={false}
      styles={{ popover: { width: '100%', backgroundColor: '#2C2E30'}, arrow: { color: '#2C2E30' }, wrapper: { color: '#2C2E30' } }}
      trapFocus={false}
      zIndex={9001}
      transition="pop-top-left"
      onFocusCapture={() => setPopoverOpened(true)}
      onBlurCapture={() => setPopoverOpened(false)}
      target={
        <TextField
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          // helperText="Strong password should include letters in lower and uppercase, at least 1 number and 1 special symbol"
          id="password"
          autoComplete="new-password"
          inputProps={{ minLength: 5, maxLength: 50 }}
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
        />
      }
    >
      <Progress color={color} value={strength} size={5} style={{ marginBottom: 10 }} />
      <PasswordRequirement label="Includes at least 5 characters" meets={value.length > 4} />
      {checks}
    </Popover>
  );
};

export default PasswordStrength;