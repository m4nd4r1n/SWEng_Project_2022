import { useEffect, useState } from "react";
import useCoords from "@libs/client/useCoords";

declare global {
  interface Window {
    kakao: any;
  }
}

interface UseAddressState {
  id: number | null;
  sido: string | null;
  sigungu: string | null;
}

export default function useAddress() {
  const { latitude, longitude } = useCoords();

  const [address, setAddress] = useState<UseAddressState>({
    id: null,
    sido: null,
    sigungu: null,
  });

  useEffect(() => {
    const map = document.createElement("script");
    map.async = true;
    map.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env
      .NEXT_PUBLIC_KAKAO_MAP!}&libraries=services&autoload=false`;
    document.head.appendChild(map);
    const onLoad = () => {
      window.kakao.maps.load(() => {
        const geocoder = new window.kakao.maps.services.Geocoder();
        const callback = (result: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            setAddress({
              id: +result[0].code.slice(0, 5),
              sido: result[0].region_1depth_name,
              sigungu: result[0].region_2depth_name,
            });
          }
        };
        geocoder.coord2RegionCode(longitude, latitude, callback);
      });
    };
    map.addEventListener("load", onLoad);
    return () => {
      map.removeEventListener("load", onLoad);
      document.head.removeChild(map);
    };
  }, [longitude, latitude]);

  return address;
}
