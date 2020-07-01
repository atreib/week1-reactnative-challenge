import React, { useState, useEffect } from "react";
import api from './services/api';

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  const getRepositories = async () => {
    try {
        return await api.get('repositories');
    } catch (err) {
        console.log("erro ao buscar repositorios: ", err);
        throw new Error(err);
    }
  };

  const updateRepos = async () => {
    const { data: repos }  = await getRepositories();
    setRepositories(repos);  
  };

  useEffect(async () => {
    await updateRepos();
  }, []);

  async function handleLikeRepository(id) {
    await api.post(`repositories/${id}/like`);
    setRepositories(repositories.map(repo => {
      if (repo.id === id)
        repo.likes++;
      return repo;
    }))
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        
          <FlatList
            data={repositories}
            keyExtractor={repo => repo.id}
            renderItem={({ item: repo }) => (
              <View style={styles.repositoryContainer}>
                <Text style={styles.repository}>{ repo.title }</Text>

                <View style={styles.techsContainer}>
                  {
                    repo.techs.map((tech) => (
                      <Text style={styles.tech} key={tech}>
                        { tech }
                      </Text>
                    ))
                  }
                </View>

                <View style={styles.likesContainer}>
                  
                  { repo.likes <= 1 &&
                    <Text
                      style={styles.likeText}
                      testID={`repository-likes-${repo.id}`}
                    >
                      { repo.likes } curtida
                    </Text>
                  }

                  { repo.likes >= 2 &&
                    <Text
                      style={styles.likeText}
                      testID={`repository-likes-${repo.id}`}
                    >
                      { repo.likes } curtidas
                    </Text>
                  }
                  
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLikeRepository(repo.id)}
                  testID={`like-button-${repo.id}`}
                >
                  <Text style={styles.buttonText}>Curtir</Text>
                </TouchableOpacity>
              </View>
            )}
          /> 
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
