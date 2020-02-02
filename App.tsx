import React, { useEffect, useReducer } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import API, { graphqlOperation } from '@aws-amplify/api';
import PubSub from '@aws-amplify/pubsub';

import { createTodo } from './src/graphql/mutations';
import { listTodos } from './src/graphql/queries.ts';
import config from './aws-exports';

API.configure(config);
PubSub.configure(config);

const initialState = { todos: [] };
const reducer = (state, action) => {
  switch (action.type) {
    case 'QUERY':
      return {...state, todos: action.todos};
    case 'SUBSCRIPTOIN':
      return {...state, todos: [...state.todos, action.todo]};
    default:
      return state;
  }
};

async function createNewTodo() {
  const todo = {
    name: 'Use AppSync',
    description: 'Realtime and Offline',
  };

  await API.graphql(graphqlOperation(createTodo, { input: todo }));
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const todoData = await API.graphql(graphqlOperation(listTodos));
    dispatch({ type: 'QUERY', todos: todoData.data.listTodos.items });
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Button onPress={createNewTodo} title='Create Todo' />
      {
        state.todos.map((todo, idx) => {
          return <Text key={todo.id}>{todo.name}: {todo.description}</Text>;
        })
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
