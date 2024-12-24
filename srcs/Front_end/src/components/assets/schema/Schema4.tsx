import { UserType } from "@/Types";
import React from "react";

type MatchType = {
  winner : UserType,
  player1 : UserType,
  player2 : UserType
}

export default function SchemaFour({rounds} : {rounds : MatchType[][]}) {
  return (
      <svg
        className="max-w-full"
        width="627"
        height="166"
        viewBox="0 0 627 166"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="253.5"
          y="29.5"
          width="114"
          height="114"
          rx="9.5"
          fill="white"
          stroke="#464444"
        />
        <rect
          x="260"
          y="36"
          width="101"
          height="101"
          rx="10"
          fill="url(#pattern0_854_121)"
        />
        <rect
          x="0.5"
          y="0.5"
          width="70.9067"
          height="70.9067"
          rx="9.5"
          fill="white"
          stroke="#464444"
        />
        <rect
          x="0.5"
          y="94.5"
          width="70.9067"
          height="70.9067"
          rx="9.5"
          fill="white"
          stroke="#464444"
        />
        <line
          y1="-0.5"
          x2="42"
          y2="-0.5"
          transform="matrix(1 0 0 -1 72 137)"
          stroke="#464444"
        />
        <line
          y1="-0.5"
          x2="26"
          y2="-0.5"
          transform="matrix(0 -1 -1 0 114 137)"
          stroke="#464444"
        />
        <line
          x1="72.5"
          y1="35.5006"
          x2="113.5"
          y2="35.5006"
          stroke="#464444"
          strokeLinecap="round"
        />
        <line
          x1="114.5"
          y1="36.5"
          x2="114.5"
          y2="110.5"
          stroke="#464444"
          strokeLinecap="round"
        />
        <rect
          x="6"
          y="7"
          width="59"
          height="59"
          rx="10"
          fill="url(#pattern1_854_121)"
        />
        <rect
          x="6"
          y="101"
          width="59"
          height="59"
          rx="10"
          fill="url(#pattern2_854_121)"
        />
        <rect
          x="-0.5"
          y="0.5"
          width="70.9079"
          height="70.9067"
          rx="9.5"
          transform="matrix(-1 0 0 1 203.908 52)"
          fill="white"
          stroke="#464444"
        />
        <rect
          width="59.0009"
          height="59"
          rx="10"
          transform="matrix(-1 0 0 1 199 59)"
          fill="url(#pattern3_854_121)"
        />
        <rect
          x="-0.5"
          y="0.5"
          width="70.9071"
          height="70.9067"
          rx="9.5"
          transform="matrix(-1 0 0 1 626 0)"
          fill="white"
          stroke="#464444"
        />
        <rect
          x="-0.5"
          y="0.5"
          width="70.9071"
          height="70.9067"
          rx="9.5"
          transform="matrix(-1 0 0 1 626 94)"
          fill="white"
          stroke="#464444"
        />
        <line x1="555" y1="137.5" x2="513" y2="137.5" stroke="#464444" />
        <line x1="512.5" y1="137" x2="512.5" y2="111" stroke="#464444" />
        <line
          x1="0.5"
          y1="-0.5"
          x2="41.5002"
          y2="-0.5"
          transform="matrix(-1 0 0 1 555 36.0006)"
          stroke="#464444"
          strokeLinecap="round"
        />
        <line
          x1="0.5"
          y1="-0.5"
          x2="74.5"
          y2="-0.5"
          transform="matrix(0 1 1 0 513 36)"
          stroke="#464444"
          strokeLinecap="round"
        />
        <rect
          width="59.0003"
          height="59"
          rx="10"
          transform="matrix(-1 0 0 1 621 7)"
          fill="url(#pattern4_854_121)"
        />
        <rect
          width="59.0003"
          height="59"
          rx="10"
          transform="matrix(-1 0 0 1 621 101)"
          fill="url(#pattern5_854_121)"
        />
        <rect
          x="-0.5"
          y="0.5"
          width="70.9079"
          height="70.9067"
          rx="9.5"
          transform="matrix(-1 0 0 1 487.908 47)"
          fill="white"
          stroke="#464444"
        />
        <rect
          width="59.0009"
          height="59"
          rx="10"
          transform="matrix(-1 0 0 1 483 54)"
          fill="url(#pattern6_854_121)"
        />
        <defs>
          <pattern
            id="pattern0_854_121"
            className="winner"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <PlayerImage player={rounds[0][0]["winner"]} />
          </pattern>
          <pattern
            id="pattern1_854_121"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <PlayerImage player={rounds[1][0]["player1"]} />
          </pattern>
          <pattern
            id="pattern2_854_121"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <PlayerImage player={rounds[1][0]["player2"]} />
          </pattern>
          <pattern
            id="pattern3_854_121"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <PlayerImage player={rounds[2][0]["player1"]} />
          </pattern>
          <pattern
            id="pattern4_854_121"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <PlayerImage player={rounds[1][1]["player1"]} />
          </pattern>
          <pattern
            id="pattern5_854_121"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <PlayerImage player={rounds[1][1]["player2"]} />
          </pattern>
          <pattern
            id="pattern6_854_121"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <PlayerImage player={rounds[2][0]["player2"]} />
          </pattern>
        </defs>
      </svg>
  );
}


function PlayerImage({ player } : {player : UserType}) {
    let url = "/_.jpeg"
    if (typeof player === "object") {
        url = player.profile.avatar
    }
    return (
        <image href={url}  transform="scale(0.00153846)" />
    )
}