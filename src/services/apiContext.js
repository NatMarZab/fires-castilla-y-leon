import React, { useContext, useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { filterFires, filterGenerator, locationsGenerator } from '../utils/utils';
import { mockedCoordinatesArray } from '../mocks/_coords';

const APIContext = createContext();

const filterFields = ['provincia', 'situacion_actual', 'causa_probable', 'nivel_maximo_alcanzado'];

function loadInitialFilters() {
  let initialFilters = {};
  filterFields.forEach(field => initialFilters[field] = "none");
  localStorage.setItem('filters', initialFilters)
}
function getInitialFiltersState() {
  const filters = localStorage.getItem('filters')
  return filters ? filters : loadInitialFilters();
}

// Configurada para que sólo genere las coordenadas de 10 incendios, por problemas de baneo con la API generadora de coordenadas. 
// Para mostrar todos los incendios, comentar la línea del bucle for y descomentar la anterior
function coordinatesGenerator(locations) {
    const locations2 = locations;  
    const coordinates = [];
      // locations.forEach((location) => {
        for(let i = 0; i < 10; i++) {
          const location = locations2[i];
          async function fetchDataOsMapi(location) {
              const encodedLocation = encodeURIComponent(location);
              const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedLocation}`;
                  
              try {
                const { data } = await axios.get(apiUrl);
                if (data.length > 0) {
                  console.log("api OPM working", data)
                  const firstResult = data[0];
                  const latitude = parseFloat(firstResult.lat);
                  const longitude = parseFloat(firstResult.lon);
                  console.log(`Coordinates: Latitude ${latitude}, Longitude ${longitude}`);
                  const fireCoordinates = [latitude, longitude];
                  coordinates.push(fireCoordinates);
                }
              } catch (error) {
                console.error(error);
              };
          }
          fetchDataOsMapi(location);
         
      };
      return coordinates;
}

// Para data real, descomentar líneas comentadas y comentar la de const [mockedCoordinates, setMockedCoordinates] = useState([]);
export function APIContextProvider({ children }) {
  const [fires, setFires] = useState([]);
  const [fireCount, setFireCount] = useState(0);
  const [filtersWithOptions, setFiltersWithOptions] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState(getInitialFiltersState)
  const [filteredFires, setFilteredFires] = useState([]);
 // const [locations, setLocations] = useState([]);
  //const [coordinates, setCoordinates] = useState([]); 
  const [mockedCoordinates, setMockedCoordinates] = useState([]);

  useEffect(() => {
    async function fetchDataCyL() {
      const { data } = await axios.get(
        `https://analisis.datosabiertos.jcyl.es/api/explore/v2.1/catalog/datasets/incendios-forestales/records?limit=100&offset=0&timezone=UTC&include_links=false&include_app_metas=false`
      );
      setFires(data.results);
      setFireCount(data.total_count)
      setFiltersWithOptions(filterGenerator(filterFields, data.results));
      setFilteredFires(filterFires(data.results, selectedFilters));
      return data.results;
    }
    async function settingCoords() {
       const data = await fetchDataCyL(); 
       return data.length > 0 ? setMockedCoordinates(mockedCoordinatesArray) : console.log("no se está seteando el mockedCoordinates en apicontext.js");
    }
    
    //Para data real, descomentar la siguiente función y comentar la anterior
    // async function settingCoords() {
    //     const data = await fetchDataCyL(); 
    //     data.length > 0 ? setLocations(locationsGenerator(filteredFires.length > 0 ? filteredFires : data)) : console.log("no se están seteando las locations"); 
    //     return data.length > 0 ? setCoordinates(coordinatesGenerator(locations)) : console.log("no se están seteando las coordinates");
    // }

    fetchDataCyL();
    settingCoords();

  }, [, selectedFilters]); 

  useEffect(() => {
    localStorage.setItem('filters', JSON.stringify(selectedFilters))
  }, [selectedFilters])


  return (
    <APIContext.Provider
      value={{
        fires,
        filteredFires,
        fireCount,
        filtersWithOptions,
        selectedFilters,
        setSelectedFilters,
      //  coordinates,
        mockedCoordinates,
      }}
    >
      {children}
    </APIContext.Provider>
  );
}

export function useAPI() {
  const context = useContext(APIContext);
  if (context === undefined) {
    throw new Error("Context must be used within a Provider");
  }
  return context;
}