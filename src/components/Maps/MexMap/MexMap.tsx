import React from 'react';
import { Dispatch, SetStateAction } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';

import mexStateCenterCoordinates from 'src/components/Maps/MexMap/MexStateCenterCoordinates.json';

const GEO_URL =
  'https://gist.githubusercontent.com/leenoah1/535b386ec5f5abdb2142258af395c388/raw/a045778d28609abc036f95702d6a44045ae7ca99/geo-data.json';
const SELECTED_STATE_COLOR = '#2e7509';
const HOVER_STATE_COLOR = '#EAEAEC';
const DEFAULT_STATE_COLOR = undefined;
const style: React.CSSProperties = {
  borderStyle: 'double',
  width: '60%',
  alignContent: 'center',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
};

export interface MexMapProps {
  setSelectedState: Dispatch<SetStateAction<string>>;
  selectedState: string;
  filterStates?: string[];
}

export interface Geo {
  stateName: string;
  coordinates: number[][];
}

export const MexMap: React.FC<MexMapProps> = ({
  setSelectedState,
  selectedState,
}) => {
  const mapCoordinateStates = new Map<string, number[]>();
  return (
    <div
      className="MexMap"
      style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
    >
      <div style={style}>
        <ComposableMap
          width={550}
          height={400}
          projection="geoAlbers"
          projectionConfig={{
            scale: 1100,
            center: [-5, 24.6],
          }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateName = geo.properties.NAME_1;
                const isStateSelected = selectedState === stateName;
                const geoCoordinates = geo.geometry.coordinates;
                const coordinates: number[][] = [];
                flatArray(geoCoordinates, coordinates);
                const coordinatesCenter = calculatePolygonCenter(coordinates);

                // console.log(stateName, coordinatesCenter);
                mapCoordinateStates.set(stateName, coordinatesCenter);
                // console.log(
                //   JSON.stringify(Object.fromEntries(mapCoordinateStates)),
                // );
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    // onMouseEnter={(event) => {
                    //   const {
                    //     target: { value },
                    //   } = event;
                    //   console.log(event);
                    //   console.log(geo.properties);
                    //   setSelectedState(`${geo.properties.NAME_1}`);
                    // }}
                    // onMouseLeave={() => {
                    //   setSelectedState('');
                    // }}
                    onClick={() => setSelectedState(stateName)}
                    fill={
                      isStateSelected
                        ? SELECTED_STATE_COLOR
                        : DEFAULT_STATE_COLOR
                    }
                    style={{
                      default: {
                        strokeWidth: 1,
                        stroke: HOVER_STATE_COLOR,
                        outline: 'none',
                      },
                      hover: {
                        fill: HOVER_STATE_COLOR,
                        outline: 'none',
                      },
                      pressed: {
                        fill: SELECTED_STATE_COLOR,
                        outline: 'none',
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
          {
            // useMarkers &&
            Array.from(new Map(Object.entries(mexStateCenterCoordinates))).map(
              ([stateName, { code, center }], key) => {
                return (
                  <Marker key={key} coordinates={center} fill="#777">
                    <text
                      textAnchor="middle"
                      fill={getComputedStyle(
                        document.documentElement,
                      ).getPropertyValue('--sidenav-background-app')}
                      fontSize={5}
                      fontWeight="bold"
                    >
                      {code}
                    </text>
                  </Marker>
                );
              },
            )
          }
        </ComposableMap>
      </div>
    </div>
  );
};

const flatArray = (array: Array<any>, result: number[][]) => {
  if (
    array.length === 2 &&
    !Array.isArray(array[0]) &&
    !Array.isArray(array[1])
  ) {
    result.push(array);
    return;
  }
  array.forEach((elem) => {
    flatArray(elem, result);
  });
};

const calculatePolygonCenter = (arr: number[][]) => {
  const x: number[] = arr.map((xy) => xy[0]);
  const y: number[] = arr.map((xy) => xy[1]);
  const cx: number = (Math.min(...x) + Math.max(...x)) / 2;
  const cy: number = (Math.min(...y) + Math.max(...y)) / 2;
  return [cx, cy];
};
