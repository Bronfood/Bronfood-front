import { useState } from 'react';
import styles from './MobileOrders.module.scss';
import OrderCard from './components/OrderCard/OrderCard';
import BottomNav from './components/BottomNav/BottomNav';
import Tabs from './components/Tabs/Tabs';
import { AdminOrder } from '../../utils/api/adminService/adminService';

const mockOrders: AdminOrder[] = [
    {
        id: 1,
        userName: 'Иван',
        orderCode: '#LKJ65',
        meals: [
            { id: 1, meal: { id: 1, name: 'Донер', price: 800, waitingTime: 15 }, count: 1, price: 800, choices: [] },
            { id: 2, meal: { id: 2, name: 'Сырный соус', price: 200, waitingTime: 1 }, count: 2, price: 400, choices: [] },
            { id: 3, meal: { id: 3, name: 'Картофель фри', price: 1200, waitingTime: 10 }, count: 1, price: 1200, choices: [] },
        ],
        acceptedAt: '',
        readyAt: '',
        issuedAt: '',
        cancelledAt: '',
        status: 'paid',
        waitingTime: 15,
    },
    {
        id: 2,
        userName: 'Иван',
        orderCode: '#LKJ65',
        meals: [
            { id: 4, meal: { id: 4, name: 'Донер', price: 800, waitingTime: 15 }, count: 1, price: 800, choices: [] },
            { id: 5, meal: { id: 5, name: 'сырный соус', price: 200, waitingTime: 1 }, count: 1, price: 200, choices: [] },
            { id: 6, meal: { id: 6, name: 'кебаб', price: 1600, waitingTime: 20 }, count: 1, price: 1600, choices: [] },
        ],
        acceptedAt: '',
        readyAt: '',
        issuedAt: '',
        cancelledAt: '',
        status: '',
        waitingTime: 15,
    },
    {
        id: 3,
        userName: 'Bronfood',
        orderCode: '#DDR65',
        meals: [
            { id: 7, meal: { id: 7, name: 'Донер', price: 800, waitingTime: 15 }, count: 1, price: 800, choices: [] },
            { id: 8, meal: { id: 8, name: 'сырный соус', price: 200, waitingTime: 1 }, count: 1, price: 200, choices: [] },
            { id: 9, meal: { id: 9, name: 'кебаб', price: 1600, waitingTime: 20 }, count: 1, price: 1600, choices: [] },
        ],
        acceptedAt: '',
        readyAt: '',
        issuedAt: '',
        cancelledAt: '',
        status: 'paid',
        waitingTime: 15,
    },
];

type TabName = 'new' | 'inWork' | 'ready' | 'preorder';

function MobileOrders() {
    const [activeTab, setActiveTab] = useState<TabName>('new');
    const [orders, setOrders] = useState<AdminOrder[]>(mockOrders);

    const handleAcceptOrder = (orderId: number) => {
        setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: 'accepted' as const } : order)));
    };

    return (
        <div className={styles['mobile-orders']}>
            <header className={styles['mobile-orders__header']}>
                <button className={styles['mobile-orders__menu-btn']}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6h18M3 12h18M3 18h18" stroke="#282828" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
                <div className={styles['mobile-orders__avatar']}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <circle cx="20" cy="20" r="20" fill="#4a90d9" />
                        <circle cx="20" cy="16" r="6" fill="#fff" />
                        <path d="M10 34c0-5.523 4.477-10 10-10s10 4.477 10 10" fill="#fff" />
                    </svg>
                </div>
                <div className={styles['mobile-orders__spacer']} />
            </header>

            <main className={styles['mobile-orders__main']}>
                <div className={styles['orders-list']}>
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} onAccept={handleAcceptOrder} />
                    ))}
                </div>

                <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
            </main>

            <BottomNav />
        </div>
    );
}

export default MobileOrders;
