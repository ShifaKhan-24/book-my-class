import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  StatusBar,
  SafeAreaView,
  View,
  ActivityIndicator,
  Modal,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';
import {COLORS} from '../assets/color';
import Header from '../component/header';
import ClassRoom from '../component/room';
import GradientButton from '../component/gradientbutton';
import database from '@react-native-firebase/database';
import {FLOOR} from '../utility/constants';
import RBSheet from 'react-native-raw-bottom-sheet';
import {FONTS} from '../assets/fontFamily';

const HomeScreen = ({navigation}) => {
  const [floor, setFloor] = useState([]);
  const [selected, setSelected] = useState();
  const [isLoading, setisLoading] = useState(false);
  const [bookedRoom, setBookedRoom] = useState([]);
  const [floorValue, setfloorValue] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const now = new Date();
  const height = Dimensions.get('screen').height;

  const booking = useRef();

  useEffect(() => {
    setisLoading(true);
    setFloor(FLOOR[floorValue]);
    database()
      .ref(`/bookings/${now.getFullYear()}/7/2/${floorValue}/1`)
      .once('value', snapshot => {
        snapshot.forEach(item => {
          if (!snapshot.exists()) {
            setBookedRoom([]);
          } else {
            setBookedRoom(rooms => [...rooms, item.key.toString()]);
          }
        });
      });
    setisLoading(false);
  }, [floorValue]);

  const selectingRoom = room => {
    if (selected === room) {
      setSelected();
    } else {
      setSelected(room);
    }
  };

  const bookRoom = () => {
    console.log('Book Room: ' + selected);
    booking.current.open();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} setfloorValue={setfloorValue} />

      <View style={styles.CreatedView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                This Lecure will be conducted by Prof.Bhagyashree Dhakulkar
                Subj:{' '}
              </Text>
            </View>
          </View>
        </Modal>
      </View>

      {isLoading && (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size={60} color={COLORS.primary} />
        </View>
      )}
      {!isLoading && (
        <ScrollView contentContainerStyle={styles.scrollView}>
          {floor &&
            floor.map((item, index) => {
              return (
                <ClassRoom
                  classroomnum={item}
                  key={index}
                  select={selectingRoom}
                  disabled={selected === item ? false : selected ? true : false}
                  booked={bookedRoom.includes(item)}
                />
              );
            })}
        </ScrollView>
      )}
      <View style={styles.sticky}>
        <View style={styles.btnContainer}>
          <GradientButton
            text={'BOOK ROOM'}
            onPress={bookRoom}
            disabled={selected ? false : true}
          />
        </View>
      </View>

      <RBSheet
        ref={booking}
        height={height * 0.55}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          container: {
            backgroundColor: COLORS.white,
            borderWidth: 2,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            borderColor: COLORS.primary,
          },
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: '5%',
            marginLeft: '5%',
          }}>
          <View
            style={{
              backgroundColor: COLORS.primary,
              padding: 20,
              borderRadius: 100,
            }}>
            <Text
              style={{
                fontFamily: FONTS.Bold,
                color: COLORS.white,
                fontSize: 30,
                letterSpacing: 2,
              }}>
              012
            </Text>
          </View>
          <View style={{flex: 1, justifyContent: 'center', marginLeft: '3%'}}>
            <Text
              style={{
                fontFamily: FONTS.SemiBold,
                color: COLORS.primary,
                fontSize: 16,
              }}>
              02/08/2022
            </Text>
            <Text
              style={{
                fontFamily: FONTS.Medium,
                color: COLORS.primary,
                fontSize: 14,
              }}>
              01:00 PM - 02:00 PM
            </Text>
          </View>
        </View>
      </RBSheet>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  imagecontainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingBottom: 30,
    paddingTop: 30,
    paddingLeft: 100,
    paddingRight: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 1,
  },
  button: {
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    marginBottom: 20,
  },
  btnContainer: {
    width: '100%',
    paddingHorizontal: 16,
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: '10%',
  },
  buttonOpen: {
    backgroundColor: COLORS.secondary,
    marginTop: 50,
    marginLeft: 30,
    marginRight: 30,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'justify',
  },
  modalText: {
    marginBottom: 30,
    textAlign: 'justify',
    color: 'black',
    fontSize: 20,
  },
  activityIndicator: {
    flex: 1,
    top: '50%',
    left: '45%',
    position: 'absolute',
    zIndex: 20,
  },
  scrollView: {
    flexDirection: 'row',
    flexGrow: 1,
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: '5%',
  },
  sticky: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    marginBottom: 20,
    minHeight: 54,
  },
});

export default HomeScreen;
