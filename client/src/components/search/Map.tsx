"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAppSelector } from "@/state/redux";
import { selectSearchFilters } from "@/state/slices/globalSlice";
import { useGetPropertiesQuery } from "@/state/apis/propertyApi";
import { IProperty } from "@/types/app/properties";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN! as string;

function Map() {
	const mapContainerRef = useRef(null);
	const filters = useAppSelector(selectSearchFilters);

	const {
		data: properties,
		isError,
		isLoading,
	} = useGetPropertiesQuery(filters);

	useEffect(() => {
		if (isLoading || isError || !properties) return;

		const map = new mapboxgl.Map({
			container: mapContainerRef.current!,
			style: "mapbox://styles/markwongdigital/cmb73qclx00kf01syfjvd3nlq",
			center: filters.coordinates || [-74.5, 40],
			zoom: 9,
		});

		properties.forEach((p) => {
			const marker = createPropertyMarker(p, map);
			const markerElement = marker.getElement();
			const path = markerElement.querySelector("path[fill='#3FB1CE']");

			if (path) path.setAttribute("fill", "#000000");
		});

		function resizeMap() {
			if (map) setTimeout(() => map.resize(), 700);
		}
		resizeMap();

		return () => map.remove();
	}, [isLoading, isError, properties, filters.coordinates]);

	if (isLoading) return <>Loading...</>;
	if (isError || !properties) return <div>Failed to fetch properties</div>;

	return (
		<div className="basis-5/12 grow relative rounded-xl">
			<div
				className="map-container rounded-xl"
				ref={mapContainerRef}
				style={{
					height: "100%",
					width: "100%",
				}}
			/>
		</div>
	);
}

function createPropertyMarker(property: IProperty, map: mapboxgl.Map) {
	const marker = new mapboxgl.Marker()
		.setLngLat([
			property.location.coordinates.longitude,
			property.location.coordinates.latitude,
		])
		.setPopup(
			new mapboxgl.Popup().setHTML(
				`
        <div class="marker-popup">
          <div class="marker-popup-image"></div>
          <div>
            <a href="/search/${property.id}" target="_blank" class="marker-popup-title">${property.name}</a>
            <p class="marker-popup-price">
              $${property.pricePerMonth}
              <span class="marker-popup-price-unit"> / month</span>
            </p>
          </div>
        </div>
        `
			)
		)
		.addTo(map);
	return marker;
}

export default Map;
