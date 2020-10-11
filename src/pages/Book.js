import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  AsyncStorage,
  Modal
} from 'react-native';
import Constants from "expo-constants";

import Icon from 'react-native-vector-icons/MaterialIcons';

import Photo from "../components/Photo";
import Camera from "../components/Camera";

const Book = ({ navigation }) => {
  const book = navigation.getParam("book", {
    title: '',
    description: '',
    read: false,
    photo: ''
  });
  
  const isEdit = navigation.getParam("isEdit", false);

  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState(book.title);
  const [description, setDescription] = useState(book.description);
  const [read, setRead] = useState(book.read);
  const [photo, setPhoto] = useState(book.photo);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("books").then(data => {
      if(data) {
        const book = JSON.parse(data);
        setBooks(book);
      }
    })
  }, []);

  const isValid = () => {
    if (title !== undefined && title !== '') {
      return true;
    } else{
      return false;
    }

    
    
  };

  const onSave = async () => {
    if (isValid()) {
    
      if (isEdit) {
        // altera o livro corrente
        let newBooks = books;

        newBooks.map(item => {
          if(item.id === book.id) {
            item.title = title;
            item.description = description;
            item.read = read;
            item.photo = photo;
          }
          return item;
        });

        await AsyncStorage.setItem('books', JSON.stringify(newBooks));
      } else {
        // adiciona um novo livro
        const id = Math.random(5000).toString();
        const data = {
          id,
          title,
          description,
          photo,
        };

        books.push(data);
        await AsyncStorage.setItem('books', JSON.stringify(books));
      }
      //return true;
      navigation.goBack();
    } else {
      //return false
      console.log('Inválido!');
    }
  };

  const onCloseModal = () => setIsModalVisible(false);

  const onChangePhoto = (newPhoto) => setPhoto(newPhoto);

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Inclua seu novo Produto...</Text>
      <TextInput
        style={styles.input}
        placeholder="Produto"
        value={title}
        onChangeText={text => {
          setTitle(text);
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Descriçao(Marca,quantidade)"
        multiline={true}
        numberOfLines={4}
        value={description}
        onChangeText={text => {
          setDescription(text);
        }}
      />

      <TouchableOpacity 
        style={styles.cameraButton}
        onPress={() => {
          setIsModalVisible(true)
        }}
      >
        {isEdit ? <Icon name="photo" size={18} color="#fff" /> : <Icon name="photo-camera" size={18} color="#fff" /> }
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.saveButton,/*(!isValid()) ? styles.saveButtonInvalid : ''*/]}
        onPress={onSave}>
        <Text style={styles.saveButtonText}>{isEdit ? "Atualizar" : "Cadastrar"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => {
          navigation.goBack();
        }}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        visible={isModalVisible}
      >
        {
          photo ? (
            <Photo 
              photo={photo} 
              onDeletePhoto={onChangePhoto}
              onClosePicture={onCloseModal}
            />
          ) : (
            <Camera onCloseCamera={onCloseModal} onTakePicture={onChangePhoto} />
          )
        }
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: Constants.statusBarHeight,
    justifyContent: "center"
  },
  pageTitle: {
    textAlign: 'center',
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 40,
    marginTop: 20,
  },
  input: {
    fontSize: 16,
    borderBottomColor: '#f39c12',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  cameraButton: {
    backgroundColor: '#f39c12',
    borderRadius: 50,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#f39c12',
    alignSelf: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    alignSelf: 'center',
  },
  cancelButtonText: {
    color: '#95a5a6',
  },
});

export default Book;