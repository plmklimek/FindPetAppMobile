import React, {useEffect, useContext, useState} from 'react';
import {View, Text} from 'react-native';
import {NewAppInfo} from '../../context/AppInfo';
import MapboxGL from '@react-native-mapbox-gl/maps';
import axios from 'axios';
import {
  MyTextInput,
  MyText,
  MyTouchableOpacity,
  MyPicker,
  LabelText,
} from '../../styles/DataInfoStyle';
import {Container, MapView, LocationName} from '../../styles/LocationInfoStyle';
const returnStartLocation = userInfo => {
  let startLocation = {};
  startLocation.longitude = 18.5984437;
  startLocation.latitude = 53.0137902;
  if (userInfo.request.images !== undefined) {
    if (userInfo.request.images[0] !== undefined) {
      if (
        userInfo.request.images[0].latitude !== undefined &&
        userInfo.request.images[0].latitude !== null
      ) {
        startLocation.latitude = userInfo.request.images[0].latitude;
        startLocation.longitude = userInfo.request.images[0].longitude;
      }
    }
  }
  //console.log(startLocation);
  return [startLocation.longitude, startLocation.latitude];
};
const LocationInfo = (props, map) => {
  const userInfo = useContext(NewAppInfo);
  //pk.eyJ1IjoibWtsaW1lazE5OTciLCJhIjoiY2szd3Z4ZW9rMTA5ajNkb3B4cXd6ZW9wNSJ9.060xIr41HznBuJS_UYt1IA
  //https://api.mapbox.com/geocoding/v5/mapbox.places/18.599031491675078,53.010916449085045.json?access_token=pk.eyJ1IjoibWtsaW1lazE5OTciLCJhIjoiY2szd3Z4ZW9rMTA5ajNkb3B4cXd6ZW9wNSJ9.060xIr41HznBuJS_UYt1IA
  const returnName = async points => {
    await axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${points[0]},${points[1]}.json?access_token=pk.eyJ1IjoibWtsaW1lazE5OTciLCJhIjoiY2szd3Z4ZW9rMTA5ajNkb3B4cXd6ZW9wNSJ9.060xIr41HznBuJS_UYt1IA`,
      )
      .then(response => {
        setNamePoints(response.data.features[0].place_name);
      });
  };
  const updatePoints = async points => {
    //console.log(points);
    await returnName(points);
    await setPoints(points);
  };
  MapboxGL.setAccessToken(
    'pk.eyJ1IjoibWtsaW1lazE5OTciLCJhIjoiY2szd3Z4ZW9rMTA5ajNkb3B4cXd6ZW9wNSJ9.060xIr41HznBuJS_UYt1IA',
  );
  const [isReady, setReady] = useState(false);
  const [points, setPoints] = useState(returnStartLocation(userInfo));
  const [namePoints, setNamePoints] = useState('');
  const requestSummary = async () => {
    let temp = await userInfo.request;
    temp.location = points;
    console.log(temp);
    await userInfo.setRequest(temp);
    await props.navigation.navigate('SummaryComponent');
  };
  useEffect(() => {
    if (isReady === false) {
      returnName(returnStartLocation(userInfo));
      setReady(true);
    }
  });

  return (
    <Container>
      <Text>Podaj lokalizację jeśli nie została wczytana automatycznie :</Text>
      <MapView
        onPress={({geometry}) => {
          updatePoints(geometry.coordinates);
        }}>
        <MapboxGL.Camera zoomLevel={14} centerCoordinate={points} />
        <MapboxGL.PointAnnotation
          key="punkt"
          id="punkt"
          title="Test"
          coordinate={points}></MapboxGL.PointAnnotation>
      </MapView>
      <LocationName>{namePoints}</LocationName>
      <MyTouchableOpacity
        onPress={() => {
          requestSummary();
        }}>
        <MyText>Dalej</MyText>
      </MyTouchableOpacity>
    </Container>
  );
};
export default LocationInfo;
