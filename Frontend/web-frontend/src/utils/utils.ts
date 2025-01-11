/* eslint-disable @typescript-eslint/no-magic-numbers */

import { OrderStatus } from '../api/OrderApi';
import { SyntheticEvent } from 'react';

export function getNoun(number: number, one: string, few: string, others: string) {
	let n = Math.abs(number);
	n %= 100;

	if (n >= 5 && n <= 20) {
		return others;
	}
	n %= 10;
	if (n === 1) {
		return one;
	}
	if (n >= 2 && n <= 4) {
		return few;
	}
	return others;
}

export function decoratePrice(price: number): string {
	return new Intl.NumberFormat('ru-RU').format(price);
}

export function translateOrderStatus(status: OrderStatus) {
	switch (status) {
	case OrderStatus.Created:
		return 'создан';
	case OrderStatus.Assembly:
		return 'в сборке';
	case OrderStatus.OnTheWay:
		return 'в пути';
	case OrderStatus.AwaitingReceipt:
		return 'ожидает получения';
	case OrderStatus.Received:
		return 'получен';
	case OrderStatus.Canceled:
		return 'отменен';
	}
}

export function logoFallback(event: SyntheticEvent<HTMLImageElement, Event>) {
	event.currentTarget.onerror = null;
	event.currentTarget.style.display = 'none';
}
