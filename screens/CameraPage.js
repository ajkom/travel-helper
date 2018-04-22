import React from 'react';
import { Alert, Text, View, TouchableOpacity } from 'react-native';
import { Camera, Permissions } from 'expo';

export default class CameraPage extends React.Component {

  static navigationOptions = {title: 'Camera'};

  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    photo: null,
  };

componentDidMount() {
    this.getCameraAccess();
  }

  getCameraAccess = async () => {
    let { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  takePicture = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      this.setState({photo:photo.uri});
      this.savePicture();
    }
  };

  savePicture = () => {
    const { navigate } = this.props.navigation;
    navigate('Diary', {photo:this.state.photo})
    Alert.alert(this.state.photo)
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={{ flex: 1 }}
            type={this.state.type}
            ref={ref => { this.camera = ref; }}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  });
                }}>
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                  {' '}Flip{' '}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 0.9, alignSelf: 'flex-end', alignItems: 'center' }}
                onPress={this.takePicture.bind(this)}>
                <Text> SNAP </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}
