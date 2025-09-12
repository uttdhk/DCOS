import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  Text,
} from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import ApiService from '../services/ApiService';
import * as SecureStore from 'expo-secure-store';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const response = await ApiService.checkSession();
      if (response.success) {
        // 이미 로그인되어 있음
        navigation.replace('Main');
      }
    } catch (error) {
      // 세션 없음, 로그인 화면 유지
    } finally {
      setInitialLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!userId.trim()) {
      Alert.alert('오류', '사용자ID를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await ApiService.login(userId.trim());
      
      if (response.success) {
        // 사용자 정보 저장
        await SecureStore.setItemAsync('user', JSON.stringify(response.user));
        
        Alert.alert('성공', '로그인 되었습니다.', [
          {
            text: '확인',
            onPress: () => navigation.replace('Main'),
          },
        ]);
      }
    } catch (error: any) {
      Alert.alert(
        '로그인 실패',
        error.response?.data?.message || '로그인 중 오류가 발생했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>🚛</Text>
          <Title style={styles.logoTitle}>탱크로리 출하시스템</Title>
          <Paragraph style={styles.logoSubtitle}>휘발유 · 경유 납품 관리</Paragraph>
        </View>

        <Card style={styles.loginCard}>
          <Card.Content style={styles.cardContent}>
            <Title style={styles.loginTitle}>로그인</Title>
            
            <TextInput
              label="사용자 ID"
              value={userId}
              onChangeText={setUserId}
              mode="outlined"
              style={styles.input}
              autoCapitalize="none"
              autoComplete="username"
              onSubmitEditing={handleLogin}
              disabled={loading}
            />

            <TextInput
              label="비밀번호 (추후 구현 예정)"
              mode="outlined"
              style={styles.input}
              secureTextEntry
              placeholder="현재는 ID만으로 로그인됩니다"
              disabled={true}
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
            >
              {loading ? '로그인 중...' : '로그인'}
            </Button>

            <View style={styles.demoInfo}>
              <Text style={styles.demoTitle}>데모 계정:</Text>
              <Text style={styles.demoText}>• admin (관리자)</Text>
              <Text style={styles.demoText}>• user01 (홍길동)</Text>
              <Text style={styles.demoText}>• test (테스트)</Text>
            </View>
          </Card.Content>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#667eea',
  },
  loadingText: {
    marginTop: 16,
    color: '#fff',
    fontSize: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoIcon: {
    fontSize: 80,
    marginBottom: 10,
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  logoSubtitle: {
    fontSize: 16,
    color: '#e3f2fd',
    textAlign: 'center',
    marginTop: 8,
  },
  loginCard: {
    elevation: 8,
    borderRadius: 16,
  },
  cardContent: {
    padding: 24,
  },
  loginTitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 20,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  demoInfo: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  demoTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  demoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default LoginScreen;