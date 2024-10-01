import React, { ReactNode } from 'react';
import { Alert, Button, Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';

export type TimeWindowProps = {
  startTime: string;
  endTime: string;
  provider: {
    name: string;
  };
  subheader?: ReactNode;
  buttonProps?: {
    onClick?: ({ scheduleId }: { scheduleId: number }) => void;
    name: string;
  };
  scheduleId: number;
};

const TimeWindowProps: React.FC<TimeWindowProps> = ({
  startTime,
  endTime,
  provider,
  subheader,
  buttonProps,
  scheduleId,
}) => {
  const handleOnClick = () => {
    buttonProps?.onClick({ scheduleId });
  };
  return (
    <Card
      sx={{
        '&:hover': {
          boxShadow: '1px 1px 6px #aaa',
        },
        my: 2,
      }}
    >
      <CardHeader
        title={`Provider: ${provider.name}`}
        {...(subheader && {
          subheader,
        })}
      />
      <CardContent>
        <Typography>Start : {new Date(startTime).toDateString()}</Typography>
        <Typography>End : {new Date(endTime).toDateString()}</Typography>
      </CardContent>
      {buttonProps.onClick && (
        <CardActions>
          <Button onClick={handleOnClick} color="info" variant="outlined">
            {buttonProps.name}
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default TimeWindowProps;
