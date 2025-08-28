import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface TabBarBackgroundProps {
  isDark?: boolean;
}

export default function TabBarBackground({ isDark = false }: TabBarBackgroundProps) {
  if (isDark) {
    return <BrushedMetalTabBarBackground />;
  }
  
  return <AluminiumMetalTabBarBackground />;
}

function BrushedMetalTabBarBackground() {
  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Base diagonal brushed metal gradient - increased contrast with darker base */}
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d', '#0f0f0f']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Specular highlight strip overlay - enhanced contrast for more defined reflections */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.25)']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Soft edge vignette - deeper shadows for enhanced contrast */}
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.45)', 'transparent', 'rgba(0, 0, 0, 0.45)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Top rim bevel effect - enhanced contrast */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.12)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.1 }}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Bottom rim bevel effect - deeper shadows */}
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.35)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0.9 }}
        end={{ x: 0, y: 1 }}
      />
    </View>
  );
}

function AluminiumMetalTabBarBackground() {
  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Enhanced base aluminium gradient - more pronounced metallic silver */}
      <LinearGradient
        colors={['#D8D8D8', '#F8F8F8', '#C0C0C0', '#E0E0E0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Stronger horizontal brushed metal effect - more defined lines */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.7)', 'rgba(180, 180, 180, 0.2)', 'rgba(255, 255, 255, 0.7)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Enhanced specular highlight - brighter and more defined reflection */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.9)']}
        start={{ x: 0.25, y: 0 }}
        end={{ x: 0.75, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Secondary diagonal highlight for more depth */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.6)', 'transparent', 'rgba(255, 255, 255, 0.4)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Enhanced shadow overlay for more dramatic depth */}
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.1)', 'transparent', 'rgba(0, 0, 0, 0.15)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Stronger top edge highlight */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.8)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.2 }}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Enhanced bottom edge shadow */}
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.25)']}
        start={{ x: 0, y: 0.8 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Additional metallic sheen overlay */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.3)', 'transparent', 'rgba(255, 255, 255, 0.2)']}
        start={{ x: 0.4, y: 0 }}
        end={{ x: 0.6, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

export function useBottomTabOverflow() {
  return 0;
}
