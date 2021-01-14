import { StatusBar } from 'expo-status-bar';
import React, {
  useEffect,
  useLayoutEffect,
  useState,
  Component,
  useRef,
  createRef,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Keyboard,
  TextInput,
} from 'react-native';
import YoutubeFeed from './YoutubeFeed';

const LazyStateExample = () => {
  const getInitialValue = () => {
    console.log('get initial value was called lazy way');
    return 0;
  };

  const [normalValue, setNormalValue] = useState(getInitialValue()); //not lazy way: getInitialValue called on every render
  const [lazyValue, setLazyValue] = useState(() => getInitialValue()); //lazy way: getInitialValue only called on initial render

  return (
    <View style={styles.container}>
      <Button
        title="Press me"
        onPress={() => setLazyValue((prev) => prev + 1)}
      />
      <Text>Value is: {lazyValue}</Text>
    </View>
  );
};

const UseEffectExample = () => {
  const [counter, setCounter] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState('white');
  const [displayChild, setDisplayChild] = useState(true);

  useEffect(() => {
    console.log('use effect was called');

    return () => console.log('~~ general cleanup ~~');
  });

  // const anotherFunc = () => console.log('another function call');

  // useEffect(anotherFunc);

  // useEffect(() => {
  //   console.log('counter was changed to: ', counter);
  //   if (counter === 1) {
  //     setBackgroundColor('yellow');
  //   }

  //   /* !! don't do something like this - causes infinite loops */
  //   // setCounter((prev) => prev + 1);

  //   return () => console.log('** doing some cleanup **');
  // }, [counter]);

  // useEffect(() => {
  //   console.log('background color was changed to: ', backgroundColor);
  // }, [backgroundColor]);

  // useEffect(() => {
  //   console.log('equivalent to componentDidMount');
  // }, []);

  return (
    <View style={{ ...styles.container, backgroundColor: backgroundColor }}>
      <Button
        title="Increment counter"
        onPress={() => setCounter((prev) => prev + 1)}
      />
      <Button
        title="Press me to do nothing"
        onPress={() => console.log('random log')}
      />
      <Button
        title="Change background"
        onPress={() => setBackgroundColor('orange')}
      />
      <Text>Value is: {counter}</Text>
      {displayChild && <Child counter={counter} />}
      <Button
        title="Toggle child"
        onPress={() => setDisplayChild((prev) => !prev)}
      />
    </View>
  );
};

const Child = ({ counter }) => {
  // useEffect(() => {
  //   console.log("** child's useEffect");
  // });

  // useEffect(() => {
  //   console.log('** child finds out counter changed');
  // }, [counter]);

  // useEffect(() => {
  //   console.log('-- child use effect called --');
  //   Keyboard.addListener()
  //   return () => console.log('-- child will leave us now --');
  // }, []);

  return <Text>Child thinks the counter is {counter}</Text>;
};

function subscribeForNotifications(eventId) {
  console.log('! ! ! subscribed to event with id: ', eventId);
}

function unsubscribeForNotifications(eventId) {
  console.log(eventId, ' is no longer subscribed ! ! !');
}

class SubscribeClassExample extends Component {
  state = {
    subscribedEventId: 1,
  };

  componentDidMount() {
    console.log('** componentDidMount');
    subscribeForNotifications(this.state.subscribedEventId);
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('shouldComponentUpdate');
    return this.state.subscribedEventId !== nextState.subscribedEventId;
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('** componentDidUpdate');
    if (prevState.subscribedEventId !== this.state.subscribedEventId) {
      unsubscribeForNotifications(prevState.subscribedEventId);
      subscribeForNotifications(this.state.subscribedEventId);
    }
  }

  componentWillUnmount() {
    console.log('** componentWillUnmount');
    unsubscribeForNotifications(this.state.subscribedEventId);
  }

  render() {
    console.log('** render was called');
    return (
      <View style={{ ...styles.container, flex: 0.5 }}>
        <Button
          title="Event 1"
          onPress={() => this.setState({ subscribedEventId: 1 })}
        />
        <Button
          title="Event 2"
          onPress={() => this.setState({ subscribedEventId: 2 })}
        />
        {this.state.subscribedEventId && (
          <Text>Events of {this.state.subscribedEventId}</Text>
        )}
      </View>
    );
  }
}

const SubscribeExample = () => {
  const [subscribedEventId, setSubscribedEventId] = useState(1);

  useEffect(() => {
    console.log('** use effect called **');
    subscribeForNotifications(subscribedEventId);

    return () => unsubscribeForNotifications(subscribedEventId);
  }, [subscribedEventId]);

  return (
    <View style={{ ...styles.container, flex: 0.5 }}>
      <Button title="Event 1" onPress={() => setSubscribedEventId(1)} />
      <Button title="Event 2" onPress={() => setSubscribedEventId(2)} />
      {subscribedEventId && <Text>Events of {subscribedEventId}</Text>}
      <ChildSubscribeExample subscribedEventId={subscribedEventId} />
    </View>
  );
};

const ChildSubscribeExample = ({ subscribedEventId }) => {
  useEffect(() => {
    console.log('subscribe id from child: ', subscribedEventId);
  });
  return <Text>{subscribedEventId}</Text>;
};

const useCounter = (initialAmount = 0) => {
  const [amount, setAmount] = useState(initialAmount);

  const increment = () => setAmount((amount) => amount + 1);
  const decrement = () => setAmount((amount) => Math.max(amount - 1, 0));

  useEffect(() => {
    console.log('let the database know this new amount: ', amount);
  }, [amount]);

  return [amount, increment, decrement];
};

const ShoppingCart = () => {
  // const [amount, setAmount] = useState(1);

  // const increment = () => setAmount((amount) => amount + 1);
  // const decrement = () => setAmount((amount) => amount - 1);
  const [amount, increment, decrement] = useCounter(10);

  return (
    <View style={{ ...styles.container, flex: 0.5 }}>
      <Text style={styles.header}>Shopping cart</Text>
      <Text>Nike shoes Amount: {amount}</Text>
      <Button title="-" onPress={decrement} />
      <Button title="+" onPress={increment} />
    </View>
  );
};

const ItemPage = () => {
  // const [amount, setAmount] = useState(0);

  // const increment = () => setAmount((amount) => amount + 1);
  // const decrement = () => setAmount((amount) => Math.max(amount - 1, 0));
  const [amount, increment, decrement] = useCounter();

  return (
    <View
      style={{
        ...styles.container,
        flex: 0.5,
        backgroundColor: 'orange',
        width: '100%',
      }}
    >
      <Text style={styles.header}>Nike shoes</Text>
      <Text>Buy now!</Text>

      <Button title="-" onPress={decrement} />
      <Text>{amount}</Text>
      <Button title="+" onPress={increment} />
    </View>
  );
};

const CustomHookExample = () => {
  return (
    <View style={styles.container}>
      <ItemPage />
      <ShoppingCart />
    </View>
  );
};

const RefExample = () => {
  const textInputRef = useRef(null);

  const toggleFocus = () => {
    if (textInputRef.current.isFocused()) {
      textInputRef.current.blur();
    } else {
      textInputRef.current.focus();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Enter text" ref={textInputRef} />
      <Button
        title="Clear text"
        onPress={() => {
          console.log('clear text');
          textInputRef.current.clear();
        }}
      />
      <Button title="Toggle" onPress={toggleFocus} />
    </View>
  );
};

class RefClassExample extends Component {
  constructor(props) {
    super(props);

    this.textInputRef = createRef();
  }

  toggleFocus = () => {
    if (this.textInputRef.current.isFocused()) {
      this.textInputRef.current.blur();
    } else {
      this.textInputRef.current.focus();
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput placeholder="Enter text" ref={this.textInputRef} />
        <Button
          title="Clear text"
          onPress={() => {
            console.log('clear text');
            this.textInputRef.current.clear();
          }}
        />
        <Button title="Toggle" onPress={this.toggleFocus} />
      </View>
    );
  }
}

export default function App() {
  // return <LazyStateExample />;
  // return <UseEffectExample />;
  // return <YoutubeFeed />;
  // return <SubscribeExample />;
  // return <SubscribeClassExample />;
  // return <CustomHookExample />;
  // return <RefExample />;
  return <RefClassExample />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
