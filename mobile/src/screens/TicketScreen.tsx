import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import ApiService from '../services/ApiService';

type TicketRouteProp = RouteProp<RootStackParamList, 'Ticket'>;

interface Props {
  route: TicketRouteProp;
}

const TicketScreen: React.FC<Props> = ({ route }) => {
  const { shipmentNo } = route.params;
  const [loading, setLoading] = useState(true);
  const [ticketContent, setTicketContent] = useState('');

  useEffect(() => {
    loadTicket();
  }, []);

  const loadTicket = async () => {
    try {
      const response = await ApiService.getTicket(shipmentNo);
      
      if (response.success) {
        setTicketContent(response.data.contents || '');
      }
    } catch (error: any) {
      Alert.alert(
        '조회 실패',
        error.response?.data?.message || '출하전표 조회 중 오류가 발생했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>출하전표를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>
            🎫 출하전표 내용
          </Title>
          <Text style={styles.shipmentNo}>
            예고번호: {shipmentNo}
          </Text>
          
          <View style={styles.ticketContainer}>
            <Text style={styles.ticketContent}>
              {ticketContent || '출하전표 내용이 없습니다.'}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
  card: {
    elevation: 4,
  },
  title: {
    fontSize: 20,
    color: '#667eea',
    marginBottom: 8,
    textAlign: 'center',
  },
  shipmentNo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  ticketContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  ticketContent: {
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    textAlign: 'left',
  },
});

export default TicketScreen;