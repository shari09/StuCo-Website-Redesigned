/** @jsx jsx */
import React, {useContext, useState, useEffect} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {theme} from '../utils/theme';

interface Props {
  date: Date;
}

interface FormattedTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface TimeUnitI {
  number: number;
  text: string;
}

export const CountDownTimer: React.FC<Props> = ({date}) => {
  const [timer, setTimer] = useState<number>();
  const [formattedTime, setFormattedTime] = useState<FormattedTime>();

  useEffect(() => {
    if (!timer) {
      setTimer(date.getTime() - new Date().getTime());
      return;
    }
    setFormattedTime(getFormattedTime(timer));
    window.setTimeout(() => {
      setTimer(timer - 1000);
    }, 1000);
  }, [timer, date]);

  const getFormattedTime = (timeInMilli: number) => {
    const days = Math.floor(timeInMilli / (24 * 60 * 60 * 1000));
    timeInMilli = timeInMilli % (24 * 60 * 60 * 1000);
    const hours = Math.floor(timeInMilli / (60 * 60 * 1000));
    timeInMilli = timeInMilli % (60 * 60 * 1000);
    const minutes = Math.floor(timeInMilli / (60 * 1000));
    timeInMilli = timeInMilli % (60 * 1000);
    const seconds = Math.floor(timeInMilli / 1000);

    return {
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  };

  if (!formattedTime) {
    return <div />;
  }

  const style: SxStyleProp = {
    top: '40%',
    left: '7%',
    position: 'absolute',
    backgroundColor: theme.colors.background.accent,
    color: theme.colors.text.light,
    textAlign: 'center',
    fontFamily: theme.fonts.time,
    fontSize: 20,
    '&:hover': {
      textDecoration: 'none',
      color: theme.colors.text.light,
    },
    px: 20,
    py: 2,
  };

  const TimeUnit: React.FC<TimeUnitI> = ({number, text}) => {
    const seconds = 'sec';
    const numDigit = number < 100 ? 2 : 3;
    const textSize = text === seconds ? 15 : 20;
    const numSize = text === seconds ? 50 : 80;
    return (
      <span sx={{mx: 20}}>
        <span sx={{fontSize: numSize}}>
          {number.toString().padStart(numDigit, '0')}
        </span>
        <span sx={{fontSize: textSize}}>{text}</span>
      </span>
    );
  };

  return (
    <div sx={style}>
      <TimeUnit number={formattedTime.days} text="days" />
      <TimeUnit number={formattedTime.hours} text="hrs" />
      <TimeUnit number={formattedTime.minutes} text="mins" />
      <TimeUnit number={formattedTime.seconds} text="sec" />
    </div>
  );
};

export default CountDownTimer;
