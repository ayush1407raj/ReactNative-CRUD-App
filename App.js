import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, TextInput, Button, Platform, TouchableOpacity, ListView, ActivityIndicator } from 'react-native';
import { createStackNavigator } from 'react-navigation';

class MainActivity extends Component {
  static navigationOptions = 
  {
    title: 'MainActivity',
  };

  constructor(props) {
    super(props)

    this.state = {
      TextInput_Student_Name: '',
      TextInput_Student_Class: '',
      TextInput_Student_Email: '',
    }
  }

  InsertStudentRecordsToServer = () =>{
    fetch('https://bizlogic.byethost8.com/Student/InsertStudentData.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        student_name : this.state.TextInput_Student_Name,
        student_class : this.state.TextInput_Student_Class,
        student_email : this.state.TextInput_Student_Email
      })
    }).then((response) => response.json())
        .then((responseJson) => {
          Alert.alert(responseJson);
        }).catch((error) => {
            console.error(error);
        });
  }

  GoTo_Show_StudentListActivity_Function = () =>
  {
    this.props.navigation.navigate('Second');
  }

  render() {
    return (
      <View style={styles.MainContainer}>
          <Text style={{fontSize: 20, textAlign: 'center', marginBottom: 7}}>Student Registration Form</Text>
          <TextInput
              placeholder="Enter Name"
              onChangeText={ TextInputValue => this.setState({ TextInput_Student_Name : TextInputValue }) }
              underlineColorAndroid='transparent'
              style={styles.TextInputStyleClass}
          />
          <TextInput 
              placeholder="Enter Class"
              onChangeText={ TextInputValue => this.setState({ TextInput_Student_Class : TextInputValue }) }
              underlineColorAndroid='transparent'
              style={styles.TextInputStyleClass}
          />
          <TextInput 
              placeholder="Enter Email"
              onChangeText={ TextInputValue => this.setState({ TextInput_Student_Email : TextInputValue }) }
              underlineColorAndroid='transparent'
              style={styles.TextInputStyleClass}
          />
          <TouchableOpacity activeOpacity = { 0.4 } style={styles.TouchableOpacityStyle} onPress={this.InsertStudentRecordsToServer} >
            <Text style={styles.TextStyle}> INSERT STUDENT RECORD TO SERVER </Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { 0.4 } style={styles.TouchableOpacityStyle} onPress={this.GoTo_Show_StudentListActivity_Function} >
            <Text style={styles.TextStyle}> SHOW ALL INSERTED STUDENT RECORDS IN LISTVIEW </Text>
          </TouchableOpacity>
      </View>
    );
  }
}

class ShowStudentListActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
  }

  static navigationOptions = 
  {
    title: 'ShowStudentListActivity',
  };

  componentDidMount() {
    return fetch('https//bizlogic.byethost8.com/Student/ShowAllStudentList.php')
        .then((response) => response.json())
        .then((responseJson) => {
          let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          this.setState({
            isLoading: false,
            dataSource: ds.cloneWithRows(responseJson),
          }, function() {
          });
        })
        .catch((error) => {
          console.error(error);
        });
  }
  GetStudentIDFunction = (student_id, student_name, student_class, student_class, student_phone_number, student_email)=>{
    this.props.navigation.navigate('Third', {
      ID : student_id,
      NAME : student_name,
      CLASS : student_class,
      EMAIL : student_email
    });
  }
  ListViewItemSeparator = () => {
    return(
      <View
        style={{
          height: 0.5,
          width: "100%",
          backgroundColor: "#000",
        }} />
    );
  }

  render() {
    if (this.state.isLoading) {
      return(
        <View style={{flex: 1, paddingTop: 20}} >
          <ActivityIndicator />
        </View>
      );
    }

    return(
      <View style={styles.MainContainer_For_Show_StudentList_Activity}>
        <ListView
          dataSource={this.state.dataSource}
          renderSeparator = {this.ListViewItemSeparator}
          renderRow={(rowData) => <Text style={styles.rowViewContainer}
                      onPress={this.GetStudentIDFunction.bind(
                        this, rowData.student_id,
                              rowData.student_name,
                              rowData.student_class,
                              rowData.student_email
                      )} >
                      {rowData.student_name}
                      </Text> }
        />
      </View>
    );
  }
}

class EditStudentRecordActivity extends Component {

  constructor(props) {
    super(props)
    this.state = {
      TextInput_Student_ID: '',
      TextInput_Student_Name: '',
      TextInput_Student_Class: '',
      TextInput_Student_Email: '',
    }
  }

  componentDidMount(){
    
    this.setState({
      TextInput_Student_ID : this.props.navigation.state.params.ID,
      TextInput_Student_Name : this.props.navigation.state.params.NAME,
      TextInput_Student_Class : this.props.navigation.state.params.CLASS,
      TextInput_Student_Email : this.props.navigation.state.params.EMAIL,
    })
  }

  static navigationOptions =
  {
    title: 'EditStudentRecordActivity',
  };

  UpdateStudentRecord = () =>{
    fetch('https://bizlogic.byethost8.com/Student/UpdateStudentRecord.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        student_id : this.state.TextInput_Student_ID,
        student_name : this.state.TextInput_Student_Name,
        student_class : this.state.TextInput_Student_Class,
        student_email : this.state.TextInput_Student_Email
      })
    }).then((response) => response.json())
        .then((responseJson) => {
          Alert.alert(responseJson);
        }).catch((error) => {
          console.error(error);
        });
  }

  DeleteStudentRecord = () =>{
    fetch('https://bizlogic.byethost8.com/Student/DeleteStudentRecord.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        student_id : this.state.TextInput_Student_ID
      })
    }).then((response) => response.json())
      .then((responseJson) => {
        Alert.alert(responseJson);
      }).catch((error) => {
        console.error(error);
      });
      this.props.navigation.navigate('First');
  }

  render() {

    return(
      <View style={styles.MainContainer}>
        <Text style={{fontSize: 20, textAlign: 'center', marginBottom: 7}}> Edit Student Record Form </Text>
        <TextInput
          placeholder="Student Name Shows Here"
          value={this.state.TextInput_Student_Name}
          onChangeText={ TextInputValue => this.setState({ TextInput_Student_Name : TextInputValue }) }
          underlineColorAndroid='transparent'
          style={styles.TextInputStyleClass}
        />
        <TextInput
          placeholder="Student Class Shows Here"
          value={this.state.TextInput_Student_Class}
          onChangeText={ TextInputValue => this.setState({ TextInput_Student_Class : TextInputValue }) }
          underlineColorAndroid='transparent'
          style={styles.TextInputStyleClass}
        />
        <TextInput
          placeholder="Student Email Shows Here"
          value={this.state.TextInput_Student_Email}
          onChangeText={ TextInputValue => this.setState({ TextInput_Student_Email : TextInputValue }) }
          underlineColorAndroid='transparent'
          style={styles.TextInputStyleClass}
        />
        <TouchableOpacity activeOpacity = { 0.4 } style={styles.TouchableOpacityStyle} onPress={this.UpdateStudentRecord} >
          <Text style={styles.TextStyle}> UPDATE STUDENT RECORD </Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity = { 0.4 } style={styles.TouchableOpacityStyle} onPress={this.DeleteStudentRecord} >
          <Text style={styles.TextStyle}> DELETE CURENT RECORD </Text>
        </TouchableOpacity>
      </View>
    );
  }

}


export default rnCRUDApp = createStackNavigator(
  {
    First : { screen: MainActivity },
    Second: { screen: ShowStudentListActivity },
    Third: { screen: EditStudentRecordActivity }
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  MainContainer: {
    alignItems: 'center',
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#fff'
  },
  MainContainer_For_Show_StudentList_Activity: {
    flex: 1,
    paddingTop: 20,
    marginLeft: 5,
    marginRight: 5
  },
  TextInputStyleClass: {
    textAlign: 'center',
    width: '90%',
    marginBottom: 7,
    height: 40,
    borderWidth: 1,
    borderColor: '#FF5722',
    borderRadius: 5,
  },
  TouchableOpacityStyle: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    marginBottom: 7,
    width: '90%',
    backgroundColor: '#00BCD4'
  },
  TextStyle: {
    color: '#fff',
    textAlign: 'center',
  },

  rowViewContainer: {
    fontSize: 20,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
  }
});