import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  TextInput,
  Chip,
  ActivityIndicator,
  Text,
  Divider,
} from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import ApiService from '../services/ApiService';
import { 
  formatDate, 
  getTodayDateApi, 
  formatNumber, 
  getGnIndicatorText,
  getESlipText,
  getStatusColor,
  getStatusText
} from '../utils/formatters';

type SlipListNavigationProp = StackNavigationProp<RootStackParamList, 'SlipList'>;

interface Props {
  navigation: SlipListNavigationProp;
}

interface Slip {
  SHIPMENT_NO: string;
  LOADING_DATE: string;
  PLANT_NAME: string;
  TRIP: string;
  SOLD_TO_NAME: string;
  SHIP_TO_NAME: string;
  VEHICLE_NAME: string;
  DRIVER_NAME: string;
  SALES_MTRL_NAME: string;
  GN_INDICATOR: string;
  SALES_QTY: string;
  SALES_UOM: string;
  E_SLIP: string;
  ORDER_STATUS: string;
}

const SlipListScreen: React.FC<Props> = ({ navigation }) => {
  const [slips, setSlips] = useState<Slip[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  // 검색 조건
  const [shipmentNo, setShipmentNo] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [driverName, setDriverName] = useState('');

  useEffect(() => {
    handleSearch(true);
  }, []);

  const handleSearch = async (reset: boolean = false) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const params: any = {
        page: currentPage,
        limit: 20,
        loadingDate: getTodayDateApi(),
      };

      if (shipmentNo) params.shipmentNo = shipmentNo;
      if (vehicleName) params.vehicleName = vehicleName;
      if (driverName) params.driverName = driverName;

      const response = await ApiService.getSlips(params);
      
      if (response.success) {
        if (reset) {
          setSlips(response.data);
          setPage(2);
        } else {
          setSlips(prev => [...prev, ...response.data]);
          setPage(prev => prev + 1);
        }
        
        setHasMore(response.pagination?.hasNext || false);
      }
    } catch (error: any) {
      Alert.alert(
        '조회 실패',
        error.response?.data?.message || '출하실적 조회 중 오류가 발생했습니다.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    handleSearch(true);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      handleSearch(false);
    }
  };

  const renderSlip = ({ item }: { item: Slip }) => (
    <Card style={styles.slipCard} onPress={() => 
      navigation.navigate('SlipDetail', { 
        shipmentNo: item.SHIPMENT_NO, 
        data: item 
      })
    }>
      <Card.Content>
        <View style={styles.slipHeader}>
          <Text style={styles.shipmentNo}>{item.SHIPMENT_NO}</Text>
          <Chip 
            style={[styles.statusChip, { backgroundColor: getStatusColor(item.ORDER_STATUS) }]}
            textStyle={styles.statusText}
          >
            {getStatusText(item.ORDER_STATUS)}
          </Chip>
        </View>
        
        <Title style={styles.slipTitle}>{item.PLANT_NAME}</Title>
        <Paragraph style={styles.slipDate}>
          📅 {formatDate(item.LOADING_DATE)} • {item.TRIP}회차
        </Paragraph>
        
        <Divider style={styles.divider} />
        
        <View style={styles.slipDetails}>
          <Text style={styles.detailItem}>🏢 {item.SOLD_TO_NAME}</Text>
          <Text style={styles.detailItem}>📍 {item.SHIP_TO_NAME}</Text>
          <Text style={styles.detailItem}>🚛 {item.VEHICLE_NAME}</Text>
          <Text style={styles.detailItem}>👤 {item.DRIVER_NAME}</Text>
        </View>
        
        <View style={styles.productInfo}>
          <Text style={styles.productName}>⛽ {item.SALES_MTRL_NAME}</Text>
          <Text style={styles.quantity}>
            {formatNumber(item.SALES_QTY)} {item.SALES_UOM}
          </Text>
        </View>
        
        <View style={styles.slipFooter}>
          <Text style={styles.gnIndicator}>
            {getGnIndicatorText(item.GN_INDICATOR)}
          </Text>
          <Text style={styles.eSlip}>
            {getESlipText(item.E_SLIP)}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#667eea" />
        <Text style={styles.footerText}>더 많은 데이터를 불러오는 중...</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 검색 필터 */}
      <Card style={styles.searchCard}>
        <Card.Content>
          <Title style={styles.searchTitle}>🔍 검색 조건</Title>
          
          <TextInput
            label="예고번호"
            value={shipmentNo}
            onChangeText={setShipmentNo}
            mode="outlined"
            style={styles.searchInput}
          />
          
          <TextInput
            label="차량명"
            value={vehicleName}
            onChangeText={setVehicleName}
            mode="outlined"
            style={styles.searchInput}
          />
          
          <TextInput
            label="기사명"
            value={driverName}
            onChangeText={setDriverName}
            mode="outlined"
            style={styles.searchInput}
          />
          
          <Button
            mode="contained"
            onPress={() => handleSearch(true)}
            style={styles.searchButton}
            loading={loading && !refreshing}
          >
            조회
          </Button>
        </Card.Content>
      </Card>

      {/* 결과 목록 */}
      <FlatList
        data={slips}
        renderItem={renderSlip}
        keyExtractor={(item) => item.SHIPMENT_NO}
        style={styles.slipList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>조회된 데이터가 없습니다.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchCard: {
    margin: 16,
    elevation: 4,
  },
  searchTitle: {
    fontSize: 18,
    marginBottom: 16,
    color: '#667eea',
  },
  searchInput: {
    marginBottom: 12,
  },
  searchButton: {
    marginTop: 8,
  },
  slipList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  slipCard: {
    marginBottom: 12,
    elevation: 2,
  },
  slipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shipmentNo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
  },
  statusChip: {
    height: 28,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  slipTitle: {
    fontSize: 18,
    marginBottom: 4,
    color: '#333',
  },
  slipDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  divider: {
    marginBottom: 12,
  },
  slipDetails: {
    marginBottom: 12,
  },
  detailItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  quantity: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#667eea',
  },
  slipFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gnIndicator: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  eSlip: {
    fontSize: 12,
    color: '#666',
  },
  footerLoader: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    marginTop: 8,
    color: '#666',
    fontSize: 12,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default SlipListScreen;