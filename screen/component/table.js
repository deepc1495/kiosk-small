import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DeleteIcon } from '../assets/svgIcons';

const Table = ({ data, onDelete,isEnglish }) => {
const cartData = data?.cart_items??[]
const cartValue = data?.cart

const formatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}></Text>
        <Text style={styles.headerCell}>{isEnglish?'Amount':'المبلغ'}</Text>
        <Text style={styles.headerCell}>{ isEnglish? 'Qty':'العدد'}</Text>
        <Text style={[styles.headerCell,{flex:3,marginRight:10}]}>{isEnglish?'Name':' المشروع'}</Text>
      </View>
      {cartData.map((item, index) => (
        <View style={styles.row} key={index}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(item)}
          >
                  <DeleteIcon />
          </TouchableOpacity>
          <Text style={styles.cell}>{formatter.format(item.amount) + '.00'}</Text>
          <Text style={styles.cell}>{item.quantity_months}</Text>
          <Text style={[styles.cell,{flex:3,marginRight:10}]}>{item.item_name}</Text>
        </View>
      ))}
    </View>
  );
};

export default Table;

const styles = StyleSheet.create(
    {
        container: {
          flex: 1,
          padding: 10,
        },
        headerRow: {
          flexDirection: 'row',
          borderBottomWidth: 2,
          paddingBottom: 8,
          marginBottom: 5,
          borderColor:'gray',
        },
        headerCell: {
          flex: 1,
          fontWeight: '400',
          textAlign:'right',
        },
        row: {
          flexDirection: 'row',
          borderBottomWidth: 1,
          paddingVertical: 7,
          marginBottom: 5,
          borderColor:'lightgray'
        },
        cell: {
          flex: 1,
          textAlign:'right',
        },
        deleteButton: {
          flex:1,
          alignItems:'flex-end',
          right:0

        },
        deleteButtonText: {
          color: 'white',
          textAlign: 'center',
        },
}
)

