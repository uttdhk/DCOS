import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// 날짜 포맷팅 (YYYYMMDD -> YYYY-MM-DD)
export function formatDate(dateStr: string): string {
  if (!dateStr || dateStr.length !== 8) return '';
  return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
}

// 날짜 포맷팅 (YYYY-MM-DD -> YYYYMMDD)
export function formatDateToApi(dateStr: string): string {
  if (!dateStr) return '';
  return dateStr.replace(/-/g, '');
}

// 오늘 날짜 가져오기 (YYYY-MM-DD)
export function getTodayDate(): string {
  const today = new Date();
  return format(today, 'yyyy-MM-dd');
}

// 오늘 날짜 가져오기 (YYYYMMDD)
export function getTodayDateApi(): string {
  return formatDateToApi(getTodayDate());
}

// 숫자 포맷팅 (천 단위 콤마)
export function formatNumber(num: string | number): string {
  if (!num) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 출하정산방식 텍스트 변환
export function getGnIndicatorText(indicator: string): string {
  switch(indicator) {
    case '1': return 'GROSS출하/GROSS정산';
    case '2': return 'GROSS출하/NET정산';
    case '600': return 'NET출하/NET정산';
    default: return indicator;
  }
}

// 주문형태 텍스트 변환
export function getOrderTypeText(orderType: string): string {
  switch(orderType) {
    case 'YOR': return '판매';
    case 'YERO': return '교환';
    case 'YUB': return '이관';
    default: return orderType;
  }
}

// 전자전표 텍스트 변환
export function getESlipText(eSlip: string): string {
  return eSlip === 'Y' ? '전자전표' : '종이전표';
}

// 처리상태 텍스트 변환
export function getStatusText(status: string): string {
  switch(status) {
    case '0': return '출하전';
    case '1': return '출하중';
    case '2': return '출하완료';
    default: return status;
  }
}

// 첨가제 주입여부 텍스트 변환
export function getAdditiveText(additive: string): string {
  return additive === 'Y' ? '주입' : '미주입';
}

// 처리상태 색상 반환
export function getStatusColor(status: string): string {
  switch(status) {
    case '0': return '#ffc107'; // 노랑 (출하전)
    case '1': return '#17a2b8'; // 파랑 (출하중)
    case '2': return '#28a745'; // 초록 (출하완료)
    default: return '#6c757d'; // 회색
  }
}

// 시간 포맷팅 (HHMMSS -> HH:MM:SS)
export function formatTime(timeStr: string): string {
  if (!timeStr || timeStr.length < 6) return '';
  return `${timeStr.substring(0,2)}:${timeStr.substring(2,4)}:${timeStr.substring(4,6)}`;
}