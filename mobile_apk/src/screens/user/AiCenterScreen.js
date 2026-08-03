import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Send, Bot, User, Sparkles } from 'lucide-react-native';
import Header from '../../components/Header';
import axiosClient from '../../api/axiosClient';
import { ENDPOINTS } from '../../api/config';

export default function AiCenterScreen({ navigation }) {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am your Shop Mart AI Shopping Assistant. How can I help you today? (e.g. find products, tracking orders, return policies)',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = inputText.trim();
    setInputText('');
    setLoading(true);

    try {
      const res = await axiosClient.post(ENDPOINTS.AI_HELP, { message: query });
      const aiReply = res.data?.reply || res.data?.message || 'I found some helpful recommendations for you on Shop Mart!';

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: aiReply,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'Sorry, I am having trouble connecting right now. Please try again shortly.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    'Best electronics deals?',
    'What is the return policy?',
    'How do I track my order?',
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <Header title="AI Center" showBack onBack={() => navigation.goBack()} />

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        renderItem={({ item }) => {
          const isAi = item.sender === 'ai';
          return (
            <View style={[styles.bubbleWrapper, isAi ? styles.aiWrapper : styles.userWrapper]}>
              <View style={[styles.avatarBox, isAi ? styles.aiAvatar : styles.userAvatar]}>
                {isAi ? <Bot size={16} color="#2563eb" /> : <User size={16} color="#ffffff" />}
              </View>
              <View style={[styles.bubble, isAi ? styles.aiBubble : styles.userBubble]}>
                <Text style={[styles.bubbleText, isAi ? styles.aiText : styles.userText]}>
                  {item.text}
                </Text>
              </View>
            </View>
          );
        }}
      />

      {/* Suggested Questions */}
      <View style={styles.suggestionsContainer}>
        {suggestions.map((sug, i) => (
          <TouchableOpacity
            key={i}
            style={styles.sugChip}
            onPress={() => {
              setInputText(sug);
            }}
          >
            <Sparkles size={12} color="#2563eb" />
            <Text style={styles.sugText}>{sug}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Input Section */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          placeholder="Ask AI anything about Shop Mart..."
          placeholderTextColor="#94a3b8"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={loading}>
          <Send size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  messageList: {
    padding: 16,
    gap: 12,
  },
  bubbleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  aiWrapper: {
    alignSelf: 'flex-start',
    maxWidth: '85%',
  },
  userWrapper: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
    maxWidth: '85%',
  },
  avatarBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiAvatar: {
    backgroundColor: '#eff6ff',
  },
  userAvatar: {
    backgroundColor: '#2563eb',
  },
  bubble: {
    padding: 12,
    borderRadius: 16,
  },
  aiBubble: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderTopLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#2563eb',
    borderTopRightRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  aiText: {
    color: '#0f172a',
  },
  userText: {
    color: '#ffffff',
  },
  suggestionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  sugChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  sugText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 8,
  },
  textInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#f1f5f9',
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#0f172a',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
