import React, { useEffect, useState } from "react";
import "../stylesheet/layout/_main.scss";
import Filters from './Filters';
import StickyHeadTable from "./StickyHeadTable";
import FiresMap from "./map/FiresMap";
import { columnGenerator } from '../utils/utils';
import { useAPI } from '../services/apiContext';

function Main() {
    const { filteredFires } = useAPI();
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        if (filteredFires.length > 0) {
            setColumns(columnGenerator(filteredFires))
        }
    }, [filteredFires])
    

  

    return (
     <>
      <main className="main">
        <section className="section first">
            <h2 className="subtitle">Tabla de incendios</h2>
            <div className="content">
                <Filters />
                <StickyHeadTable data={filteredFires} columns={columns} data-testid="tableMuI"/>            
            </div>
        </section>
        <section className="section second">
            <h2 className="subtitle">Mapa de incendios</h2>
            <div className="content">
              <div id="map" >
                <FiresMap data-testid="openStreetMap" />
              </div>                
            </div>
        </section>
      </main>
     </>
    )
}
export default Main;