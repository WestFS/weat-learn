import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import HTML, { RenderHTMLProps } from 'react-native-render-html';
import GlassView from './GlassView';
import { useColorScheme } from './useColorScheme';
import Colors from '@/src/constants/Colors';

interface DevicePreviewProps {
  htmlContent: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  title?: string;
  author?: string;
  date?: string;
  imageUrl?: string;
}

export default function DevicePreview({ 
  htmlContent, 
  deviceType, 
  title = "Article Title",
  author = "Author Name",
  date = "January 1, 2024",
  imageUrl
}: DevicePreviewProps) {
  const theme = useColorScheme() ?? 'light';
  const { width } = Dimensions.get('window');

  const getDeviceDimensions = () => {
    switch (deviceType) {
      case 'mobile':
        return { width: 320, height: 600 };
      case 'tablet':
        return { width: 768, height: 800 };
      case 'desktop':
        return { width: 1024, height: 900 };
      default:
        return { width: 320, height: 600 };
    }
  };

  const deviceDimensions = getDeviceDimensions();
  const scale = Math.min((width - 40) / deviceDimensions.width, 0.8);

  const htmlTagsStyles: RenderHTMLProps["tagsStyles"] = {
    body: {
      fontFamily: 'System',
      fontSize: 16,
      lineHeight: 24,
      color: theme === 'dark' ? '#fff' : '#333',
      backgroundColor: 'transparent',
    },
    p: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 16,
      color: theme === 'dark' ? '#fff' : '#333',
    },
    h1: {
      fontSize: 28,
      fontWeight: 'bold',
      marginTop: 24,
      marginBottom: 16,
      color: theme === 'dark' ? '#fff' : '#1A1A1A',
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 12,
      color: theme === 'dark' ? '#fff' : '#1A1A1A',
    },
    h3: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 16,
      marginBottom: 8,
      color: theme === 'dark' ? '#fff' : '#1A1A1A',
    },
    ul: {
      marginBottom: 16,
      paddingLeft: 20,
    },
    li: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 8,
      color: theme === 'dark' ? '#fff' : '#333',
    },
    img: {
      maxWidth: '100%',
      height: 'auto',
      marginTop: 16,
      marginBottom: 16,
      borderRadius: 8,
    },
    a: {
      color: Colors[theme].tint,
      textDecorationLine: 'underline',
    },
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: Colors[theme].tint,
      paddingLeft: 16,
      marginVertical: 16,
      fontStyle: 'italic',
      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
      paddingVertical: 12,
      paddingRight: 12,
    },
    code: {
      backgroundColor: theme === 'dark' ? '#333' : '#f4f4f4',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      fontFamily: 'monospace',
      fontSize: 14,
    },
    pre: {
      backgroundColor: theme === 'dark' ? '#333' : '#f4f4f4',
      padding: 16,
      borderRadius: 8,
      marginVertical: 16,
      overflow: 'hidden',
    },
  };

  const renderDeviceFrame = () => {
    const frameStyle = {
      width: deviceDimensions.width * scale,
      height: deviceDimensions.height * scale,
      transform: [{ scale }],
      transformOrigin: 'top left',
    };

    return (
      <View style={[styles.deviceFrame, frameStyle]}>
        {/* Device Header */}
        <View style={[styles.deviceHeader, { backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f8f9fa' }]}>
          <View style={styles.statusBar}>
            <View style={styles.statusBarLeft}>
              <Text style={styles.statusBarTime}>9:41</Text>
            </View>
            <View style={styles.statusBarRight}>
              <View style={styles.statusBarBattery} />
              <View style={styles.statusBarWifi} />
              <View style={styles.statusBarSignal} />
            </View>
          </View>
        </View>

        {/* Article Header */}
        <View style={[styles.articleHeader, { backgroundColor: theme === 'dark' ? '#000' : '#fff' }]}>
          {imageUrl && (
            <View style={styles.articleImageContainer}>
              <View style={[styles.articleImage, { backgroundColor: '#ddd' }]} />
            </View>
          )}
          <View style={styles.articleMeta}>
            <Text style={[styles.articleTitle, { color: theme === 'dark' ? '#fff' : '#1A1A1A' }]}>
              {title}
            </Text>
            <View style={styles.articleInfo}>
              <Text style={[styles.articleAuthor, { color: theme === 'dark' ? '#ccc' : '#666' }]}>
                {author}
              </Text>
              <Text style={[styles.articleDate, { color: theme === 'dark' ? '#999' : '#888' }]}>
                {date}
              </Text>
            </View>
          </View>
        </View>

        {/* Article Content */}
        <View style={[styles.articleContent, { backgroundColor: theme === 'dark' ? '#000' : '#fff' }]}>
          {htmlContent ? (
            <HTML
              source={{ html: htmlContent }}
              contentWidth={deviceDimensions.width - 32}
              tagsStyles={htmlTagsStyles}
              enableExperimentalMarginCollapsing={true}
            />
          ) : (
            <View style={styles.emptyContent}>
              <Text style={[styles.emptyText, { color: theme === 'dark' ? '#666' : '#999' }]}>
                Start writing to see the preview...
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <GlassView style={styles.previewContainer}>
        <View style={styles.deviceLabel}>
          <Text style={[styles.deviceLabelText, { color: Colors[theme].text }]}>
            {deviceType.charAt(0).toUpperCase() + deviceType.slice(1)} Preview
          </Text>
        </View>
        {renderDeviceFrame()}
      </GlassView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  previewContainer: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
  },
  deviceLabel: {
    marginBottom: 16,
  },
  deviceLabelText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deviceFrame: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#000',
  },
  deviceHeader: {
    height: 44,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBarTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusBarBattery: {
    width: 24,
    height: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  statusBarWifi: {
    width: 16,
    height: 12,
    backgroundColor: '#2196F3',
    borderRadius: 2,
  },
  statusBarSignal: {
    width: 16,
    height: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  articleHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  articleImageContainer: {
    marginBottom: 16,
  },
  articleImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  articleMeta: {
    gap: 8,
  },
  articleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  articleInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articleAuthor: {
    fontSize: 14,
    fontWeight: '500',
  },
  articleDate: {
    fontSize: 12,
  },
  articleContent: {
    flex: 1,
    padding: 16,
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 