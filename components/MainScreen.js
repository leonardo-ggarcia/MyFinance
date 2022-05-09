import React from 'react';
import {LinearGradient} from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import {FontAwesome} from '@expo/vector-icons';
import {DataContext} from '../DATA';

import {
  Text,
  View,  
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity, 
  SafeAreaView, 
  Modal,
  Pressable
} from 'react-native';

import {
  IconButton,
  TextInput
} from 'react-native-paper'


const MainContext = React.createContext();

export default function MainScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>    
      <MainContext.Provider value={ navigation } >
        <Header  navig={navigation} />
        <Content navig={navigation} /> 
      </MainContext.Provider>
    </SafeAreaView>
  )
}

const Label = ({text, iconName, hasIcon = false, press}) => {

  const [balance, setBalance] = React.useState(); 
  const {cards, dispatch} = React.useContext(DataContext);
  const onChange = text => setBalance(text);


  return (
      <View>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <Text style={styles.label}>{text} </Text>
        </View>  
        <View>      
      </View>         
      </View>
    )
}

const Header = ({navig}) => { 

  const {cards, dispatch} = React.useContext(DataContext);
  const itens = cards.filter(card => !card.isPaid)
  const total = itens.reduce((ac, cards) => parseFloat(cards.total) + ac , 0 )

  return(
    <View style={styles.header}>
      <View style={{alignItems:'flex-end'}}>
        <TouchableOpacity  onPress={() => navig.navigate('SettingCards')}>
          <FontAwesome name={'gear'} color={'#000'} size={24} />
        </TouchableOpacity>
      </View>
      <Label text='Total de Débito ' iconName='edit' hasIcon={true} />
      <Balance balance={total} />
    </View>
  )
}

const Balance = ({balance}) => {
  const [hideBalance, setHideBalance] = React.useState(false); 
  const {cards, dispatch} = React.useContext(DataContext);

  return (
    <View>
      <View style={styles.balance}>
        {
          !hideBalance ? <Text style={styles.balanceText}>R$ {balance}</Text> : <Text style={styles.balanceText}>*******</Text>
        }
        {
          hideBalance ? <IconButton
          icon='eye-outline'
          color='#16DB65'
          onPress={() => setHideBalance(!hideBalance)}
          /> :
          <IconButton
          icon='eye-off-outline'
          color='#16DB65'
          onPress={() => setHideBalance(!hideBalance)}  
          />
        }      
      </View>       
    </View>
  )
}

const Content = () => {
  return(
    <View style={styles.content}>
      <Cards/>
      <View style={{margin:10}}>
         <Label text='Pagar Fatura' hasIcon={false}/>
         <PaymentCards/>   
         <Label text='Análise' hasIcon={false}/>
         <Analytics/>           
      </View>
     
    </View>
  )
}

const PaymentCards = () => {

  const {cards, dispatch} = React.useContext(DataContext);
  
  const pay = (key) => dispatch({ type:'PAYMENT', id: key })
  
  return (
    <View
      style={styles.cards}
    >      
        <FlatList
          data={cards}
          keyExtractor={item => item.id}
          renderItem={({item, dispatch}) => PaymentDetails(item, () => pay(item.id) )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
        />     
        {
          cards.length == 0 &&
           <FlatList
              data={[{
                id:0,
                final:1010,
                name: 'SEU NOME',
                card:'GREEN',
                cc_mastercard:false,
                cc_visa:true,
                total:0.00,
                isPaid:true,
                expireIn: new Date().toLocaleDateString()
              }]}
              keyExtractor={item => item.id}
              renderItem={({item, dispatch}) => PaymentDetails(item, () => pay(item.id) )}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              />              
        }  
      
   </View>
  )
}

const PaymentDetails = (item, dispatch) => {
 
  return (
    <View style={{
      padding:10, 
      backgroundColor:'#f2fcf0', 
      marginTop:5, 
      marginBottom:5,
      height:160, 
      borderRadius:10,
      opacity: item.isPaid ? 0.5 : 1,
      width:Dimensions.get('window').width - 20
      }}>
          <View style={{
            flexDirection:'row',
            borderBottomColor:'blue', 
            borderBottomWidth:0.4,            
            alignItems:'center',
            paddingBottom:10,
            justifyContent:'space-between'
          }}>
            <View style={{
               flexDirection:'row',
              alignItems:'center',
            }}>
              <FontAwesome name={'calendar'} color={'blue'} size={12} />
              <Text style={{fontSize:13, fontWeight:'600', color:'blue'}}> {item.expireIn} </Text>
            </View>
       
              { item.isPaid && 
                <TouchableOpacity  onPress={dispatch}>
                  <FontAwesome name={'rotate-left'} color={'#16DB65'} size={14} />
                </TouchableOpacity>
             }
          </View>
          <View style={{marginTop:10}}>
            <Text style={{fontSize:13, fontWeight:'600', color:'#000'}}> Tipo: Credito </Text>
          </View>
          <View style={{marginTop:10, flexDirection:'row', alignItems:'center'}}>
            <Text style={{fontSize:13, fontWeight:'700', color:'#000'}}> Total da Fatura: R$ </Text> 
            <Text style={{fontSize:13, fontWeight:'800', color:'blue'}}> {item.total} </Text>
          </View>
          <Button press={dispatch} isDisabled={item.isPaid}/>
    </View>
  )
}

const Analytics = () => {
  const {cards, dispatch} = React.useContext(DataContext);
  const [paidAmount, setPaidAmount] = React.useState(0); 
  const [invoices, setInvoices] = React.useState(0);  

  const paidItensFilter = cards.filter(card => card.isPaid)
  const paidTotal = paidItensFilter.reduce((ac, card) => parseFloat(card.total) + ac , 0 )
  const allItens = cards.reduce((ac, card) => parseFloat(card.total) + ac , 0 )

  React.useEffect(() => {

    if(cards.length > 0){
      const paidsPerc = ((paidTotal / allItens) * 100).toFixed(2);  
      const paidInvoices = paidItensFilter.length;
      setPaidAmount(paidsPerc);  
      setInvoices(paidInvoices); 
    }
   
  }, [paidTotal] );
 

  return (
   <View style={{
      padding:10,  
      marginTop:5, 
      borderRadius:10, 
      flexDirection:'row',  
     }}>    
       <View style={styles.itemAnalytics}>
          <FontAwesome name={'minus-circle'} color={'#f2fcf0'} size={32} />
          <Text>Pago</Text>   
          <Text style={{fontWeight:'bold'}}>+ {paidAmount} %</Text>
       </View>
       <View style={styles.itemAnalytics}>
          <FontAwesome name={'money'} color={'#f2fcf0'} size={32} />
          <Text> Faturas pagas </Text>   
          <Text>{invoices}</Text>
       </View>        
   </View>
  )
}

export const Button = ({press, isDisabled}) => {
  
  return (
  <TouchableOpacity onPress={press} disabled={isDisabled} style={{
      height:40, 
      backgroundColor:'#2CFF73', 
      borderRadius:5, 
      justifyContent:'center', 
      alignItems:'center',
      marginTop:5
  }}>
     <FontAwesome name={'check-circle'} color={'#fff9'} size={32} />         
  </TouchableOpacity>
  )
}

const Cards = () => {
  
  const {cards, dispatch} = React.useContext(DataContext);
  
  return (
    <View>      
        <FlatList
          data={cards}
          keyExtractor={item => item.id}
          renderItem={ShowCards}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
        />
        {
          cards.length == 0 && 
          <ShowCards item={{
            final:1010,
            name: 'SEU NOME',
            card:'GREEN',
            cc_mastercard:false,
            cc_visa:true,
            total:100.00,
            isPaid:false,
            expireIn:'16/06/2022'
          }}/>
        }
       <Indicator num={cards.length ?? 0} />
   </View>
  )
}

const Indicator = ({num = 0}) => {  

  const repeat = [];

  for(let i = 0; i < num; i++ ){
    repeat.push(i)
  }

  return (
    <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
      {
        repeat.map((value, index) =>(
          <View style={{margin:2, height:5, width:5, backgroundColor:'#000', borderRadius:5}}></View>
        ))
      }
    </View>
  )

}

const ShowCards = ({item}) => {     
  return (
    <View>     
        <LinearGradient       
              colors={['#058C42', '#2CFF73', '#8BFC87']}
              style={{borderRadius:6, margin:10}}
        >
          <View style={styles.card}>
            <View style={{flexDirection:'row', padding:10}}>
              <Text style={{fontSize:15, fontWeight:'600', color:'#fff5'}}> {item.card}</Text>
            </View>
            <View style={{flexDirection:'row', padding:12, alignItems:'center', justifyContent:'space-between'}}>
              <View>
                <Text style={{fontSize:15, fontWeight:'600', color:'#004400'}}>XXXX XXXX XXXX {item.final}</Text>
                <Text style={{fontSize:13, fontWeight:'500', color:'#004400'}}>{item.name.toUpperCase()}</Text>
              </View>
              <View>
                  <FontAwesome name={item.cc_visa ? 'cc-visa' : 'cc-mastercard'} color={'#004400'} size={32}/>                  
              </View>
            </View>
          </View>    
        </LinearGradient>        
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor:'#2CFF73',    
  }, 
  header:{      
    padding:10,
    marginTop:40
  },
  content:{
    flex:1,
    backgroundColor:'#ffffff',    
  },
  balance:{    
    backgroundColor:'#0D2818',
    borderRadius:3,
    padding:10,   
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    height:45,
    marginTop:5
  },
  balanceText:{
    fontWeight:'600',
    color:'#fff',
    fontSize:15,   
  
  },
  label:{
    fontWeight:'500',   
    fontSize:13,
  },  
  card:{
    height:180,      
    borderRadius:6,
    justifyContent:'space-between',
    width:Dimensions.get('window').width - 20
  },   
  itemAnalytics:{
    backgroundColor:'#2CFF73',
    height:170, 
    flex:1,
    padding:5,
    margin:5,
    borderRadius:10,
    alignItems:'center',
    justifyContent:'center'
  },  
});
