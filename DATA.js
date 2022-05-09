import React from 'react';

const reducer = (state, action) => {

    let array = [];
    let index = state.length + 1;    

    switch(action.type){

      case "ADD_CARD":  

        state.forEach( el => {
          array.push({...el})
        })

        array.push({id: index , ...action.newCard})
        return array;

      case 'PAYMENT': return state.map((item) => {
          if(item.id == action.id){
            return {
              ...item,
              isPaid: !item.isPaid
            }            
          }
          else {
              return {
                ...item
              }
          }
      });
    
      default: return state;
    }
}

export const DataReducer = () => {
  const [cards, dispatch] = React.useReducer(reducer, []);
  return {cards, dispatch}
}

export const DataContext = React.createContext();

