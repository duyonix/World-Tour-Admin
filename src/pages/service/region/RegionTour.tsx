import React, { memo, useState, useEffect } from "react";
import ReactStreetview from "react-streetview";

type Props = {
  coordinate: {
    lattitude: number;
    longitude: number;
  };
};

const RegionTour = ({ coordinate }: Props) => {
  const { lattitude, longitude } = coordinate;
  const googleMapsApiKey = "AIzaSyB0pAAfd-SgsJm0w0hvzZfg90qfXoPN9bw";
  const [key, setKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setKey(prevKey => prevKey + 1);
    }, 1000); // Set a delay of 1 second before updating the key

    return () => clearTimeout(timer); // Clear the timeout when the component unmounts
  }, [lattitude, longitude]);

  const streetViewPanoramaOptions = {
    position: { lat: lattitude, lng: longitude },
    pov: { heading: 100, pitch: 0 },
    zoom: 1,
    addressControl: true,
    showRoadLabels: true,
    zoomControl: true
  };

  return (
    <div
      style={{
        margin: "auto",
        width: "90%",
        height: "500px",
        backgroundColor: "#eeeeee"
      }}
    >
      <ReactStreetview
        key={key}
        apiKey={googleMapsApiKey}
        streetViewPanoramaOptions={streetViewPanoramaOptions}
        fallback={
          <div>
            <h1>Sorry, this place cannot be shown</h1>
          </div>
        }
      />
    </div>
  );
};

export default memo(RegionTour);
