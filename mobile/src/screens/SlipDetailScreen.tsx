import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, Button } from 'react-native-paper';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { 
  formatDate, 
  formatNumber, 
  getGnIndicatorText, 
  getOrderTypeText,
  getESlipText,
  getAdditiveText,
  getStatusText,
  formatTime
} from '../utils/formatters';

type SlipDetailRouteProp = RouteProp<RootStackParamList, 'SlipDetail'>;
type SlipDetailNavigationProp = StackNavigationProp<RootStackParamList, 'SlipDetail'>;

interface Props {
  route: SlipDetailRouteProp;
  navigation: SlipDetailNavigationProp;
}

const SlipDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { data, shipmentNo } = route.params;

  const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value || '-'}</Text>
    </View>
  );

  const handleShowTicket = () => {
    navigation.navigate('Ticket', { shipmentNo });
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>📋 기본 정보</Title>
          <DetailItem label="예고번호" value={data.SHIPMENT_NO} />
          <DetailItem label="출하일자" value={formatDate(data.LOADING_DATE)} />
          <DetailItem label="회차" value={data.TRIP} />
          <DetailItem label="주문형태" value={getOrderTypeText(data.ORDER_TYPE)} />
          <DetailItem label="처리상태" value={getStatusText(data.ORDER_STATUS)} />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>🏢 거래처 정보</Title>
          <DetailItem label="출하지" value={`${data.PLANT_NAME} (${data.PLANT_CODE})`} />
          <DetailItem label="교환사" value={`${data.EXC_VENDOR_NAME} (${data.EXC_VENDOR})`} />
          <DetailItem label="거래처" value={`${data.SOLD_TO_NAME} (${data.SOLD_TO_CODE})`} />
          <DetailItem label="납지처" value={`${data.SHIP_TO_NAME} (${data.SHIP_TO_CODE})`} />
          <DetailItem label="수송사" value={`${data.CARRIER_NAME} (${data.CARRIER_CODE})`} />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>🚛 차량 정보</Title>
          <DetailItem label="차량번호" value={data.VEHICLE_NO} />
          <DetailItem label="차량명" value={data.VEHICLE_NAME} />
          <DetailItem label="차량카드번호" value={data.VEHICLE_CARD_NO} />
          <DetailItem label="기사명" value={`${data.DRIVER_NAME} (${data.DRIVER_CODE})`} />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>⛽ 제품 정보</Title>
          <DetailItem label="주문제품" value={`${data.ORDER_MTRL_NAME} (${data.ORDER_MTRL_CODE})`} />
          <DetailItem label="판매제품" value={`${data.SALES_MTRL_NAME} (${data.SALES_MTRL_CODE})`} />
          <DetailItem label="출하정산방식" value={getGnIndicatorText(data.GN_INDICATOR)} />
          <DetailItem label="혼합율" value={data.MIX_RATE ? `${data.MIX_RATE}%` : '-'} />
          <DetailItem label="첨가제" value={getAdditiveText(data.ADDITIVE)} />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>📊 수량 정보</Title>
          <DetailItem label="판매량" value={`${formatNumber(data.SALES_QTY)} ${data.SALES_UOM}`} />
          <DetailItem label="GROSS량" value={`${formatNumber(data.GROSS_QTY)} ${data.GROSS_UOM}`} />
          <DetailItem label="NET량" value={`${formatNumber(data.NET_QTY)} ${data.NET_UOM}`} />
          <DetailItem label="밀도" value={data.DENSITY} />
          <DetailItem label="온도" value={data.TEMPERATURE ? `${data.TEMPERATURE}°C` : '-'} />
          <DetailItem label="황함량" value={data.SURFUR} />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>📄 처리 정보</Title>
          <DetailItem label="전자전표" value={getESlipText(data.E_SLIP)} />
          <DetailItem label="증빙번호" value={data.ARMY_CODE} />
          <DetailItem label="전송상태" value={data.SEND_BIT === 'Y' ? '전송완료' : '전송전'} />
          <DetailItem label="처리코드" value={data.STATUS_CODE} />
          <DetailItem label="처리내용" value={data.STATUS_TEXT} />
          
          <View style={styles.ticketButtonContainer}>
            <Button
              mode="contained"
              onPress={handleShowTicket}
              style={styles.ticketButton}
              icon="file-document"
            >
              🎫 출하전표 보기
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>🕒 시간 정보</Title>
          <DetailItem 
            label="수신일시" 
            value={`${formatDate(data.INTERFACE_DATE)} ${formatTime(data.INTERFACE_TIME)}`} 
          />
          <DetailItem 
            label="처리일시" 
            value={`${formatDate(data.SYSTEM_DATE)} ${formatTime(data.SYSTEM_TIME)}`} 
          />
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
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#667eea',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    width: 100,
    marginRight: 10,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  ticketButtonContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  ticketButton: {
    backgroundColor: '#28a745',
  },
});

export default SlipDetailScreen;