import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import RichTextEditor from './RichTextEditor';
import DevicePreview from './DevicePreview';
import GlassView from './GlassView';
import { marked } from 'marked';
import { useColorScheme } from './useColorScheme';
import Colors from '@/src/constants/Colors';

export default function ArticleEditorDemo() {
  const theme = useColorScheme() ?? 'light';
  const [content, setContent] = useState(`# Welcome to Weat-Learn!

This is a **beautiful** WYSIWYG editor that supports *rich text formatting*.

## Features

- **Rich Text Editing**: Format your text with ease
- **Real-time Preview**: See changes instantly
- **Device Preview**: View how your article looks on different devices
- **Markdown Support**: Write in Markdown for better control

### Code Example

Here's some \`inline code\` and a code block:

\`\`\`
function helloWorld() {
  console.log("Hello, Weat-Learn!");
}
\`\`\`

### Quote Example

> This is a beautiful quote that demonstrates the blockquote feature.

### Links and Images

You can add [links](https://example.com) and images to make your content more engaging.

### Lists

1. **Numbered lists** are great for step-by-step instructions
2. They help organize information clearly
3. Each item can contain rich formatting

- **Bullet points** are perfect for feature lists
- They're easy to scan and read
- You can mix formatting within items

---

*Start writing your own article to see the magic happen!*`);

  const [previewMode, setPreviewMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const htmlContent = marked.parse(content) as string;

  const loadSampleContent = () => {
    setContent(`# Sample Article: The Future of Learning

In today's rapidly evolving world, **education** is undergoing a *transformative shift*.

## The Digital Revolution

The way we learn has changed dramatically with the advent of technology. Here are some key trends:

### 1. Personalized Learning

> "Education is not the filling of a pot but the lighting of a fire." - W.B. Yeats

Modern learning platforms use \`AI algorithms\` to adapt content to individual needs:

\`\`\`
function personalizeLearning(userProfile) {
  return adaptContent(userProfile.learningStyle);
}
\`\`\`

### 2. Interactive Content

- **Videos** and animations
- **Interactive quizzes**
- **Real-time collaboration**
- **Gamification elements**

### 3. Mobile-First Approach

1. **Accessibility**: Learn anywhere, anytime
2. **Microlearning**: Bite-sized content
3. **Offline capabilities**: Download for later
4. **Push notifications**: Stay engaged

---

*The future of education is bright and full of possibilities!*`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[theme].text }]}>
          🎨 WYSIWYG Editor Demo
        </Text>
        <Text style={[styles.subtitle, { color: Colors[theme].text }]}>
          Experience the power of rich text editing with real-time preview
        </Text>
      </View>

      <GlassView style={styles.demoSection}>
        <Text style={[styles.sectionTitle, { color: Colors[theme].text }]}>
          Rich Text Editor
        </Text>
        <Text style={[styles.description, { color: Colors[theme].text }]}>
          Use the toolbar above to format your text. Select text and click formatting buttons, or click buttons to insert formatted placeholders.
        </Text>
        
        <RichTextEditor
          value={content}
          onChangeText={setContent}
          placeholder="Start writing your article..."
        />

        <TouchableOpacity style={styles.loadButton} onPress={loadSampleContent}>
          <Text style={styles.loadButtonText}>Load Sample Content</Text>
        </TouchableOpacity>
      </GlassView>

      <GlassView style={styles.demoSection}>
        <Text style={[styles.sectionTitle, { color: Colors[theme].text }]}>
          Device Preview
        </Text>
        <Text style={[styles.description, { color: Colors[theme].text }]}>
          See how your article will look on different devices. The preview updates in real-time as you type!
        </Text>

        <View style={styles.previewToggles}>
          <TouchableOpacity
            style={[styles.previewToggle, previewMode === 'mobile' && styles.activeToggle]}
            onPress={() => setPreviewMode('mobile')}
          >
            <Text style={[styles.toggleText, previewMode === 'mobile' && styles.activeToggleText]}>
              📱 Mobile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.previewToggle, previewMode === 'tablet' && styles.activeToggle]}
            onPress={() => setPreviewMode('tablet')}
          >
            <Text style={[styles.toggleText, previewMode === 'tablet' && styles.activeToggleText]}>
              📱 Tablet
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.previewToggle, previewMode === 'desktop' && styles.activeToggle]}
            onPress={() => setPreviewMode('desktop')}
          >
            <Text style={[styles.toggleText, previewMode === 'desktop' && styles.activeToggleText]}>
              💻 Desktop
            </Text>
          </TouchableOpacity>
        </View>

        <DevicePreview
          htmlContent={htmlContent}
          deviceType={previewMode}
          title="Sample Article: The Future of Learning"
          author="Weat-Learn Team"
          date={new Date().toLocaleDateString()}
        />
      </GlassView>

      <View style={styles.featuresSection}>
        <Text style={[styles.sectionTitle, { color: Colors[theme].text }]}>
          ✨ Key Features
        </Text>
        <View style={styles.featuresList}>
          <View style={styles.feature}>
            <Text style={[styles.featureIcon, { color: Colors[theme].tint }]}>🎯</Text>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: Colors[theme].text }]}>Rich Text Formatting</Text>
              <Text style={[styles.featureDescription, { color: Colors[theme].text }]}>
                Bold, italic, headings, lists, links, and more with a simple toolbar
              </Text>
            </View>
          </View>
          <View style={styles.feature}>
            <Text style={[styles.featureIcon, { color: Colors[theme].tint }]}>📱</Text>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: Colors[theme].text }]}>Device Preview</Text>
              <Text style={[styles.featureDescription, { color: Colors[theme].text }]}>
                See exactly how your content will look on mobile, tablet, and desktop
              </Text>
            </View>
          </View>
          <View style={styles.feature}>
            <Text style={[styles.featureIcon, { color: Colors[theme].tint }]}>⚡</Text>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: Colors[theme].text }]}>Real-time Updates</Text>
              <Text style={[styles.featureDescription, { color: Colors[theme].text }]}>
                Preview updates instantly as you type and format your content
              </Text>
            </View>
          </View>
          <View style={styles.feature}>
            <Text style={[styles.featureIcon, { color: Colors[theme].tint }]}>🎨</Text>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: Colors[theme].text }]}>Beautiful UI</Text>
              <Text style={[styles.featureDescription, { color: Colors[theme].text }]}>
                Modern glassmorphism design that adapts to light and dark themes
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  demoSection: {
    marginBottom: 30,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  loadButton: {
    backgroundColor: Colors.light.tint,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  loadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewToggles: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  previewToggle: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: Colors.light.tint,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeToggleText: {
    color: 'white',
  },
  featuresSection: {
    marginBottom: 30,
  },
  featuresList: {
    gap: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
}); 