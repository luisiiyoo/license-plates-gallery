import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import MissingDetailsPanel from 'src/components/SearchLicensePlatesPanel/ MissingDetailsPanel';
import Header from 'src/components/Header';
import Loader from 'src/components/Loader';
import { MxMap } from 'src/components/Maps/MxMap';
import YearsPanel from 'src/components/SearchLicensePlatesPanel/YearsPanel';
import connector from 'src/connector';
import {
  BELicensePlatesData,
  BEQueryLicensePlatesData,
} from 'src/connector/backend.types';
import { StateType } from 'src/redux/reducers/Main/Main.types';
import { useConstructor } from 'src/utils';

const YEAR_OPTIONS = [
  '1968-1969',
  '1970-1971',
  '1972-1973',
  '1974-1975',
  '1976-1977',
  '1978-1979',
  '1980-1981',
  '1982-1983',
  '1984-1985',
  '1986-1991',
  '1992-1997',
];
const EXCLUDE_VEHICLES = ['FRONTIER'];
export interface MissingPlatesPanelProps {}

const MissingPlatesPanel = ({}: MissingPlatesPanelProps) => {
  const { userID, availableYears, stateCodes }: StateType = useSelector(
    (state) => state.main,
  );

  const [platesDataArray, setPlatesDataArray] = useState<BELicensePlatesData[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    statusCode: -1,
    message: '',
  });

  const [selectedYear, setSelectedYear] = useState('');
  const [selectedState, setSelectedState] = useState('');

  const [filteredStates, setFilteredStates] = useState(new Array<string>());
  const [filteredYears, setFilteredYears] = useState(new Array<string>());

  useConstructor(async () => {
    try {
      setIsLoading(true);
      const params: BEQueryLicensePlatesData = {
        from_year: availableYears.from_year,
        to_year: availableYears.to_year,
      };
      const data: BELicensePlatesData[] = await connector.getLicensePlatesData(
        userID,
        params,
      );
      setPlatesDataArray(data);
    } catch (error) {
      console.error(error);
      setError({
        statusCode: 500,
        message: `Unable get inventory data: ${error}`,
      });
    } finally {
      setIsLoading(false);
    }
  });

  const filterStatesByYear = (yearLabel: string) => {
    let filteredData: BELicensePlatesData[] = [];
    const index = YEAR_OPTIONS.lastIndexOf(yearLabel);
    const [fromYear, toYear] = YEAR_OPTIONS[index]
      .split('-')
      .map((year) => Number(year));
    filteredData = platesDataArray.filter(
      (plate) =>
        (plate.from_year === fromYear && plate.to_year === toYear) ||
        (plate.from_year === fromYear && plate.to_year === fromYear) ||
        (plate.from_year === toYear &&
          plate.to_year === toYear &&
          !EXCLUDE_VEHICLES.includes(plate.vehicle_type)),
    );
    const uniques = new Set<string>(
      filteredData.map((plate) => plate.region_code),
    );
    return Array.from(uniques);
  };

  const filterYearsByState = (stateCode: string) => {
    let filteredData: BELicensePlatesData[] = [];

    filteredData = platesDataArray.filter(
      (plate) => plate.region_code === stateCode,
    );

    const uniques = new Set<string>(
      filteredData.map((plate) => `${plate.from_year}-${plate.to_year}`),
    );
    return Array.from(uniques);
  };

  const selectYearHandler = (yearLabel: string) => {
    if (yearLabel === selectedYear) return;

    setSelectedYear(yearLabel);
    setSelectedState('');
    setFilteredYears([yearLabel]);
    setFilteredStates(filterStatesByYear(yearLabel));
  };

  const selectStateHandler = (stateCode: string) => {
    if (stateCode === selectedState) return;

    setSelectedState(stateCode);
    setSelectedYear('');

    setFilteredStates([stateCode]);
    setFilteredYears(filterYearsByState(stateCode));
  };

  return (
    <>
      {isLoading ? <Loader /> : undefined}
      <div
        className="MissingPlatesPanel"
        style={{ display: isLoading ? 'none' : 'block' }}
      >
        <Header title="Placas Faltantes" />
        <h4>Años</h4>
        <YearsPanel
          yearOptions={YEAR_OPTIONS}
          selectYearHandler={selectYearHandler}
          filteredYears={filteredYears}
        />
        <h4>Estados</h4>
        <MxMap
          selectStateHandler={selectStateHandler}
          filteredStates={filteredStates}
          staticMap={false}
        />
        <MissingDetailsPanel
          selectedState={selectedState}
          selectedYear={selectedYear}
          filteredYears={filteredYears}
          yearOptions={YEAR_OPTIONS}
          filteredStates={filteredStates}
          stateOptions={Object.keys(stateCodes)}
        />
      </div>
    </>
  );
};

export default MissingPlatesPanel;