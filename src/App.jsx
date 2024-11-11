import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const CurrencyConverter = () => {
  const [data, setData] = useState(null);
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState('');
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch currency rates from the API
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        'https://v6.exchangerate-api.com/v6/6a255bb66d050f034c56110d/latest/USD'
      );
      setData(response.data.conversion_rates);
    } catch (err) {
      setError('Failed to fetch currency data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Convert the currency
  const convertCurrency = () => {
    if (!data || !amount || !fromCurrency || !toCurrency) {
      setResult('Please provide valid input');
      return;
    }
    const fromRate = data[fromCurrency];
    const toRate = data[toCurrency];
    if (fromRate && toRate) {
      const convertedAmount = ((amount / fromRate) * toRate).toFixed(2);
      setResult(`${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`);
    } else {
      setResult('Invalid currency selected');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Currency Converter</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FF4500" />
      ) : (
        data && (
          <>
            {/* From Currency Picker */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={fromCurrency}
                onValueChange={setFromCurrency}
                style={styles.picker}
              >
                <Picker.Item label="Select Base Currency" value="" />
                {Object.keys(data).map(currency => (
                  <Picker.Item key={currency} label={currency} value={currency} />
                ))}
              </Picker>
            </View>

            {/* Amount Input */}
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount"
              placeholderTextColor="#B0B0B0"
            />

            {/* To Currency Picker */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={toCurrency}
                onValueChange={setToCurrency}
                style={styles.picker}
              >
                <Picker.Item label="Select Target Currency" value="" />
                {Object.keys(data).map(currency => (
                  <Picker.Item key={currency} label={currency} value={currency} />
                ))}
              </Picker>
            </View>

            {/* Convert Button */}
            <Pressable style={styles.button} onPress={convertCurrency}>
              <Text style={styles.buttonText}>Convert</Text>
            </Pressable>

            {/* Result Display */}
            {result && <Text style={styles.result}>{result}</Text>}
          </>
        )
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  header: {
    color: '#FF4500',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: 'white',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    height: 60,
    color: 'white',
  },
  button: {
    backgroundColor: '#A9A9A9',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  result: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default CurrencyConverter;
