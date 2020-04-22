import React, { useEffect, useState } from 'react';
import { View, Image, FlatList, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'
import logoImg from '../../assets/logo.png';
import styles from './styles';
import api from '../../services/api';

export default function Incidents(){
  const [incidents, setIncidents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const { navigate } = useNavigation();
  const navigationToDetail = (incident) => {
    navigate('Detail',{ incident });
  }

  const loadIncidents = async()=>{
    if(loading){
      return
    }
    if(total > 0 && incidents.length === total){
      return;
    }
    setLoading(true)
    try{
      const  { data, headers} = await api.get(`incidents`, {
        params: { page }
      });
      setIncidents([...incidents,...data]);
      setTotal(headers['x-total-count']);
      setPage(page+1);
    }catch(e){
      console.log(e);
    }
    setLoading(false);
  }
  useEffect(()=>{
   loadIncidents();
  },[])
  const renderItem = ({ item }) =>(
      <View style={styles.incident}>
         <Text style={styles.incidentProperty}>ONG:</Text>
         <Text style={styles.incidentValue}>{item.name}</Text>

         <Text style={styles.incidentProperty}>CASO:</Text>
         <Text style={styles.incidentValue}>{item.title}</Text>

         <Text style={styles.incidentProperty}>VALOR:</Text>
         <Text style={styles.incidentValue}>
           {Intl.NumberFormat('pt-BR',{
             style:'currency', 
             currency: 'BRL'
            }).format(item.value)}
          </Text>

         <TouchableOpacity style={styles.detailsButton} onPress={()=>navigationToDetail(item)}>
           <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
           <Feather name='arrow-right' size={16} color="#E02041" />         
         </TouchableOpacity>
      </View>
  )
  return(
    <View style={styles.container} >
      <View style={styles.header}>
        <Image source={logoImg} />
        <Text style={styles.headerText}> 
          Total de <Text style={styles.headerTextBold}> {total} casos.</Text>
        </Text>
      </View>
     <Text style={styles.title}>Bem-vindo!</Text>
     <Text style={styles.description}>Escolha um dos casos abaixo e salve</Text>  
     <FlatList
       style={styles.incidentList}
       onEndReached={loadIncidents}
       onEndReachedThreshold={0.2}
       keyExtractor={incident=> String(incident.id)}
       showsHorizontalScrollIndicator={false}
       data={incidents}
       renderItem={renderItem}
     />
    </View>
  )
}