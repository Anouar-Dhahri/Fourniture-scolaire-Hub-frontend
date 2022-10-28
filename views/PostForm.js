import { View } from 'react-native';
import React, { useState } from 'react';
import { TextInput, Button, Text } from 'react-native-paper'
import { useRoute } from '@react-navigation/native';
import { useToast } from "react-native-toast-notifications";
import axios from 'axios'
import {API} from '../configs';

const PostForm = ({ navigation }) => {

  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const route = useRoute();

  const action = route.params.action;
  
  const handleSubmit = async () => {
    try {
      setLoading(true)
      if(!titre) {
        toast.show("Ecrire Votre Titre !", {
          type: "warning",
          placement:"bottom",
          duration: 4000,
          offset: 30,
          animationType: "zoom-in",
        })
        setLoading(false)
      }else if(!description) {
        toast.show("Ecrire Votre Description !", {
          type: "warning",
          placement:"bottom",
          duration: 4000,
          offset: 30,
          animationType: "zoom-in",
        })
        setLoading(false)
      }else {
        try {
          if(action == "create") {
            await axios.post(`${API}/posts/create`,{
              titre: titre,
              description: description,
              userId: route.params.user._id
            })
            .then((response) => {
              if(response.data.success) {
                toast.show(response.data.message, {
                  type: "normal",
                  placement:"bottom",
                  duration: 4000,
                  offset: 30,
                  animationType: "zoom-in"
                })
                setLoading(false);
                setTitre("");
                setDescription("");
                navigation.navigate("Publications");
              }else {
                toast.show(response.data.message, {
                  type: "warning",
                  placement:"bottom",
                  duration: 4000,
                  offset: 30,
                  animationType: "zoom-in"
                });
                setLoading(false);
              }
            })
          }else{
            await axios.put(`${API}/posts/update/${route.params.id}`,{
              titre: titre,
              description: description
            })
            .then((response) => {
              if(response.data.success) {
                toast.show(response.data.message, {
                  type: "normal",
                  placement:"bottom",
                  duration: 4000,
                  offset: 30,
                  animationType: "zoom-in"
                })
                setLoading(false);
                setTitre("");
                setDescription("");
                navigation.navigate("Info", {user: route.params.user});
              }else {
                toast.show(response.data.message, {
                  type: "warning",
                  placement:"bottom",
                  duration: 4000,
                  offset: 30,
                  animationType: "zoom-in"
                });
                setLoading(false);
              }
            })
          }

        } catch (error) {
          toast.show(error, {
            type: "warning",
            placement:"bottom",
            duration: 4000,
            offset: 30,
            animationType: "zoom-in"
          })
          setLoading(false);
        }
      }
    } catch (err) {
      toast.show(err, {
        type: "warning",
        placement:"bottom",
        duration: 4000,
        offset: 30,
        animationType: "zoom-in"
      })
      setLoading(false);
    }
  }


  const handleCancel = () => {
    setTitre("")
    setDescription("")
  }

  return (
    <View style={{ flex: 1, marginHorizontal:20, justifyContent: 'center' }}>
      <Text style={{
        fontSize:30,
        textAlign:'center'
      }}>
        {action == "create" ? "Ajouter un Publication" : "Modifer un Publication"}
      </Text>

      <TextInput
        style={{
          marginVertical: 10,
        }}
        activeUnderlineColor="#27AE60"
        mode="flat"
        label="Titre"
        value={titre}
        onChangeText={text => setTitre(text)}
      />

      <TextInput
        style={{
          marginVertical: 10,
        }}
        activeUnderlineColor="#27AE60"
        mode="flat"
        label="Description"
        value={description}
        multiline={true}
        numberOfLines={6}
        onChangeText={text => setDescription(text)}
      />
      <Button 
        mode="contained" 
        compact={false} 
        color="#27AE60"
        loading={loading}
        onPress={handleSubmit}
        style={{
          height: 50,
          marginBottom: 20,
          justifyContent: "center",
          borderRadius: 24,
        }}>
        Submit
      </Button>

      <Button 
        mode="outlined" 
        compact={false} 
        color="#27AE60"
        onPress={handleCancel}
        style={{
          height: 50,
          marginBottom: 20,
          justifyContent: "center",
          borderRadius: 24,
        }}>
        Annuler
      </Button>

    </View>
  )
}

export default PostForm