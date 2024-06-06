import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet-easybutton/src/easy-button.js";
import "leaflet-easybutton/src/easy-button.css";
import "font-awesome/css/font-awesome.min.css";

const MyLocationButton = (props: { zoom: number }) => {
	const map = useMap();

	useEffect(() => {
		L.easyButton(
			"fa-location-arrow",
			() => {
				map.locate({ setView: true, maxZoom: props.zoom });
			},
			"Your Location",
			"my-location"
		).addTo(map);

		// L.easyButton(
		// 	"fa-globe",
		// 	() => {
		// 		map.setView([0, 0], 2);
		// 	},
		// 	"Show Whole World"
		// ).addTo(map);
	}, []);

	return null;
};

export default MyLocationButton;
