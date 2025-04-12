import { Marker } from "react-native-maps"
import { MarkerInfo } from "../types"
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
                    title={markerinfo.title}
                    onPress={() =>
                        router.push({
                          pathname: `/marker/[id]`,
                          params: {
                            id: markerinfo.id.toString(),
                          },
                        })
                      }/>
            )
        }
        </>
    )
}