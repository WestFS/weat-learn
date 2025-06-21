import React, { useEffect, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, Image } from 'react-native';
import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import HTML, { RenderHTMLProps } from 'react-native-render-html';
import { useColorScheme } from './useColorScheme';
import Colors from '@/src/constants/Colors';

interface DevicePreviewProps {
  htmlContent: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  title: string;
  author: string;
  date: string;
  imageUrl?: string;
}

interface DeviceConfig {
  baseWidth: number;
  baseHeight: number;
  frameRounded: number;
  screenRounded: number;
  bezelPadding: number;
  notchConfig?: { width: number; height: number; top: number };
  statusBarHeight: number;
  homeIndicatorHeight: number;
  contentPaddingHorizontal: number;
}

const DEVICE_DIMENSIONS: Record<'mobile' | 'tablet' | 'desktop', DeviceConfig> = {
  mobile: {
    baseWidth: 390,
    baseHeight: 844,
    frameRounded: 50,
    screenRounded: 46,
    bezelPadding: 2,
    notchConfig: { width: 130, height: 30, top: 11 },
    statusBarHeight: 44,
    homeIndicatorHeight: 34,
    contentPaddingHorizontal: 16,
  },
  tablet: {
    baseWidth: 768,
    baseHeight: 1024,
    frameRounded: 32,
    screenRounded: 30,
    bezelPadding: 4,
    statusBarHeight: 44,
    homeIndicatorHeight: 0,
    contentPaddingHorizontal: 24,
  },
  desktop: {
    baseWidth: 1280,
    baseHeight: 1080,
    frameRounded: 12,
    screenRounded: 8,
    bezelPadding: 3,
    statusBarHeight: 32,
    homeIndicatorHeight: 0,
    contentPaddingHorizontal: 40,
  },
};

// Ícones SVG como componentes
const WifiIcon = ({ color = '#000', size = 14 }: { color?: string; size?: number }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: size - 2, color }}>📶</Text>
  </View>
);

const BatteryIcon = ({ color = '#000', size = 14 }: { color?: string; size?: number }) => (
  <View style={{
    width: size + 6,
    height: size - 2,
    borderWidth: 1,
    borderColor: color,
    borderRadius: 2,
    position: 'relative',
    backgroundColor: 'transparent'
  }}>
    <View style={{
      position: 'absolute',
      right: -3,
      top: '25%',
      width: 2,
      height: '50%',
      backgroundColor: color,
      borderRadius: 1
    }} />
    <View style={{
      width: '80%',
      height: '100%',
      backgroundColor: color,
      borderRadius: 1
    }} />
  </View>
);

const SignalIcon = ({ color = '#000', size = 14 }: { color?: string; size?: number }) => (
  <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 1 }}>
    {[1, 2, 3, 4].map((bar) => (
      <View
        key={bar}
        style={{
          width: 2,
          height: (size / 4) * bar,
          backgroundColor: color,
          borderRadius: 0.5
        }}
      />
    ))}
  </View>
);

// StatusBar melhorada com ícones
const StatusBar = ({ isDarkMode, deviceConfig, deviceType }: {
  isDarkMode: boolean;
  deviceConfig: DeviceConfig;
  deviceType: string;
}) => {
  const iconColor = isDarkMode ? '#fff' : '#000';

  return (
    <View style={[
      styles.statusBar,
      {
        height: deviceConfig.statusBarHeight,
        backgroundColor: isDarkMode ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.95)',
        borderBottomWidth: deviceType === 'desktop' ? 1 : 0,
        borderBottomColor: isDarkMode ? '#333' : '#e5e5e5',
      }
    ]}>
      <View style={styles.statusBarContent}>
        <Text style={[styles.statusBarTime, { color: iconColor }]}>
          {deviceType === 'desktop' ? 'Browser Preview' : '9:41'}
        </Text>
        {deviceType !== 'desktop' && (
          <View style={styles.statusBarRight}>
            <SignalIcon color={iconColor} size={12} />
            <WifiIcon color={iconColor} size={12} />
            <BatteryIcon color={iconColor} size={12} />
          </View>
        )}
      </View>
    </View>
  );
};

// ArticleHeader que aparece em todos os dispositivos
const ArticleHeader = ({ title, author, date, imageUrl, isDarkMode, deviceType }: {
  title?: string;
  author?: string;
  date?: string;
  imageUrl?: string;
  isDarkMode: boolean;
  deviceType: string;
}) => {
  return (
    <View style={[
      styles.articleHeader,
      { marginBottom: deviceType === 'desktop' ? 24 : 16 }
    ]}>
      {imageUrl && (
        <View style={[
          styles.articleImageContainer,
          {
            marginBottom: deviceType === 'desktop' ? 16 : 12,
            borderRadius: deviceType === 'desktop' ? 8 : 6
          }
        ]}>
          <Image
            source={{ uri: imageUrl }}
            style={[
              styles.articleImage,
              { height: deviceType === 'desktop' ? 300 : 180 }
            ]}
            resizeMode="cover"
          />
        </View>
      )}
      <View style={styles.articleMeta}>
        <Text style={[
          styles.articleTitle,
          {
            color: isDarkMode ? '#fff' : '#1A1A1A',
            fontSize: deviceType === 'desktop' ? 28 : 20,
            lineHeight: deviceType === 'desktop' ? 36 : 26,
            marginLeft: deviceType === 'desktop' ? 30 : 15
          }
        ]}>
          {title || "Article Title"}
        </Text>
        <View style={[
          styles.articleInfo,
          deviceType === 'desktop' && { marginTop: 8 }
        ]}>
          <Text style={[
            styles.articleAuthor,
            {
              color: isDarkMode ? '#ccc' : '#666',
              fontSize: deviceType === 'desktop' ? 14 : 13,
              marginLeft: deviceType === 'desktop' ? 30 : 15
            }
          ]}>
            {author || "Author Name"}
          </Text>
          <Text style={[
            styles.articleDate,
            {
              color: isDarkMode ? '#999' : '#888',
              fontSize: deviceType === 'desktop' ? 12 : 11,
              marginRight: deviceType === 'desktop' ? 30 : 15
            }
          ]}>
            {date || "January 1, 2024"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default function DevicePreview({
  htmlContent,
  deviceType,
  title,
  author,
  date,
  imageUrl,
}: DevicePreviewProps) {
  const theme = useColorScheme() ?? 'light';
  const isDarkMode = theme === 'dark';
  const { width: windowWidth } = Dimensions.get('window');

  const deviceConfig = DEVICE_DIMENSIONS[deviceType];

  // Cálculo de dimensões otimizado
  const { deviceFrameWidth, deviceFrameHeight, contentHtmlWidth } = useMemo(() => {
    let frameWidth: number, frameHeight: number, htmlWidth: number;

    if (deviceType === 'desktop') {
      const maxWidth = Math.min(windowWidth * 0.8, 900);
      frameWidth = Math.max(maxWidth, 400);
      frameHeight = (frameWidth / deviceConfig.baseWidth) * deviceConfig.baseHeight;
      htmlWidth = frameWidth - (deviceConfig.bezelPadding * 2) - (deviceConfig.contentPaddingHorizontal * 2);
    } else {
      const scale = deviceType === 'tablet' ? 0.7 : 0.8;
      frameWidth = deviceConfig.baseWidth * scale;
      frameHeight = deviceConfig.baseHeight * scale;
      htmlWidth = frameWidth - (deviceConfig.bezelPadding * 2) - (deviceConfig.contentPaddingHorizontal * 2);
    }

    return {
      deviceFrameWidth: frameWidth,
      deviceFrameHeight: frameHeight,
      contentHtmlWidth: Math.max(htmlWidth, 200)
    };
  }, [deviceType, deviceConfig, windowWidth]);

  // Animação simplificada
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    opacity.value = withSpring(1, { damping: 15, stiffness: 150 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  // Estilos HTML otimizados
  const htmlTagsStyles: RenderHTMLProps["tagsStyles"] = useMemo(() => ({
    body: {
      fontFamily: 'System',
      fontSize: deviceType === 'desktop' ? 16 : 15,
      lineHeight: deviceType === 'desktop' ? 26 : 22,
      color: isDarkMode ? '#fff' : '#333',
      backgroundColor: 'transparent',
      paddingHorizontal: deviceConfig.contentPaddingHorizontal,
      margin: 0,
    },
    p: {
      fontSize: deviceType === 'desktop' ? 16 : 15,
      lineHeight: deviceType === 'desktop' ? 26 : 22,
      marginBottom: 16,
      color: isDarkMode ? '#fff' : '#333',
    },
    h1: {
      fontSize: deviceType === 'desktop' ? 32 : 24,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 12,
      color: isDarkMode ? '#fff' : '#1A1A1A',
    },
    h2: {
      fontSize: deviceType === 'desktop' ? 26 : 20,
      fontWeight: 'bold',
      marginTop: 16,
      marginBottom: 10,
      color: isDarkMode ? '#fff' : '#1A1A1A',
    },
    h3: {
      fontSize: deviceType === 'desktop' ? 20 : 18,
      fontWeight: 'bold',
      marginTop: 12,
      marginBottom: 8,
      color: isDarkMode ? '#fff' : '#1A1A1A',
    },
    img: {
      maxWidth: '100%',
      height: 'auto',
      marginVertical: 12,
      borderRadius: 6,
    },
    a: {
      color: Colors[theme].tint,
      textDecorationLine: 'underline',
    },
    blockquote: {
      borderLeftWidth: 3,
      borderLeftColor: Colors[theme].tint,
      paddingLeft: 12,
      marginVertical: 12,
      fontStyle: 'italic',
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      paddingVertical: 8,
    },
  }), [isDarkMode, theme, deviceType, deviceConfig.contentPaddingHorizontal]);

  const renderContent = () => {
    if (!htmlContent?.trim()) {
      return (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }]}>
            Start writing to see the preview...
          </Text>
        </View>
      );
    }

    return (
      <HTML
        source={{ html: htmlContent }}
        contentWidth={contentHtmlWidth}
        tagsStyles={htmlTagsStyles}
        enableExperimentalMarginCollapsing={true}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.deviceContainer, animatedStyle]}>
        <View style={[
          styles.deviceFrame,
          {
            width: deviceFrameWidth,
            height: deviceFrameHeight,
            borderRadius: deviceConfig.frameRounded,
            backgroundColor: isDarkMode ? '#1c1c1e' : '#f2f2f7',
            borderWidth: deviceType === 'desktop' ? 1 : 4,
            borderColor: isDarkMode ? '#333' : '#ddd',
          }
        ]}>
          {/* Notch apenas para mobile - corrigido */}
          {deviceType === 'mobile' && deviceConfig.notchConfig && (
            <View style={[
              styles.notch,
              {
                width: (deviceConfig.notchConfig.width * deviceFrameWidth) / deviceConfig.baseWidth,
                height: (deviceConfig.notchConfig.height * deviceFrameHeight) / deviceConfig.baseHeight,
                top: (deviceConfig.notchConfig.top * deviceFrameHeight) / deviceConfig.baseHeight,
                left: '50%',
                marginLeft: -((deviceConfig.notchConfig.width * deviceFrameWidth) / deviceConfig.baseWidth) / 2,
                backgroundColor: isDarkMode ? '#000' : '#1c1c1e',
              }
            ]}>
              <View style={[
                styles.notchSensor,
                { backgroundColor: isDarkMode ? '#666' : '#999' }
              ]} />
            </View>
          )}

          {/* Botões laterais apenas para mobile - ajustados */}
          {deviceType === 'mobile' && (
            <>
              <View style={[styles.sideButton, {
                top: (90 * deviceFrameHeight) / deviceConfig.baseHeight,
                height: (22 * deviceFrameHeight) / deviceConfig.baseHeight,
                left: -1,
                backgroundColor: isDarkMode ? '#666' : '#999'
              }]} />
              <View style={[styles.sideButton, {
                top: (130 * deviceFrameHeight) / deviceConfig.baseHeight,
                height: (35 * deviceFrameHeight) / deviceConfig.baseHeight,
                left: -1,
                backgroundColor: isDarkMode ? '#666' : '#999'
              }]} />
              <View style={[styles.sideButton, {
                top: (175 * deviceFrameHeight) / deviceConfig.baseHeight,
                height: (35 * deviceFrameHeight) / deviceConfig.baseHeight,
                left: -1,
                backgroundColor: isDarkMode ? '#666' : '#999'
              }]} />
              <View style={[styles.sideButton, {
                top: (150 * deviceFrameHeight) / deviceConfig.baseHeight,
                height: (60 * deviceFrameHeight) / deviceConfig.baseHeight,
                right: -1,
                backgroundColor: isDarkMode ? '#666' : '#999'
              }]} />
            </>
          )}

          {/* Tela interna */}
          <View style={[
            styles.screen,
            {
              borderRadius: deviceConfig.screenRounded,
              margin: deviceConfig.bezelPadding,
              backgroundColor: isDarkMode ? '#000' : '#fff',
            }
          ]}>
            <StatusBar isDarkMode={isDarkMode} deviceConfig={deviceConfig} deviceType={deviceType} />

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={[
                styles.scrollContent,
                {
                  paddingTop: deviceConfig.statusBarHeight + (deviceType === 'desktop' ? 20 : 10),
                  paddingBottom: deviceType === 'mobile' ? deviceConfig.homeIndicatorHeight + 20 : 30,
                  minHeight: deviceFrameHeight - deviceConfig.statusBarHeight - 20,
                }
              ]}
              showsVerticalScrollIndicator={true}
              bounces={true}
              scrollEventThrottle={16}
            >
              {/* ArticleHeader agora aparece em todos os dispositivos */}
              <ArticleHeader
                title={title}
                author={author}
                date={date}
                imageUrl={imageUrl}
                isDarkMode={isDarkMode}
                deviceType={deviceType}
              />

              {renderContent()}
            </ScrollView>

            {/* Indicador home apenas para mobile */}
            {deviceType === 'mobile' && (
              <View style={[
                styles.homeIndicator,
                {
                  backgroundColor: isDarkMode ? '#666' : '#ccc',
                  bottom: 6,
                  left: '50%',
                  marginLeft: -60
                }
              ]} />
            )}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  deviceLabel: {
    marginBottom: 12,
  },
  deviceLabelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  deviceContainer: {  // borda externa do dispositivo
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  deviceFrame: {
    overflow: 'hidden',
    position: 'relative'
  },
  screen: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  notch: {
    position: 'absolute',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notchSensor: {
    width: 40,
    height: 4,
    borderRadius: 2,
    opacity: 0.7,
  },
  sideButton: {
    position: 'absolute',
    width: 2,
    borderRadius: 1,
    opacity: 0.8,
  },
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
  },
  statusBarContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  statusBarTime: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusBarRight: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  articleHeader: {
    paddingHorizontal: 0,
  },
  articleImageContainer: {
    borderRadius: 6,
    overflow: 'hidden',
  },
  articleImage: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  articleMeta: {
    gap: 6,
  },
  articleTitle: {
    fontWeight: 'bold',
  },
  articleInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articleAuthor: {
    fontWeight: '500',
  },
  articleDate: {
    opacity: 0.8,
  },
  homeIndicator: {
    position: 'absolute',
    width: 120,
    height: 4,
    borderRadius: 2,
    opacity: 0.6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  emptyText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
