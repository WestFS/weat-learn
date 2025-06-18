import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassView from './GlassView';
import Colors from '@/src/constants/Colors';
import { useColorScheme } from './useColorScheme';

interface RichTextEditorProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: any;
}

interface FormatAction {
  icon: string;
  action: () => void;
  label: string;
}

export default function RichTextEditor({ 
  value, 
  onChangeText, 
  placeholder = "Start writing your article...",
  style 
}: RichTextEditorProps) {
  const theme = useColorScheme() ?? 'light';
  const inputRef = useRef<TextInput>(null);
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const insertText = (text: string) => {
    const start = selection.start;
    const end = selection.end;
    const newText = value.substring(0, start) + text + value.substring(end);
    onChangeText(newText);
    
    // Update cursor position
    const newPosition = start + text.length;
    setSelection({ start: newPosition, end: newPosition });
    
    // Focus back to input
    setTimeout(() => {
      inputRef.current?.focus();
      if (Platform.OS !== 'web' && inputRef.current?.setNativeProps) {
        inputRef.current.setNativeProps({
          selection: { start: newPosition, end: newPosition }
        });
      }
    }, 100);
  };

  const formatText = (format: string) => {
    const start = selection.start;
    const end = selection.end;
    
    if (start === end) {
      // No text selected, insert format markers
      const formatMap: { [key: string]: string } = {
        bold: '**bold text**',
        italic: '*italic text*',
        code: '`code`',
        link: '[link text](url)',
        image: '![alt text](image-url)',
        quote: '> quote text',
        list: '- list item',
        numberedList: '1. numbered item',
        h1: '# Heading 1',
        h2: '## Heading 2',
        h3: '### Heading 3',
      };
      
      insertText(formatMap[format] || '');
    } else {
      // Text is selected, wrap it with format markers
      const selectedText = value.substring(start, end);
      let formattedText = '';
      
      switch (format) {
        case 'bold':
          formattedText = `**${selectedText}**`;
          break;
        case 'italic':
          formattedText = `*${selectedText}*`;
          break;
        case 'code':
          formattedText = `\`${selectedText}\``;
          break;
        case 'link':
          formattedText = `[${selectedText}](url)`;
          break;
        case 'quote':
          formattedText = `> ${selectedText}`;
          break;
        case 'h1':
          formattedText = `# ${selectedText}`;
          break;
        case 'h2':
          formattedText = `## ${selectedText}`;
          break;
        case 'h3':
          formattedText = `### ${selectedText}`;
          break;
        default:
          formattedText = selectedText;
      }
      
      const newText = value.substring(0, start) + formattedText + value.substring(end);
      onChangeText(newText);
      setSelection({ start: start, end: start + formattedText.length });
    }
  };

  const formatActions: FormatAction[] = [
    { icon: 'text', action: () => formatText('h1'), label: 'Heading 1' },
    { icon: 'text', action: () => formatText('h2'), label: 'Heading 2' },
    { icon: 'text', action: () => formatText('h3'), label: 'Heading 3' },
    { icon: 'bold', action: () => formatText('bold'), label: 'Bold' },
    { icon: 'italic', action: () => formatText('italic'), label: 'Italic' },
    { icon: 'code', action: () => formatText('code'), label: 'Code' },
    { icon: 'link', action: () => formatText('link'), label: 'Link' },
    { icon: 'image', action: () => formatText('image'), label: 'Image' },
    { icon: 'chatbubble', action: () => formatText('quote'), label: 'Quote' },
    { icon: 'list', action: () => formatText('list'), label: 'List' },
    { icon: 'list-circle', action: () => formatText('numberedList'), label: 'Numbered List' },
  ];

  return (
    <View style={[styles.container, style]}>
      {/* Formatting Toolbar */}
      <GlassView style={styles.toolbar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {formatActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.toolbarButton}
              onPress={action.action}
            >
              <Ionicons 
                name={action.icon as any} 
                size={20} 
                color={Colors[theme].text} 
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </GlassView>

      {/* Text Input */}
      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          {
            backgroundColor: Colors[theme].inputBackground,
            color: Colors[theme].inputText,
            borderColor: theme === 'dark' ? '#444' : '#ddd',
          }
        ]}
        multiline
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme === 'dark' ? '#888' : '#999'}
        onSelectionChange={(event) => setSelection(event.nativeEvent.selection)}
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  toolbar: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  toolbarButton: {
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 6,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    minHeight: 200,
    fontSize: 16,
    lineHeight: 24,
  },
}); 