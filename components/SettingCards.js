import React from 'react';
import {DataContext} from '../DATA';

import { Button } from './MainScreen';

import {
  View,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native';

import {
  TextInput,
  Checkbox,
  Snackbar
} from 'react-native-paper';



export default function SettingCards({navigation}){

  const initial = {
      final:'',
      name: '',
      card:'',
      cc_mastercard:false,
      cc_visa:true,
      total:'',
      isPaid:false,
      expireIn:'',
  }

  const [fields, setFields] = React.useState(initial)

  const {cards, dispatch} = React.useContext(DataContext);
  const [send, setSend] = React.useState(false);

  React.useEffect( () => {

    if(send){
      setTimeout( () => {
        setSend(false)
      }, 2000)
    }
    
  })

  return(
    <View style={styles.container}> 
      <Notification text='Cadastrado!' visible={send}/>       
      <View style={styles.row}>
          <TextInput
            label='Cartão'
            style={styles.input}
            value={fields.card}
            onChangeText={text => setFields({...fields, card: text })}
          />

           <TextInput
            label='Final do Cartão'
            style={styles.input}
            value={fields.final}
            onChangeText={text => setFields({...fields, final: text })}
          />
      </View>
      <View style={{padding:10}}>
          <TextInput
            label='Titular'
            value={fields.name}
            onChangeText={text => setFields({...fields, name: text })}
          />
      </View>
      <View style={{padding:10}}>
          <TextInput
            label='Total da Fatura'
            value={fields.total}
            onChangeText={text => setFields({...fields, total: text })}
          />
      </View>
      <View style={{padding:10}}>
          <TextInput
            label='Vencimento'
            value={fields.expireIn}
            onChangeText={text => setFields({...fields, expireIn: text })}
          />
      </View>
      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
        
         <Text>Visa</Text>
         <Checkbox
            status={fields.cc_visa ? 'checked' : 'unchecked'}           
            value={fields.cc_visa}
            onPress={() => setFields({
              ...fields, 
              cc_visa: !fields.cc_visa, 
              cc_mastercard: !fields.cc_mastercard 
            })}
          /> 

          <Text>Master</Text>
          <Checkbox            
            status={fields.cc_mastercard ? 'checked' : 'unchecked'}      
            value={fields.cc_mastercard}
            onPress={() => setFields({
              ...fields, 
              cc_visa: !fields.cc_visa, 
              cc_mastercard: !fields.cc_mastercard
            })}    
          />      
      </View>
      <View style={styles.button}>
        <Button press={ () => {
           dispatch({type:'ADD_CARD', newCard: fields });
           setFields(initial);
           setSend(true);
          }}/>
      </View>      
    </View>
  )
}


const Notification = ({text, visible = false}) => {  

  return (    
      visible && 
      <View style={{margin:10, padding:10, backgroundColor:'#16DB65', borderRadius:5,}}>
        <Text style={{ color:'white' }}> {text} </Text>
      </View>  
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  row:{
    flexDirection:'row', 
    justifyContent:'space-between',
    padding:10 
  },
  input:{
    width:'48%'
  },
  button:{
    padding:10,
    position:'absolute',
    bottom:10,
    width:'100%'
  }
})

