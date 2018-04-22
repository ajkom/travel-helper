import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import Expo, { SQLite, Camera, Permissions } from 'expo';
import { FormInput, FormLabel, Button } from 'react-native-elements';
import { Container, Header, Content, Card, CardItem, Body, Thumbnail, Icon, DeckSwiper, Left } from 'native-base';
import DatePicker from 'react-native-datepicker';
import SlidingUpPanel from 'rn-sliding-up-panel';

const db = SQLite.openDatabase('mynotesdb.db');

export default class Diary extends React.Component {

  static navigationOptions = {title: 'Diary'};

  constructor(props) {
    super(props);
    this.state = {
      date: '',
      place: '',
      note: '',
      photo: '',
      mynotes: [],
      notePanelVisible:false,
      cameraActive:'0',
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      };
  }

  componentDidMount() {
    db.transaction(tx => {
      tx.executeSql('create table if not exists mynotes (id integer primary key not null, note text, date text, place text, photo text);');
    });

    this.getCameraAccess();

    this.updateList();
  }

  getCameraAccess = async () => {
    let { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  takePicture = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      this.setState({photo:photo.uri});
    }
  };

  saveItem = () => {
    db.transaction(tx => {
        tx.executeSql('insert into mynotes (date, place, note, photo) values (?, ?, ?, ?)', [this.state.date, this.state.place, this.state.note, this.state.photo]);
      }, null, this.updateList);

    this.setState({notePanelVisible: false})

  }

  updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from mynotes', [], (_, { rows }) =>
        this.setState({mynotes: rows._array, date:'', place:'', note:'', photo:'' })
      );
    });
  }

  deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from mynotes where id = ?;`, [id]);
      }, null, this.updateList
    )
  }

  renderItem =  ({item}) => {
      return(
        <View>
          <Card>
            <CardItem>
                <Body>
                  <Text onLongPress={() => this.deleteItem(item.id)}>{item.date}, {item.place}</Text>
                </Body>
            </CardItem>
            <CardItem cardBody>
              <Text>{item.note}</Text>
              <Image
                source={{uri:item.photo}}
                style={{width:200, height:100}}
               />
            </CardItem>
          </Card>
        </View>
      )
  }

  render() {
    const { navigate } = this.props.navigation;
    console.log(this.state.mynotes);

    if (typeof(this.state.mynotes)=='undefined' || this.state.mynotes == null) return null;

    return (
      <View style={styles.container}>
      <FlatList
        data={this.state.mynotes}
        //style={{width: width}}
        keyExtractor={item => item.id}
        renderItem={this.renderItem}
      />
    {/*  <Container>
        <View>
          <DeckSwiper
            dataSource={this.state.mynotes}
            renderItem={item =>
              <Card style={{ elevation: 3 }}>
                <CardItem>
                  <Left>
                    <Thumbnail source={item.photo} />
                    <Body>
                      <Text>{item.place}</Text>
                      <Text note>NativeBase</Text>
                    </Body>
                  </Left>
                </CardItem>
                <CardItem cardBody>
                  <Image style={{ height: 300, flex: 1 }} source={{uri:item.photo}} />
                </CardItem>
                <CardItem>
                  <Icon name="heart" style={{ color: '#ED4A6A' }} />
                  <Text>{item.note}</Text>
                </CardItem>
              </Card>
            }
          />
        </View>
      </Container>*/}

      <Button title='Add a note' onPress={() => this.setState({notePanelVisible: true})} />
        <SlidingUpPanel
          visible={this.state.notePanelVisible}
          onRequestClose={() => this.setState({notePanelVisible: false})}>

          <View style={styles.container}>
            <Button onPress={this.saveItem} title="SAVE" />

            <FormLabel>DATE</FormLabel>
            <DatePicker
              placeholder="select date"
              mode="date"
              format="DD-MM-YYYY"
              date={this.state.date}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={false}
              onDateChange={(date) => this.setState({date})}
              style={{}}
            />

            <FormLabel>PLACE</FormLabel>
            <FormInput
              placeholder='place'
              onChangeText={(place) => this.setState({place})}
              value={this.state.place}
            />

            <FormLabel>NOTES </FormLabel>
            <FormInput multiline
              placeholder='notes'
              onChangeText={(note) => this.setState({note})}
              value={this.state.note}
            />





            <FormLabel>PHOTO</FormLabel>
            <Button onPress={() => this.setState({cameraActive: '1'})} title="Take a picture" />

        <Camera
          style={{flex: Number(this.state.cameraActive)}}
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
              style={{ flex: 0.9, alignSelf: 'flex-start', alignItems: 'center' }}
              onPress={this.takePicture}>
              <Text> SNAP </Text>
            </TouchableOpacity>
          </View>
        </Camera>

        </View>
      </SlidingUpPanel>








          </View>
    )
  }
}



/*const cards = [
  {
    text: 'Card two',
    name: 'two',
    image:'https://static3.cbrimages.com/wp-content/uploads/2017/11/iron-man-tony-stark-robert-downey-jr-1920x1080.jpg?q=35&w=864&h=486&fit=crop',
  },
  {
    text: 'Card two',
    name: 'two',
    image: 'https://static0.cbrimages.com/wp-content/uploads/2017/03/tony-stark-header.jpg',
  },
];
*/


const styles = StyleSheet.create({
    /*container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '5%',
    },*/
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 }
});
