import tw from "tailwind-styled-components";
import { useEffect } from "react";

interface MapProps {
  latitude: number;
  longitude: number;
}

const MapContainer = tw.div`
  border
  border-gray-400
  rounded-lg
  aspect-[320/220]
  -z-10
`;

function Map({ latitude, longitude }: MapProps) {
  useEffect(() => {
    const mapScript = document.createElement("script");

    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP}&autoload=false`;

    document.head.appendChild(mapScript);

    const map = document.createElement("script");
    map.async = true;
    map.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP}&libraries=services&autoload=false`;
    document.head.appendChild(map);

    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
        };
        const map = new window.kakao.maps.Map(container, options);
        const markerPosition = new window.kakao.maps.LatLng(
          latitude,
          longitude
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);
      });
    };
    mapScript.addEventListener("load", onLoadKakaoMap);

    return () => {
      mapScript.removeEventListener("load", onLoadKakaoMap);
      document.head.removeChild(mapScript);
      document.head.removeChild(map);
    };
  }, [latitude, longitude]);

  return <MapContainer id="map" />;
}

export default Map;
