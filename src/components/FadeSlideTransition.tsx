// src/components/FadeSlideTransition.tsx
import React, { useEffect } from 'react';
import { Animated, Easing, ViewStyle } from 'react-native';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

const FadeSlideTransition = ({ children, style }: Props) => {
  const opacity = new Animated.Value(0);
  const translateY = new Animated.Value(40); // Daha dramatik bir başlangıç

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.exp), // 🎬 Sinematik easing
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 2000,
        easing: Easing.out(Easing.exp), // 🎬 Aynı easing
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          opacity,
          transform: [{ translateY }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default FadeSlideTransition;
