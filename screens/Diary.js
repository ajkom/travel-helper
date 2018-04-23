import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, FlatList, TouchableOpacity, Alert, Dimensions } from 'react-native';
import Expo, { SQLite, Camera, Permissions } from 'expo';
import { FormInput, FormLabel, Button, Icon } from 'react-native-elements';
import { Container, Header, Content, Card, CardItem, Body, Thumbnail, DeckSwiper, Left } from 'native-base';
import DatePicker from 'react-native-datepicker';
import SlidingUpPanel from 'rn-sliding-up-panel';

const db = SQLite.openDatabase('mynotesdb.db');

export default class Diary extends React.Component {

  static navigationOptions = {
    title: 'My diary',
    tabBarLabel: 'My diary',
    tabBarIcon: ({tintColor}) => <Icon type= 'material-community' name='notebook' color={tintColor} />
  };

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
      this.setState({
        photo:photo.uri,
      });
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
    let width = Dimensions.get('window').width;


    //if (typeof(this.state.mynotes)=='undefined' || this.state.mynotes == null) return null;

    return (
      <View style={styles.container}>
      <FlatList
        data={this.state.mynotes}
        //style={{width: width}}
        keyExtractor={item => item.id.toString()}
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

      <Button raised title='Add a note'
        onPress={() => this.setState({notePanelVisible: true})}
         rightIcon={{name:'add'}}
         buttonStyle={{
           width: width,
           backgroundColor:'#5d737e'
         }}
      />

        <SlidingUpPanel
          visible={this.state.notePanelVisible}
          onRequestClose={() => this.setState({notePanelVisible: false})}>

          <View style={styles.container}>
            <Button raised
             onPress={this.saveItem}
             title="SAVE"
             rightIcon={{name:'note-add'}}
             buttonStyle={{
               width: width,
               backgroundColor:'#5d737e'
             }} />

            <FormLabel labelStyle={styles.label}>DATE</FormLabel>
            <DatePicker
              placeholder="Select date"
              mode="date"
              format="DD-MM-YYYY"
              date={this.state.date}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={false}
              onDateChange={(date) => this.setState({date})}
              customStyles={{
                placeholderText:styles.input,
                dateInput: {
                  borderWidth:0,
                  borderBottomWidth: 1
                },
                dateText:styles.input
              }}
              style={{
                width:width,
                padding: 0,
                margin: 0
              }}
            />

            <FormLabel labelStyle={styles.label}>PLACE</FormLabel>
            <FormInput
              placeholder='place'
              onChangeText={(place) => this.setState({place})}
              value={this.state.place}
              inputStyle={styles.input}
            />

            <FormLabel labelStyle={styles.label}>NOTES </FormLabel>
            <FormInput multiline
              placeholder='notes'
              onChangeText={(note) => this.setState({note})}
              value={this.state.note}
              inputStyle={styles.input}
            />

            <FormLabel labelStyle={styles.label}>PHOTO</FormLabel>
            <Button raised rounded
              onPress={() => this.setState({cameraActive: '1'})}
              title="Take a picture"
              rightIcon={{name:'photo-camera'}}
              buttonStyle={{
                backgroundColor:'#5d737e',
                width:150
              }}/>

        <Camera
          //style={{flex: 1}}
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




const styles = StyleSheet.create({
    /*container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '5%',
    },*/
    container: {
      flex: 1,
      //padding: 16,
    //  paddingTop: 30,
      alignItems: 'center',
    //  justifyContent: 'center',
      backgroundColor: '#fff'
    },
    head: {
      height: 40,
      backgroundColor: '#f1f8ff'
     },
    text: {
      margin: 6
    },
    label: {
      fontSize:16,
    },
    input: {
      fontSize:16,
      marginRight: 2,
      textAlign: 'center'
    }
});
