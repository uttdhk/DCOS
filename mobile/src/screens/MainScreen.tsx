import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  ActivityIndicator,
  Appbar,
} from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import ApiService from '../services/ApiService';
import * as SecureStore from 'expo-secure-store';

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface Props {
  navigation: MainScreenNavigationProp;
}

interface User {
  userId: string;
  userName: string;
}

const MainScreen: React.FC<Props> = ({ navigation }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const userStr = await SecureStore.getItemAsync('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: performLogout,
        },
      ]
    );
  };

  const performLogout = async () => {
    try {
      await ApiService.logout();
    } catch (error) {
      // 로그아웃 실패해도 클라이언트에서는 로그인 화면으로 이동
    } finally {
      await SecureStore.deleteItemAsync('user');
      navigation.replace('Login');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content 
          title="🚛 탱크로리 출하시스템" 
          titleStyle={styles.headerTitle}
        />
        <Appbar.Action 
          icon="logout" 
          onPress={handleLogout}
          color="#fff"
        />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <Title style={styles.welcomeTitle}>
              환영합니다! 👋
            </Title>
            <Paragraph style={styles.welcomeText}>
              {user?.userName} ({user?.userId})님
            </Paragraph>
            <Paragraph style={styles.welcomeSubtext}>
              탱크로리 출하 관리 시스템에 오신 것을 환영합니다.
            </Paragraph>
          </Card.Content>
        </Card>

        <View style={styles.menuContainer}>
          <Card style={styles.menuCard}>
            <Card.Content style={styles.menuContent}>
              <Text style={styles.menuIcon}>📋</Text>
              <Title style={styles.menuTitle}>출하예고 조회</Title>
              <Paragraph style={styles.menuDescription}>
                출하 예정 정보를 조회하고 상세 내용을 확인할 수 있습니다.
              </Paragraph>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('OrderList')}
                style={styles.menuButton}
              >
                조회하기
              </Button>
            </Card.Content>
          </Card>

          <Card style={styles.menuCard}>
            <Card.Content style={styles.menuContent}>
              <Text style={styles.menuIcon}>📊</Text>
              <Title style={styles.menuTitle}>출하실적 조회</Title>
              <Paragraph style={styles.menuDescription}>
                완료된 출하 실적과 품질 정보를 확인할 수 있습니다.
              </Paragraph>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('SlipList')}
                style={styles.menuButton}
              >
                조회하기
              </Button>
            </Card.Content>
          </Card>
        </View>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Title style={styles.infoTitle}>📱 모바일 앱 기능</Title>
            <View style={styles.featureList}>
              <Text style={styles.featureItem}>• 실시간 출하 현황 조회</Text>
              <Text style={styles.featureItem}>• 상세 검색 및 필터링</Text>
              <Text style={styles.featureItem}>• 출하전표 조회</Text>
              <Text style={styles.featureItem}>• 오프라인에서도 안정적 동작</Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#667eea',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  welcomeCard: {
    marginBottom: 20,
    elevation: 4,
  },
  welcomeTitle: {
    fontSize: 24,
    color: '#667eea',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  welcomeSubtext: {
    color: '#666',
    lineHeight: 22,
  },
  menuContainer: {
    marginBottom: 20,
  },
  menuCard: {
    marginBottom: 16,
    elevation: 4,
  },
  menuContent: {
    alignItems: 'center',
    padding: 20,
  },
  menuIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  menuTitle: {
    fontSize: 20,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  menuDescription: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  menuButton: {
    minWidth: 120,
  },
  infoCard: {
    elevation: 4,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    color: '#667eea',
    marginBottom: 12,
  },
  featureList: {
    paddingLeft: 8,
  },
  featureItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    lineHeight: 20,
  },
});

export default MainScreen;