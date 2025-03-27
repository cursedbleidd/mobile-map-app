import { Marker } from "react-native-maps"
import { MarkerInfo } from "../constrains/types"
import { useRouter } from "expo-router"

export type MarkerListProps = {
    markers: MarkerInfo[]
}

export const MarkerList : React.FC<MarkerListProps> = ({markers}) => {
    const router = useRouter();
    return (
        <>
        {
            markers.map((markerinfo) =>
                <Marker
                    key={markerinfo.id}
                    coordinate={{latitude: markerinfo.latitude, longitude: markerinfo.longitude}}
                    title={`Marker ${markerinfo.id}`}
                    onPress={() =>
                        router.push({
                          pathname: `/marker/[id]`,
                          params: {
                            id: markerinfo.id.toString(),
                            latitude: markerinfo.latitude.toString(),
                            longitude: markerinfo.longitude.toString(),
                          },
                        })
                      }/>
            )
        }
        </>
    )
}