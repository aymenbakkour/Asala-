
import { Order } from '../types';
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from '../constants';

export const sendOrderToTelegram = async (order: Order): Promise<boolean> => {
  const { items, customer, total } = order;

  let message = `🛒 *طلب جديد من متجر الأصالة*\n\n`;
  message += `👤 *العميل:* ${customer.name}\n`;
  message += `📱 *واتساب:* ${customer.whatsapp}\n`;
  message += `📅 *تاريخ التسليم:* ${customer.deliveryDate}\n`;
  message += `📝 *ملاحظات:* ${customer.notes || 'لا يوجد'}\n\n`;
  
  message += `📋 *المنتجات:*\n`;
  items.forEach((item) => {
    message += `• ${item.name}: ${item.quantity} قطعة x ${item.price}€ = ${(item.quantity * item.price).toFixed(2)}€\n`;
  });

  message += `\n💰 *المجموع الكلي: ${total.toFixed(2)}€*`;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
    return false;
  }
};
