import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

interface NumericInputProps {
  value: number;
  onChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
}

export function NumericInput({ 
  value, 
  onChange, 
  minValue = 1, 
  maxValue = 99 
}: NumericInputProps) {
  const handleDecrease = () => {
    if (value > minValue) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < maxValue) {
      onChange(value + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Button 
        size="sm"
        variant="outline"
        onPress={handleDecrease}
        disabled={value <= minValue}
      >
        <ButtonText>-</ButtonText>
      </Button>
      
      <View style={styles.valueContainer}>
        <Text>{value}</Text>
      </View>

      <Button 
        size="sm"
        variant="outline"
        onPress={handleIncrease}
        disabled={value >= maxValue}
      >
        <ButtonText>+</ButtonText>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  valueContainer: {
    minWidth: 40,
    alignItems: 'center',
  }
}); 