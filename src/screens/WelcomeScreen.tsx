import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App'; // Import from App.tsx

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

type Props = {
  navigation: WelcomeScreenNavigationProp;
};

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS !== 'web' && (
        <StatusBar backgroundColor="#FF6B35" barStyle="light-content" />
      )}
      <View style={styles.content}>
        <Text style={styles.title}>🍰 Sweet Treats</Text>
        <Text style={styles.subtitle}>Order delicious desserts for your table</Text>
        
        <TouchableOpacity
          style={styles.customerButton}
          onPress={() => {
            const customerName = 'Table Guest';
            const tableNumber = '1';
            navigation.navigate('Menu', { customerName, tableNumber });
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.customerButtonText}>👤 Order for Table</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.chefButton, styles.button]}
          onPress={() => navigation.navigate('Chef')}
          activeOpacity={0.8}
        >
          <Text style={styles.chefButtonText}>👨‍🍳 Chef Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 48,
    textAlign: 'center',
  },
  customerButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  customerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chefButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 32,
    width: '100%',
    alignItems: 'center',
  },
  chefButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default WelcomeScreen;