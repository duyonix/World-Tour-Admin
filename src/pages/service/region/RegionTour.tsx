import React from "react";
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
        apiKey={googleMapsApiKey}
        streetViewPanoramaOptions={streetViewPanoramaOptions}
      />
    </div>
  );
};

export default RegionTour;
