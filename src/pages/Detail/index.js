import React from 'react';
import {Feather} from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as MailComposer from 'expo-mail-composer'
import { View, TouchableOpacity, Image, Text, Linking } from 'react-native';
import styles from './styles';
import logoImg from '../../assets/logo.png';

export default function Detail(){
  const route = useRoute();
  const { params: { incident } } = route
  const navigation = useNavigation();
  const  message= `Olá ${incident.name}, estou entrando em contato, pois gostaria de ajudar no caso "${incident.title}" com o valor de ${Intl.NumberFormat('pt-BR',{
    style:'currency', 
    currency: 'BRL'
   }).format(incident.value)}`
  const sendEmail =()=>{
    MailComposer.composeAsync({
      subject: `Herói do caso: ${incident.title}`,
      recipients: [incident.email],
      body: message,
    })
  }

  const sendWhatsapp = ()=>{
   Linking.openURL(`whatsapp://send?phone=${incident.whatsapp}&text=${message}`)
  }
  const  navigationBack = ()=>{
    navigation.goBack();
  }

  return(
    <View style={styles.container} >
      <View style={styles.header}>
        <Image source={logoImg} />
        <TouchableOpacity onPress={navigationBack}>
          <Feather name="arrow-left" size={28} color="#E82041" /> 
        </TouchableOpacity>
      </View>
      <View style={styles.incident}>
         <Text style={[ styles.incidentProperty, { marginTop: 0 } ]}>ONG:</Text>
         <Text style={styles.incidentValue}>{incident.name} de {incident.city}/{incident.uf}</Text>

         <Text style={styles.incidentProperty}>CASO:</Text>
         <Text style={styles.incidentValue}>{incident.title}</Text>

         <Text style={styles.incidentProperty}>VALOR:</Text>
         <Text style={styles.incidentValue}>
           {Intl.NumberFormat('pt-BR',{
             style:'currency', 
             currency: 'BRL'
            }).format(incident.value)}
          </Text>
      </View>

      <View style={styles.contactBox}>
        <Text style={styles.heroTitle}>Salve o dia!</Text>
        <Text style={styles.heroTitle}>Seja um herói desse caso.</Text>
        <Text style={styles.heroDescription}>Entre em contato:</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.action} onPress={sendWhatsapp}>
            <Text style={styles.actionText}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.action} onPress={sendEmail}>
            <Text style={styles.actionText}>E-mail</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}