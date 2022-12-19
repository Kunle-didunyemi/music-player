import React, { useEffect, useState } from "react";
import useSound from "use-sound"; // for handling the sound
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai"; // icons for play and pause
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { VscUnmute } from "react-icons/vsc";
import { IoVolumeMuteOutline } from "react-icons/io5";
import { IconContext } from "react-icons"; // for customazing the icons
import "./Player.css";
import { audioPlayer } from "./audio";

const Player = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(audioPlayer[0]);
  const [play, { pause, duration, sound, stop }] = useSound(currentSong.url);

  const [currTime, setCurrTime] = useState({
    min: "",
    sec: "",
  }); // current position of the audio in minutes and seconds
  const [time, setTime] = useState({
    min: "",
    sec: "",
  });

  const [seconds, setSeconds] = useState(); // current position of the audio in seconds

  const playingButton = () => {
    if (isPlaying) {
      pause(); // this will pause the audio
      setIsPlaying(false);
    } else {
      play(); // this will play the audio
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (sound) {
        setSeconds(sound.seek([])); // setting the seconds state with the current state
        const min = Math.floor(sound.seek([]) / 60);
        const sec = Math.floor(sound.seek([]) % 60);
        setCurrTime({
          min,
          sec,
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sound]);

  useEffect(() => {
    const sec = duration / 1000;
    const min = Math.floor(sec / 60);
    const secRemain = Math.floor(sec % 60);
    setTime({
      min: min,
      sec: secRemain,
    });
  }, [isPlaying, duration]);

  const prevAudio = () => {
    const index = audioPlayer.findIndex((x) => x.title === currentSong.title);
    if (index === 0) {
      setCurrentSong(audioPlayer[audioPlayer.length - 1]);
    } else {
      setCurrentSong(audioPlayer[index - 1]);
    }
    setCurrTime(0);
    setIsPlaying(false);
    stop();
    // playingButton();
  };

  const nextAudio = () => {
    const index = audioPlayer.findIndex((x) => x.title === currentSong.title);
    if (index === audioPlayer.length - 1) {
      setCurrentSong(audioPlayer[0]);
    } else {
      setCurrentSong(audioPlayer[index + 1]);
    }
    setCurrTime(0);
    setIsPlaying(false);
    stop();
    // playingButton();
  };

  return (
    <div className="component">
      <h2>Playing Now</h2>
      <div>
        <img
          className="musicCover"
          src={currentSong.imageSrc}
          alt="cover pic"
        />
        <h3 className="title"> {currentSong.title} </h3>
        <p className="subTitle">{currentSong.subTitle}</p>
      </div>

      <div>
        <div className="time">
          <p>
            {currTime.min}:{currTime.sec}
          </p>
          <p>
            {time.min}:{time.sec}
          </p>
        </div>
        {isPlaying ? (
          <button className="muteBtn">
            <VscUnmute />
          </button>
        ) : (
          <button className="muteBtn2">
            <IoVolumeMuteOutline />
          </button>
        )}
        <input
          type="range"
          min="0"
          max={duration / 1000}
          default="0"
          value={seconds}
          className="timeline"
          onChange={(e) => {
            sound.seek([e.target.value]);
          }}
        />
      </div>

      <div>
        <button onClick={prevAudio} className="playButton">
          <IconContext.Provider value={{ size: "3em", color: " #0a7dff" }}>
            <BiSkipPrevious />
          </IconContext.Provider>
        </button>
        {!isPlaying ? (
          <button className="playButton" onClick={playingButton}>
            <IconContext.Provider value={{ size: "3em", color: "#0a7dff" }}>
              <AiFillPlayCircle />
            </IconContext.Provider>
          </button>
        ) : (
          <button className="playButton" onClick={playingButton}>
            <IconContext.Provider value={{ size: "3em", color: "#0a7dff" }}>
              <AiFillPauseCircle />
            </IconContext.Provider>
          </button>
        )}
        <button onClick={nextAudio} className="playButton">
          <IconContext.Provider value={{ size: "3em", color: "#0a7dff" }}>
            <BiSkipNext />
          </IconContext.Provider>
        </button>
      </div>
    </div>
  );
};

export default Player;
